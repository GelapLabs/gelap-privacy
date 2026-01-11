1. **Shielded Entry (Submit)**
   Users deposit assets into "Shielded Balances," decoupling their identity from their funds. This ensures your wallet history and transaction context remain completely unlinkable from the start.

2. **Private Execution (Compute)**
   Transaction logic is executed off-chain using **Client-Side ZK Proving**. This ensures that trade intentions, amounts, and recipients are never exposed to the public mempool, effectively neutralizing MEV bots and preserving total privacy before the transaction is even sent.

3. **Verifiable Settlement (Finalize)**
   We utilize **SP1 zkVM** to mathematically prove the validity of the state transition. The protocol settles these proofs on-chain, confirming that the transaction was honest and followed all rules without ever revealing the underlying sensitive data to the public ledger.

Products

- Private Swap
  - A privacy-first AMM that conceals trade amounts and identities, protecting users from MEV bots and front-running attacks.
- Shielded Vault
  - Private yield-bearing pools where users can deposit assets to earn returns without revealing their total holdings or strategies.
- Confidential RWA
  - A secure framework for tokenizing real-world assets that keeps ownership details and asset values hidden from public view.
- Compliance Ready
  - An opt-in regulatory layer enabling institutions to cryptographically prove compliance to auditors without exposing their full transaction history.

## How Gelap Works

Gelap is built on a set of core privacy modules that work together to deliver confidential DeFi operations on EVM chains.

- Main Interface: Gelap is accessible through its privacy-first dashboard on Mantle, where users can shield assets, execute private swaps, and manage compliance proofs in one unified view.
- Shielded Pool Module: Users deposit ERC-20 tokens into a shared anonymity set (Merkle Tree), effectively decoupling their public identity from their funds and enabling truly private ownership.

- Private Transaction Module: Users can transfer assets and execute swaps internally without generating any on-chain transaction history, ensuring that amounts, senders, and receivers remain completely invisible.

- Client-Side Proving Module: Gelap utilizes SP1 technology to generate zero-knowledge proofs directly on the user's device, ensuring that sensitive data never leaves the local environment while still proving validity to the network.

- Compliance Module: This opt-in layer allows institutions to selectively disclose specific transaction details or proofs of innocence to regulators and auditors, bridging the gap between total privacy and regulatory requirements.

- Verifier & Settlement: The on-chain contract verifies the ZK proofs submitted by users and settles the state changes (nullifying spent notes and creating new ones) without ever learning the private inputs.
