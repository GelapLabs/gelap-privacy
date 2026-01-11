# Private Swap - Confidential Token Exchange

> **"As a trader, I can swap 1000 ETH → USDC without any bot seeing my order or front-running my price."**

## Overview

**Private Swap** is Gelap's private AMM that ensures your trading intent remains invisible until execution.

### What It Solves

- **MEV Bots:** On public DEXs, bots see your order in the mempool and "sandwich" it, giving you a worse price.
- **Copy Trading:** Competitors track profitable wallets to copy their moves.
- **Market Impact:** Large orders panic the market before they even settle.

### How Private Swap Protects You

- ✅ **Hidden Amounts:** Swaps occur inside a Zero-Knowledge proof; observers see a transaction but not the volume.
- ✅ **Hidden Identity:** Your wallet address is never linked to the swap.
- ✅ **Zero Front-Running:** Since the trade details are hidden, bots cannot profitably target you.

---

## How It Works

### Step-by-Step Flow

1. **User has shielded tokens** (already deposited into Gelap)
2. **Select token pair** (e.g., USDC → ETH)
3. **Enter swap amount** (only visible to user's wallet)
4. **ZK proof generated locally** — proves the swap is valid without revealing details
5. **Proof submitted on-chain** — contract verifies proof, executes swap
6. **User receives new shielded tokens** — output tokens remain private

---

## Activity Diagram

```mermaid
flowchart TD
    Start([User Initiates Private Swap]) --> A[Select Token Pair]
    A --> B[Enter Swap Amount]
    B --> C{Sufficient Shielded Balance?}

    C -->|No| D[Deposit More Tokens]
    D --> E[Generate Commitment]
    E --> F[Submit Deposit TX]
    F --> C

    C -->|Yes| G[Fetch Current Pool Rates]
    G --> H[Calculate Output Amount]
    H --> I[User Confirms Swap]

    I --> J[Select Input Notes]
    J --> K[Build Merkle Proofs]
    K --> L[Prepare Swap Witness]

    L --> M[SP1 Prover: Generate ZK Proof]

    subgraph ZK_PROOF [ZK Proof Generation]
        M --> M1[Verify Note Ownership]
        M1 --> M2[Compute Nullifiers]
        M2 --> M3[Verify Swap Logic]
        M3 --> M4[Create Output Commitments]
        M4 --> M5[Compute New Merkle Root]
    end

    M5 --> N[Return Proof + Public Inputs]

    N --> O[Submit to Gelap Swap Contract]

    subgraph ON_CHAIN [On-Chain Verification]
        O --> P[Verify ZK Proof]
        P --> Q{Proof Valid?}
        Q -->|No| R[Revert Transaction]
        Q -->|Yes| S[Check Nullifiers Not Used]
        S --> T{Nullifiers Fresh?}
        T -->|No| R
        T -->|Yes| U[Execute Atomic Swap]
        U --> V[Mark Nullifiers Used]
        V --> W[Update Merkle Root]
        W --> X[Emit Swap Event]
    end

    X --> Y[User Receives New Shielded Notes]
    Y --> Z([Swap Complete - No Data Leaked])

    R --> End([Transaction Failed])
```

---

## Sequence Flow

```mermaid
sequenceDiagram
    participant User
    participant Wallet
    participant AMM as Private AMM
    participant Prover as SP1 Prover
    participant Contract as Gelap Swap

    User->>Wallet: Initiate swap (100 USDC → ETH)
    Wallet->>AMM: Get current rate
    AMM-->>Wallet: 1 ETH = 2000 USDC (0.05 ETH output)

    User->>Wallet: Confirm swap
    Wallet->>Wallet: Select USDC notes
    Wallet->>Wallet: Build Merkle proofs

    Wallet->>Prover: Generate swap proof
    Note over Prover: Inputs: 100 USDC note<br/>Outputs: 0.05 ETH note + change
    Prover->>Prover: Verify ownership
    Prover->>Prover: Validate swap math
    Prover->>Prover: Create nullifiers
    Prover->>Prover: Create new commitments
    Prover-->>Wallet: ZK Proof ready

    Wallet->>Contract: submitSwap(proof, publicInputs)
    Contract->>Contract: verifyProof()
    Contract->>Contract: checkNullifiers()
    Contract->>Contract: executeSwap()
    Contract->>Contract: updateMerkleRoot()
    Contract-->>Wallet: SwapExecuted event

    Wallet->>Wallet: Store new ETH note
    Wallet-->>User: ✅ Swapped 100 USDC → 0.05 ETH (Private)
```

---

## What the ZK Proof Proves

The ZK proof cryptographically guarantees:

```
PROVE:
  1. I own input notes worth X of Token A
  2. Output amount Y of Token B is correct per AMM formula
  3. Nullifiers are correctly derived
  4. New commitments are valid
  5. No tokens created or destroyed
```

---

## What's Private vs Public

| Data Point           | Status                    |
| -------------------- | ------------------------- |
| Swap amount          | 🔒 Private                |
| Token types          | 🔒 Private                |
| User address         | 🔒 Private                |
| Swap rate used       | 🔒 Private                |
| Swap occurred        | 🌐 Public (event emitted) |
| Pool total liquidity | 🌐 Public                 |

---

## Private AMM Pool

```
┌─────────────────────────────────────┐
│        SHIELDED LIQUIDITY POOL      │
├─────────────────────────────────────┤
│  Token A Pool ◄──────► Token B Pool │
│       │                    │        │
│  [Hidden Balances via Commitments]  │
│                                     │
│  Swap = ZK Proof of valid trade     │
└─────────────────────────────────────┘
```

---

## Key Benefits

| 🔐 TRADE PRIVATELY | No one sees your positions |
|🛡️ MEV PROTECTED | Zero front-running possible |
| 📊 NO TRACKING | Break address correlation |
| ⚡ INSTANT FINALITY | Mantle L2 speed |
| 💰 LOW FEES | ~$0.01-0.05 per swap │

```
┌─────────────────────────────────────────────────────────────┐
│  🔐 TRADE PRIVATELY      No one sees your positions        │
│  🛡️ MEV PROTECTED        Zero front-running possible       │
│  📊 NO TRACKING          Break address correlation         │
│  ⚡ INSTANT FINALITY     Mantle L2 speed                   │
│  💰 LOW FEES             ~$0.01-0.05 per swap              │
└─────────────────────────────────────────────────────────────┘
```
