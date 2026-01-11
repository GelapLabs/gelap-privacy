import {
  type Address,
  type Hex,
  type WalletClient,
  type PublicClient,
  bytesToHex,
  hexToBytes,
} from "viem";

import type {
  WalletKeys,
  Commitment,
  StealthAddress,
  PrivateBalance,
} from "./types";
import { KeyDerivation } from "./keyDerivation";
import { CommitmentGenerator } from "./commitment";
import { StealthAddressGenerator } from "./stealthAddress";
import { MerkleTree, computeNullifier } from "./merkleTree";
import {
  ContractService,
  createContractService,
  type AccountUpdatedEvent,
} from "./contractService";

// ============================================================================
// Note (UTXO) Types
// ============================================================================

export interface Note {
  commitment: Hex;
  amount: bigint;
  blinding: Hex;
  token: Address;
  leafIndex: number;
  nullifier: Hex;
  spent: boolean;
  blockNumber: bigint;
}

export interface PrivacyWalletState {
  keys: WalletKeys | null;
  notes: Note[];
  merkleTree: MerkleTree;
  lastSyncedBlock: bigint;
  isInitialized: boolean;
}

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEYS = {
  WALLET_KEYS: "gelap_wallet_keys",
  NOTES: "gelap_notes",
  MERKLE_TREE: "gelap_merkle_tree",
  LAST_SYNCED_BLOCK: "gelap_last_synced_block",
} as const;

// ============================================================================
// Privacy Wallet Class
// ============================================================================

export class PrivacyWallet {
  private state: PrivacyWalletState;
  private contractService: ContractService | null = null;

