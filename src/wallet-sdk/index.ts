// =============================================================================
// Gelap Wallet SDK
// Privacy-preserving wallet operations for the Gelap shielded pool
// =============================================================================

// Types
export type {
  KeyPair,
  WalletKeys,
  StealthAddress,
  Commitment,
  PrivateBalance,
  TransactionData,
} from "./types";

// Key Derivation
export { KeyDerivation } from "./keyDerivation";

// Commitment Generation
export { CommitmentGenerator } from "./commitment";

// Stealth Addresses
export { StealthAddressGenerator } from "./stealthAddress";

// Merkle Tree
export {
  MerkleTree,
  createMerkleTreeFromCommitments,
  computeNullifier,
} from "./merkleTree";

// Contract Service
export {
  ContractService,
  createContractService,
  type DepositParams,
  type TransactParams,
  type WithdrawParams,
  type SwapParams,
  type AccountUpdatedEvent,
  type TransactionExecutedEvent,
  type WithdrawExecutedEvent,
  type TransactionProofRequest,
  type WithdrawProofRequest,
  type ProofResponse,
} from "./contractService";

// Privacy Wallet
export {
  PrivacyWallet,
  createPrivacyWallet,
  type Note,
  type PrivacyWalletState,
} from "./wallet";
