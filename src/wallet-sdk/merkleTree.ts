import {
  type Address,
  type Hex,
  type PublicClient,
  type WalletClient,
  keccak256,
  bytesToHex,
  hexToBytes,
  encodePacked,
} from "viem";

import { MERKLE_TREE_DEPTH } from "@/src/lib/constants";

/**
 * Client-side incremental Merkle tree for tracking commitments.
 * Mirrors the on-chain Merkle tree structure from GelapShieldedAccount.sol
 */
export class MerkleTree {
  private tree: Map<string, Hex>; // level-index -> hash
  private zeroHashes: Hex[];
  private _nextLeafIndex: number;
  private _root: Hex;

  constructor() {
    this.tree = new Map();
    this.zeroHashes = this.computeZeroHashes();
    this._nextLeafIndex = 0;
    this._root = this.zeroHashes[MERKLE_TREE_DEPTH - 1];
  }

  /**
   * Compute zero hashes for each level (matches contract's _initZeroHashes)
   */
  private computeZeroHashes(): Hex[] {
    const zeros: Hex[] = new Array(MERKLE_TREE_DEPTH);

    // zeroHashes[0] = keccak256(abi.encodePacked(uint256(0)))
    zeros[0] = keccak256(encodePacked(["uint256"], [0n]));

    // Each subsequent level: H(prev, prev)
    for (let i = 1; i < MERKLE_TREE_DEPTH; i++) {
      zeros[i] = keccak256(encodePacked(["bytes32", "bytes32"], [zeros[i - 1], zeros[i - 1]]));
    }

    return zeros;
  }

  /**
   * Get storage key for a tree node (matches contract's _nodeIndex)
   */
  private nodeKey(level: number, index: number): string {
    return `${level}-${index}`;
  }

  /**
   * Get a node from the tree, or return zero hash if not set
   */
  private getNode(level: number, index: number): Hex {
    const key = this.nodeKey(level, index);
    return this.tree.get(key) ?? this.zeroHashes[level];
  }

  /**
   * Set a node in the tree
   */
  private setNode(level: number, index: number, hash: Hex): void {
    this.tree.set(this.nodeKey(level, index), hash);
  }

  /**
   * Hash a pair of nodes (matches contract's _hashPair)
   */
  private hashPair(left: Hex, right: Hex): Hex {
    return keccak256(encodePacked(["bytes32", "bytes32"], [left, right]));
  }

  /**
   * Insert a new leaf (commitment) into the tree
   */
  insertLeaf(leaf: Hex): Hex {
    const index = this._nextLeafIndex;
    if (index >= 2 ** MERKLE_TREE_DEPTH) {
      throw new Error("Merkle tree full");
    }

    // Store the leaf at level 0
    this.setNode(0, index, leaf);

    let currentHash = leaf;
    let currentIndex = index;

    // Iterate through all levels
    for (let level = 0; level < MERKLE_TREE_DEPTH; level++) {
      if (currentIndex % 2 === 0) {
        // Left child - get right sibling
        const right = this.getNode(level, currentIndex + 1);
        currentHash = this.hashPair(currentHash, right);
      } else {
        // Right child - get left sibling
        const left = this.getNode(level, currentIndex - 1);
        currentHash = this.hashPair(left, currentHash);
      }

      // Move to parent level
      currentIndex = Math.floor(currentIndex / 2);
      this.setNode(level + 1, currentIndex, currentHash);
    }

    this._root = currentHash;
    this._nextLeafIndex = index + 1;

    return this._root;
  }

  /**
   * Generate a Merkle proof for a leaf at the given index
   */
  generateProof(leafIndex: number): {
    leaf: Hex;
    pathElements: Hex[];
    pathIndices: number[];
  } {
    if (leafIndex >= this._nextLeafIndex) {
      throw new Error("Leaf index out of bounds");
    }

    const pathElements: Hex[] = [];
    const pathIndices: number[] = [];
    let currentIndex = leafIndex;

    for (let level = 0; level < MERKLE_TREE_DEPTH; level++) {
      if (currentIndex % 2 === 0) {
        // Current is left, sibling is right
        pathElements.push(this.getNode(level, currentIndex + 1));
        pathIndices.push(0); // 0 means current is left
      } else {
        // Current is right, sibling is left
        pathElements.push(this.getNode(level, currentIndex - 1));
        pathIndices.push(1); // 1 means current is right
      }
      currentIndex = Math.floor(currentIndex / 2);
    }

    return {
      leaf: this.getNode(0, leafIndex),
      pathElements,
      pathIndices,
    };
  }

  /**
   * Verify a Merkle proof
   */
  verifyProof(
    leaf: Hex,
    pathElements: Hex[],
    pathIndices: number[],
    root: Hex
  ): boolean {
    let computedHash = leaf;

    for (let i = 0; i < pathElements.length; i++) {
      if (pathIndices[i] === 0) {
        // Current is left
        computedHash = this.hashPair(computedHash, pathElements[i]);
      } else {
        // Current is right
        computedHash = this.hashPair(pathElements[i], computedHash);
      }
    }

    return computedHash.toLowerCase() === root.toLowerCase();
  }

  /**
   * Get the current root
   */
  get root(): Hex {
    return this._root;
  }

  /**
   * Get the next leaf index
   */
  get nextLeafIndex(): number {
    return this._nextLeafIndex;
  }

  /**
   * Get all leaves in the tree
   */
  getLeaves(): Hex[] {
    const leaves: Hex[] = [];
    for (let i = 0; i < this._nextLeafIndex; i++) {
      leaves.push(this.getNode(0, i));
    }
    return leaves;
  }

  /**
   * Find the index of a leaf in the tree
   */
  findLeafIndex(leaf: Hex): number {
    for (let i = 0; i < this._nextLeafIndex; i++) {
      if (this.getNode(0, i).toLowerCase() === leaf.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Serialize the tree state for storage
   */
  serialize(): string {
    const entries: [string, Hex][] = Array.from(this.tree.entries());
    return JSON.stringify({
      tree: entries,
      nextLeafIndex: this._nextLeafIndex,
      root: this._root,
    });
  }

  /**
   * Deserialize and restore tree state
   */
  static deserialize(data: string): MerkleTree {
    const parsed = JSON.parse(data);
    const tree = new MerkleTree();
    tree.tree = new Map(parsed.tree);
    tree._nextLeafIndex = parsed.nextLeafIndex;
    tree._root = parsed.root;
    return tree;
  }

  /**
   * Sync with on-chain state by inserting missing leaves
   */
  syncWithLeaves(leaves: Hex[]): void {
    for (let i = this._nextLeafIndex; i < leaves.length; i++) {
      this.insertLeaf(leaves[i]);
    }
  }
}

/**
 * Create Merkle tree from array of commitments
 */
export function createMerkleTreeFromCommitments(commitments: Hex[]): MerkleTree {
  const tree = new MerkleTree();
  for (const commitment of commitments) {
    tree.insertLeaf(commitment);
  }
  return tree;
}

/**
 * Compute the expected nullifier for a note
 * nullifier = H(privateKey || leafIndex || commitment)
 */
export function computeNullifier(
  privateKey: Hex,
  leafIndex: number,
  commitment: Hex
): Hex {
  return keccak256(
    encodePacked(
      ["bytes32", "uint256", "bytes32"],
      [privateKey, BigInt(leafIndex), commitment]
    )
  );
}