  constructor() {
    this.state = {
      keys: null,
      notes: [],
      merkleTree: new MerkleTree(),
      lastSyncedBlock: 0n,
      isInitialized: false,
    };
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================

  /**
   * Initialize the privacy wallet from a connected wallet
   */
  async initialize(
    walletClient: WalletClient,
    publicClient: PublicClient,
    chainId?: number
  ): Promise<void> {
    // Try to load existing keys from storage
    const existingKeys = this.loadKeysFromStorage();

    if (existingKeys) {
      const [address] = await walletClient.getAddresses();
      if (existingKeys.address === address) {
        this.state.keys = existingKeys;
      }
    }

    // Generate keys if not loaded
    if (!this.state.keys) {
      this.state.keys = await KeyDerivation.generateKeysFromWallet(walletClient);
      this.saveKeysToStorage(this.state.keys);
    }

    // Initialize contract service
    this.contractService = createContractService(
      publicClient,
      walletClient,
      chainId
    );

    // Load notes and tree from storage
    this.loadStateFromStorage();

    // Sync with on-chain state
    await this.syncWithChain();

    this.state.isInitialized = true;
  }

  /**
   * Check if wallet is initialized
   */
  isInitialized(): boolean {
    return this.state.isInitialized;
  }

  // ==========================================================================
  // Key Management
  // ==========================================================================

  /**
   * Get the wallet keys (if initialized)
   */
  getKeys(): WalletKeys | null {
    return this.state.keys;
  }

  /**
   * Get public keys for sharing (view and spend public keys)
   */
  getPublicKeys(): { viewPublicKey: Hex; spendPublicKey: Hex } | null {
    if (!this.state.keys) return null;
    return KeyDerivation.exportPublicKeys(this.state.keys);
  }

  /**
   * Get the wallet address
   */
  getAddress(): Address | null {
    return this.state.keys?.address ?? null;
  }

  // ==========================================================================
  // Balance & Notes
  // ==========================================================================

  /**
   * Get total shielded balance (sum of unspent notes)
   */
  getShieldedBalance(): bigint {
    return this.state.notes
      .filter((n) => !n.spent)
      .reduce((sum, n) => sum + n.amount, 0n);
  }

  /**
   * Get balance by token
   */
  getBalanceByToken(): Map<Address, bigint> {
    const balances = new Map<Address, bigint>();

    for (const note of this.state.notes) {
      if (note.spent) continue;

      const current = balances.get(note.token) ?? 0n;
      balances.set(note.token, current + note.amount);
    }

    return balances;
  }

  /**
   * Get unspent notes
   */
  getUnspentNotes(): Note[] {
    return this.state.notes.filter((n) => !n.spent);
  }

  /**
   * Get notes for a specific token
   */
  getNotesForToken(token: Address): Note[] {
    return this.state.notes.filter(
      (n) => !n.spent && n.token.toLowerCase() === token.toLowerCase()
    );
  }

  /**
   * Select notes for a transaction (greedy algorithm)
   */
  selectNotesForAmount(
    token: Address,
    targetAmount: bigint
  ): { notes: Note[]; total: bigint } {
    const availableNotes = this.getNotesForToken(token).sort(
      (a, b) => Number(b.amount - a.amount) // Sort by amount descending
    );

    const selected: Note[] = [];
    let total = 0n;

    for (const note of availableNotes) {
      if (total >= targetAmount) break;
      selected.push(note);
      total += note.amount;
    }

    return { notes: selected, total };
  }

  // ==========================================================================
  // Stealth Addresses
  // ==========================================================================

  /**
   * Generate a stealth address for receiving funds
   */
  generateReceiveAddress(): StealthAddress | null {
    if (!this.state.keys) return null;

    const publicKeys = this.getPublicKeys();
    if (!publicKeys) return null;

    return StealthAddressGenerator.generateStealthAddress(
      publicKeys.viewPublicKey,
      publicKeys.spendPublicKey
    );
  }

  /**
   * Check if a stealth address belongs to this wallet
   */
  checkStealthOwnership(stealthAddress: StealthAddress): boolean {
    if (!this.state.keys) return false;

    const publicKeys = this.getPublicKeys();
    if (!publicKeys) return false;

    return StealthAddressGenerator.checkOwnership(
      stealthAddress,
      bytesToHex(this.state.keys.viewPrivateKey),
      publicKeys.spendPublicKey
    );
  }

  /**
   * Compute private key for a stealth address (to spend funds)
   */
  computeStealthPrivateKey(
    ephemeralPublicKey: Hex
  ): Hex | null {
    if (!this.state.keys) return null;

    return StealthAddressGenerator.computeStealthPrivateKey(
      ephemeralPublicKey,
      bytesToHex(this.state.keys.viewPrivateKey),
      bytesToHex(this.state.keys.spendPrivateKey)
    );
  }

  // ==========================================================================
  // Commitments
  // ==========================================================================

  /**
   * Create a commitment for a deposit
   */
  createCommitment(amount: bigint): Commitment {
    return CommitmentGenerator.createCommitment(amount);
  }

  /**
   * Verify a commitment
   */
  verifyCommitment(commitment: Hex, amount: bigint, blinding: Hex): boolean {
    return CommitmentGenerator.verifyCommitment(commitment, amount, blinding);
  }

  // ==========================================================================
  // Merkle Tree
  // ==========================================================================

  /**
   * Get the current Merkle root
   */
  getMerkleRoot(): Hex {
    return this.state.merkleTree.root;
  }

  /**
   * Generate a Merkle proof for a note
   */
  generateMerkleProof(leafIndex: number): {
    leaf: Hex;
    pathElements: Hex[];
    pathIndices: number[];
  } {
    return this.state.merkleTree.generateProof(leafIndex);
  }

  // ==========================================================================
  // Transactions
  // ==========================================================================

  /**
   * Prepare a deposit transaction
   */
  async prepareDeposit(
    token: Address,
    amount: bigint
  ): Promise<{
    commitment: Commitment;
    token: Address;
    amount: bigint;
  }> {
    const commitment = this.createCommitment(amount);

    return {
      commitment,
      token,
      amount,
    };
  }

  /**
   * Execute a deposit
   */
  async executeDeposit(
    token: Address,
    amount: bigint,
    commitment: Commitment
  ): Promise<{ txHash: Hex; note: Note }> {
    if (!this.contractService) {
      throw new Error("Contract service not initialized");
    }

    // Execute deposit on contract
    const txHash = await this.contractService.deposit({
      token,
      amount,
      commitment: commitment.commitment,
    });

    // Wait for confirmation
    const result = await this.contractService.waitForTransaction(txHash);
    if (!result.success) {
      throw new Error("Deposit transaction failed");
    }

    // Create note
    const leafIndex = this.state.merkleTree.nextLeafIndex;
    this.state.merkleTree.insertLeaf(commitment.commitment);

    const nullifier = computeNullifier(
      bytesToHex(this.state.keys!.spendPrivateKey),
      leafIndex,
      commitment.commitment
    );

    const note: Note = {
      commitment: commitment.commitment,
      amount: commitment.amount,
      blinding: commitment.blinding,
      token,
      leafIndex,
      nullifier,
      spent: false,
      blockNumber: result.blockNumber,
    };

    // Add note and save
    this.state.notes.push(note);
    this.saveStateToStorage();

    return { txHash, note };
  }

  /**
   * Mark notes as spent
   */
  markNotesSpent(nullifiers: Hex[]): void {
    for (const nullifier of nullifiers) {
      const note = this.state.notes.find(
        (n) => n.nullifier.toLowerCase() === nullifier.toLowerCase()
      );
      if (note) {
        note.spent = true;
      }
    }
    this.saveStateToStorage();
  }

  // ==========================================================================
  // Chain Sync
  // ==========================================================================

  /**
   * Sync with on-chain state
   */
  async syncWithChain(): Promise<void> {
    if (!this.contractService) return;

    try {
      // If no notes and never synced, skip heavy sync
      // User's own deposits will add notes directly
      if (this.state.notes.length === 0 && this.state.lastSyncedBlock === 0n) {
        console.log("Skipping initial sync - no local notes to verify");
        return;
      }

      // Get all commitments since last sync
      const events = await this.contractService.getAccountUpdatedEvents(
        this.state.lastSyncedBlock
      );

      // Sync Merkle tree with new commitments
      for (const event of events) {
        const existingIndex = this.state.merkleTree.findLeafIndex(
          event.commitment
        );
        if (existingIndex === -1) {
          this.state.merkleTree.insertLeaf(event.commitment);
        }
      }

      // Update last synced block
      if (events.length > 0) {
        this.state.lastSyncedBlock =
          events[events.length - 1].blockNumber + 1n;
      }

      // Check for spent notes (nullifiers used)
      for (const note of this.state.notes) {
        if (note.spent) continue;

        const isUsed = await this.contractService.isNullifierUsed(
          note.nullifier
        );
        if (isUsed) {
          note.spent = true;
        }
      }

      this.saveStateToStorage();
    } catch (error) {
      console.error("Failed to sync with chain:", error);
    }
  }

  // ==========================================================================
  // Storage
  // ==========================================================================

  private loadKeysFromStorage(): WalletKeys | null {
    if (typeof window === "undefined") return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WALLET_KEYS);
      if (stored) {
        return KeyDerivation.deserializeKeys(stored);
      }
    } catch (error) {
      console.error("Failed to load keys from storage:", error);
    }
    return null;
  }

  private saveKeysToStorage(keys: WalletKeys): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        STORAGE_KEYS.WALLET_KEYS,
        KeyDerivation.serializeKeys(keys)
      );
    } catch (error) {
      console.error("Failed to save keys to storage:", error);
    }
  }

  private loadStateFromStorage(): void {
    if (typeof window === "undefined") return;

    try {
      // Load notes
      const notesJson = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (notesJson) {
        const parsed = JSON.parse(notesJson);
        this.state.notes = parsed.map((n: any) => ({
          ...n,
          amount: BigInt(n.amount),
          blockNumber: BigInt(n.blockNumber),
        }));
      }

      // Load Merkle tree
      const treeJson = localStorage.getItem(STORAGE_KEYS.MERKLE_TREE);
      if (treeJson) {
        this.state.merkleTree = MerkleTree.deserialize(treeJson);
      }

      // Load last synced block
      const lastBlock = localStorage.getItem(STORAGE_KEYS.LAST_SYNCED_BLOCK);
      if (lastBlock) {
        this.state.lastSyncedBlock = BigInt(lastBlock);
      }
    } catch (error) {
      console.error("Failed to load state from storage:", error);
    }
  }

  private saveStateToStorage(): void {
    if (typeof window === "undefined") return;

    try {
      // Save notes (serialize BigInt)
      const notesJson = JSON.stringify(
        this.state.notes.map((n) => ({
          ...n,
          amount: n.amount.toString(),
          blockNumber: n.blockNumber.toString(),
        }))
      );
      localStorage.setItem(STORAGE_KEYS.NOTES, notesJson);

      // Save Merkle tree
      localStorage.setItem(
        STORAGE_KEYS.MERKLE_TREE,
        this.state.merkleTree.serialize()
      );

      // Save last synced block
      localStorage.setItem(
        STORAGE_KEYS.LAST_SYNCED_BLOCK,
        this.state.lastSyncedBlock.toString()
      );
    } catch (error) {
      console.error("Failed to save state to storage:", error);
    }
  }

  /**
   * Clear all stored data (for debugging/reset)
   */
  clearStorage(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(STORAGE_KEYS.WALLET_KEYS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.MERKLE_TREE);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNCED_BLOCK);

    this.state = {
      keys: null,
      notes: [],
      merkleTree: new MerkleTree(),
      lastSyncedBlock: 0n,
      isInitialized: false,
    };
  }

  // ==========================================================================
  // Contract Service Access
  // ==========================================================================

  /**
   * Get the contract service instance
   */
  getContractService(): ContractService | null {
    return this.contractService;
  }
}

/**
 * Create a new PrivacyWallet instance
 */
export function createPrivacyWallet(): PrivacyWallet {
  return new PrivacyWallet();
}
