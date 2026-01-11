# Gelap Tech Stack

## Core Infrastructure

| Layer              | Technology          | Purpose                             |
| ------------------ | ------------------- | ----------------------------------- |
| **Smart Contract** | Solidity 0.8.30     | On-chain state & verification       |
| **ZK Proving**     | SP1 zkVM (Succinct) | Privacy-preserving proof generation |
| **Framework**      | Foundry             | Development, testing, deployment    |
| **Token Standard** | ERC-20              | Multi-token support                 |

---

## Zero-Knowledge Stack

| Component         | Technology     | Description                   |
| ----------------- | -------------- | ----------------------------- |
| **Prover**        | SP1 zkVM       | Rust-based ZK virtual machine |
| **Verifier**      | ISP1Verifier   | On-chain proof verification   |
| **Hash Function** | Keccak256      | Ethereum-native hashing       |
| **Commitment**    | Pedersen-style | Hide amount & ownership       |
| **Nullifier**     | Hash-based     | Prevent double-spending       |

---

## User Interface & Integration

| Component              | Technology  | Role                                             |
| ---------------------- | ----------- | ------------------------------------------------ |
| **Core Framework**     | Next.js     | Modern, high-performance React application       |
| **Component Library**  | shadcn/ui   | Beautifully designed, accessible UI components   |
| **Wallet Suite**       | Rainbow Kit | Seamless and polished wallet onboarding          |
| **Network Layer**      | Mantle SDK  | Native integration with Mantle ecosystem         |
| **Data Hooks**         | Wagmi       | React hooks for interacting with smart contracts |
| **Interaction Engine** | GSAP        | Professional-grade animations and motion design  |

---

## Cryptographic Primitives

```
┌─────────────────────────────────────────────────────────┐
│                    PRIVACY LAYER                        │
├─────────────────────────────────────────────────────────┤
│  Commitment     = Hash(token, amount, owner, blinding)  │
│  Nullifier      = Hash(commitment, secret_key)          │
│  Merkle Tree    = 32-level incremental tree             │
└─────────────────────────────────────────────────────────┘
```

---

## Data Structure

| Structure       | Depth/Size | Capacity           |
| --------------- | ---------- | ------------------ |
| **Merkle Tree** | 32 levels  | ~4.3 billion notes |
| **Commitment**  | 32 bytes   | Unique per note    |
| **Nullifier**   | 32 bytes   | One-time use       |
| **Proof**       | Variable   | SP1 compressed     |

---

## Supported Networks

| Network          | Type    | Status      |
| ---------------- | ------- | ----------- |
| **Mantle**       | L2      | 🟢 **LIVE** |
| Ethereum Mainnet | L1      | 🟡 Planned  |
| Base             | L2      | 🟡 Planned  |
| Arbitrum         | L2      | 🟡 Planned  |
| Optimism         | L2      | 🟡 Planned  |
| Sepolia          | Testnet | 🟢 Ready    |

---

## Dependencies

```
├── openzeppelin-contracts   # ERC20 interface
├── sp1-contracts            # ZK verifier
└── forge-std                # Testing framework
```

---

## Why This Stack?

| Choice          | Reason                                         |
| --------------- | ---------------------------------------------- |
| **SP1 zkVM**    | Write ZK logic in Rust, not circuits           |
| **Foundry**     | Fast compilation, native fuzzing               |
| **Next.js**     | Best-in-class React framework for performance  |
| **shadcn/ui**   | Copy-paste accessible components, full control |
| **Rainbow Kit** | Polished, reliable wallet connection UX        |
| **Keccak256**   | Gas efficient, Ethereum native                 |
| **ERC-20**      | Universal token compatibility                  |
