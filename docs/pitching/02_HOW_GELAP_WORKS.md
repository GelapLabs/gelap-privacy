# How Gelap Works

**Gelap** operates as a secure **Shielded Pool** on the blockchain, effectively separating your financial privacy from public visibility. When users interact with the protocol, their assets are converted into encrypted **commitments** stored within a **Merkle Tree** state, ensuring that ownership is tracked without revealing amounts or identities. Powered by **SP1 zkVM**, the system verifies every action—whether depositing, transferring, or withdrawing—through zero-knowledge proofs. This architecture guarantees that while the integrity of the ledger is publicly maintained, the specifics of every transaction remain strictly confidential, following the lifecycle detailed in the overview below.

---

## Protocol Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              GELAP PROTOCOL                                  │
│                    Privacy-Preserving Token Transactions                     │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────┐         ┌─────────────────┐         ┌─────────┐                │
│   │  USER   │         │  SHIELDED POOL  │         │  USER   │                │
│   │  ALICE  │         │   (On-Chain)    │         │   BOB   │                │
│   └────┬────┘         └────────┬────────┘         └────┬────┘                │
│        │                       │                       │                     │
│   ┌────▼────┐                  │                  ┌────▼────┐                │
│   │ DEPOSIT │ ──────────────►  │◄───────────────  │ DEPOSIT │                │
│   │ 100 ETH │    Commitment    │   Commitment     │ 50 ETH  │                │
│   └─────────┘    (Hidden)      │   (Hidden)       └─────────┘                │
│        │                       │                        │                    │
│        ▼                       ▼                        ▼                    │
│   ┌─────────────────────────────────────────────────────────────┐            │
│   │                     MERKLE TREE STATE                       │            │
│   │   [C1] [C2] [C3] [C4] [C5] ... [Cn]                         │            │
│   │     └───┴───┘ └───┴───┘                                     │            │
│   │         └───────┴───────┘ ──► ROOT                          │            │
│   └─────────────────────────────────────────────────────────────┘            │
│        │                                                     │               │
│        ▼                                                     ▼               │
│   ┌──────────┐    ZK PROOF    ┌──────────┐    ZK PROOF    ┌──────────┐       │
│   │ TRANSACT │ ─────────────► │ VERIFIED │ ◄───────────── │ WITHDRAW │       │
│   │ (Private)│   No Data      │ ON-CHAIN │   Amount+Recv  │ (Public) │       │
│   └──────────┘   Revealed     └──────────┘   Revealed     └──────────┘       │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  🔐 PRIVACY: Amount & parties hidden  │  ⚡ SECURITY: ZK-verified on-chain  │
│  🌐 UNIVERSAL: Any ERC-20 token       │  🔗 COMPOSABLE: Multi-chain ready   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Deep Dive: The Three Core Operations

### 1️⃣ DEPOSIT (Shield)

The deposit action is your entry point into privacy. When a user deposits ERC-20 tokens into the Gelap smart contract, the system generates a **cryptographic commitment**—a unique hash derived from the token address, amount, owner's public key, and a random blinding factor. This commitment is inserted into the on-chain **Merkle Tree**, creating a secure, tamper-proof record that funds exist without revealing _who_ owns them or the _quantity_.

```
Public Wallet ──► Gelap Pool
   100 USDC         Commitment = Hash(USDC, 100, owner, random)
                    ↓
                    Merkle Tree Updated
```

**Outcome:** The tokens are effectively "shielded." The blockchain records that a deposit occurred, but the link between the depositor and the funds is obfuscated securely within the Merkle structure.

---

### 2️⃣ TRANSACT (Private Transfer)

Transactions within the shielded pool are completely invisible to external observers. To transfer funds, a sender uses the **SP1 zkVM** to generate a zero-knowledge proof. This proof mathematically certifies that they own a valid, unspent commitment and are creating new commitments for the recipient (and change for themselves) without revealing the amounts or addresses involved. Upon verification, the contract "nullifies" the old commitment to prevent double-spending and updates the state with the new ones.

```
Alice's Note ──► SP1 Prover ──► New Notes
(100 USDC)         │              ├─► Bob (30 USDC)
                   │              └─► Alice Change (70 USDC)
                   ▼
              ZK Proof
                   │
              On-Chain Verification
                   │
              ✅ State Updated (No Data Leaked)
```

**Outcome:** A valid transfer occurs on-chain with zero data leakage. External observers cannot ascertain the sender, receiver, or value, preventing front-running (MEV) and transaction graph analysis.

---

### 3️⃣ WITHDRAW (Unshield)

When a user wishes to exit the shielded pool, they generate a ZK proof demonstrating ownership of a specific commitment value. This proof authorizes the smart contract to release the corresponding tokens to a specified public address. While the withdrawal amount and destination become visible on the public ledger at this stage, the **link to the original deposit or any prior internal history remains broken**, preserving the privacy of the funds' origin.

```
Gelap Pool ──► Public Wallet
Commitment        50 USDC to 0xABC...
    │
    ▼
ZK Proof (includes receiver address)
    │
    ▼
Verified → Tokens Transferred
```

**Outcome:** Assets return to the public blockchain for use in the broader DeFi ecosystem. The withdrawal address is public, but its connection to past activities within Gelap remains mathematically severed.

---

## Privacy Guarantees Matrix

| What                   | Status     | Detailed Notes                                                               |
| ---------------------- | ---------- | ---------------------------------------------------------------------------- |
| Transaction Amount     | ✅ Hidden  | Only revealed on withdrawal. Internal transfers are completely hidden.       |
| Sender Address         | ✅ Hidden  | Always hidden. Even on withdrawal, the original depositor cannot be traced.  |
| Receiver Address       | ✅ Hidden  | Hidden for internal transfers. Only visible on withdrawal to public address. |
| Transaction History    | ✅ Hidden  | Impossible to link transactions or build a transaction graph.                |
| Token Type             | ✅ Hidden  | Inside the pool, observers cannot determine which tokens are moving.         |
| Total Pool Value       | ❌ Public  | Sum of all deposits minus withdrawals is visible for transparency.           |
| Number of Transactions | ⚠️ Partial | Transaction count is visible, but details are hidden.                        |

---

## Key Innovation: SP1 zkVM - Making Privacy Accessible

### The Traditional ZK Problem

Building Zero-Knowledge systems has historically required:

- **Specialized circuit languages** (Circom, Noir) with steep learning curves
- **Months of development time** for even simple logic
- **Limited expressiveness** — complex business logic was nearly impossible
- **Difficult auditing** — circuit code is hard to review for security

### The Gelap/SP1 Solution

**SP1 is a zkVM (Zero-Knowledge Virtual Machine)** that allows developers to write ZK proofs in **standard Rust** — the same language used for high-performance systems programming.

```
┌────────────────────────────────────────┐
│  Traditional ZK     vs     Gelap/SP1  │
├────────────────────────────────────────┤
│  Write circuits              Write Rust│
│  Hard to audit               Easy audit│
│  Limited logic               Any logic │
│  Months to build             Days      │
└────────────────────────────────────────┘
```

**Why This Matters:**

1. **Faster Development:** We built Gelap in weeks, not months
2. **Better Security:** Rust code is easier to audit than circuit code
3. **More Features:** We can implement complex privacy logic (swaps, vaults, RWA) that would be impractical with traditional ZK
4. **Future-Proof:** Adding new features just requires writing more Rust

**Technical Note:** SP1 compiles Rust code to a ZK-friendly instruction set, then generates STARK proofs that can be efficiently verified on-chain. The verifier contract on Mantle is gas-efficient (~500k gas per verification).

---

## 🚀 Deployed on Mantle Network

We chose **Mantle** as our primary deployment target for strategic reasons:

```
┌────────────────────────────────────────┐
│          DEPLOYED ON MANTLE            │
├────────────────────────────────────────┤
│  ✅ Low gas fees (~$0.01 per tx)       │
│  ✅ EVM compatible                     │
│  ✅ Fast finality                      │
│  ✅ SP1 Verifier ready                 │
└────────────────────────────────────────┘
```

**Why Mantle?**

| Advantage              | Explanation                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Low Fees**           | ZK verification is computationally expensive. Mantle's low fees make privacy affordable for everyone, not just whales. |
| **EVM Compatibility**  | Our contracts work with existing wallets, tools, and infrastructure. No special software needed.                       |
| **Fast Finality**      | Quick transaction confirmation improves user experience. No waiting minutes for privacy.                               |
| **L2 Scalability**     | As an L2, Mantle can handle high throughput while inheriting Ethereum's security.                                      |
| **Developer-Friendly** | Mantle's ecosystem and support made deployment smooth and efficient.                                                   |

---

## Security Model

### What Makes Gelap Secure?

1. **Cryptographic Soundness:** Our commitments use Poseidon hash (ZK-optimized) — computationally infeasible to forge or reverse.

2. **Merkle Tree Integrity:** All commitments are organized in a Merkle Tree, ensuring tamper-proof state management.

3. **Nullifier System:** Every commitment has a unique nullifier that's revealed when spent, preventing double-spending.

4. **On-Chain Verification:** All ZK proofs are verified by the smart contract — no trusted parties needed.

5. **Open Source:** Our code is fully auditable — security through transparency, not obscurity.

### What We DON'T Protect Against

- **Endpoint Security:** If your wallet is compromised, your shielded keys are compromised
- **Timing Analysis:** If you deposit and immediately withdraw the same amount, correlation is possible
- **Social Engineering:** Privacy tech can't protect against users revealing their own information

---

## Summary: Why Gelap?

| Traditional DeFi                      | Gelap                               |
| ------------------------------------- | ----------------------------------- |
| All transactions public               | Transactions private by default     |
| Vulnerable to MEV                     | No MEV possible (hidden details)    |
| Wallet tracking possible              | No address linking                  |
| Business intelligence leaked          | Competitive privacy maintained      |
| Privacy requires technical complexity | Simple deposit/transfer/withdraw UX |

**Gelap brings bank-grade privacy to public blockchains** — enabling individuals and institutions to transact without surveillance while maintaining full compliance capabilities (see [Compliance Ready](./06_COMPLIANCE_READY.md)).
