"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { type Address, type Hex } from "viem";

import {
  PrivacyWallet,
  createPrivacyWallet,
  type Note,
} from "@/src/wallet-sdk";

// ============================================================================
// Hook State Types
// ============================================================================

export interface UsePrivacyWalletReturn {
  // Wallet instance
  wallet: PrivacyWallet | null;

  // Initialization state
  isInitializing: boolean;
  isInitialized: boolean;
  initError: string | null;

  // Keys
  hasKeys: boolean;
  publicKeys: { viewPublicKey: Hex; spendPublicKey: Hex } | null;
  walletAddress: Address | null;

  // Balance
  shieldedBalance: bigint;
  balanceByToken: Map<Address, bigint>;
  isLoadingBalance: boolean;

  // Notes
  notes: Note[];
  unspentNotes: Note[];

  // Actions
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
  clearWallet: () => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function usePrivacyWallet(): UsePrivacyWalletReturn {
  // Wagmi hooks
  const { address, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Local state
  const [wallet] = useState<PrivacyWallet>(() => createPrivacyWallet());
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Derived state (trigger re-render on changes)
  const [shieldedBalance, setShieldedBalance] = useState<bigint>(0n);
  const [balanceByToken, setBalanceByToken] = useState<Map<Address, bigint>>(
    new Map()
  );
  const [notes, setNotes] = useState<Note[]>([]);

  /**
   * Initialize the privacy wallet
   */
  const initialize = useCallback(async () => {
    if (!walletClient || !publicClient || !isConnected) {
      setInitError("Wallet not connected");
      return;
    }

    if (isInitializing || isInitialized) {
      return;
    }

    setIsInitializing(true);
    setInitError(null);

    try {
      await wallet.initialize(walletClient, publicClient, chainId);
      setIsInitialized(true);

      // Update derived state
      setShieldedBalance(wallet.getShieldedBalance());
      setBalanceByToken(wallet.getBalanceByToken());
      setNotes(wallet.getUnspentNotes());
    } catch (error) {
      console.error("Failed to initialize privacy wallet:", error);
      setInitError(
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setIsInitializing(false);
    }
  }, [
    walletClient,
    publicClient,
    isConnected,
    chainId,
    wallet,
    isInitializing,
    isInitialized,
  ]);

  /**
   * Refresh wallet state (sync with chain)
   */
  const refresh = useCallback(async () => {
    if (!isInitialized) return;

    setIsLoadingBalance(true);

    try {
      await wallet.syncWithChain();

      // Update derived state
      setShieldedBalance(wallet.getShieldedBalance());
      setBalanceByToken(wallet.getBalanceByToken());
      setNotes(wallet.getUnspentNotes());
    } catch (error) {
      console.error("Failed to refresh wallet state:", error);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [wallet, isInitialized]);

  /**
   * Clear wallet data
   */
  const clearWallet = useCallback(() => {
    wallet.clearStorage();
    setIsInitialized(false);
    setShieldedBalance(0n);
    setBalanceByToken(new Map());
    setNotes([]);
  }, [wallet]);

  /**
   * Auto-initialize when wallet connects
   */
  useEffect(() => {
    if (isConnected && walletClient && publicClient && !isInitialized) {
      initialize();
    }
  }, [isConnected, walletClient, publicClient, isInitialized, initialize]);

  /**
   * Reset state when wallet disconnects
   */
  useEffect(() => {
    if (!isConnected) {
      setIsInitialized(false);
      setShieldedBalance(0n);
      setBalanceByToken(new Map());
      setNotes([]);
    }
  }, [isConnected]);

  // Computed values
  const hasKeys = useMemo(() => wallet?.getKeys() !== null, [wallet]);
  const publicKeys = useMemo(
    () => (isInitialized ? wallet?.getPublicKeys() ?? null : null),
    [wallet, isInitialized]
  );
  const walletAddress = useMemo(
    () => (isInitialized ? wallet?.getAddress() ?? null : null),
    [wallet, isInitialized]
  );
  const unspentNotes = useMemo(
    () => notes.filter((n) => !n.spent),
    [notes]
  );

  return {
    wallet,
    isInitializing,
    isInitialized,
    initError,
    hasKeys,
    publicKeys,
    walletAddress,
    shieldedBalance,
    balanceByToken,
    isLoadingBalance,
    notes,
    unspentNotes,
    initialize,
    refresh,
    clearWallet,
  };
}
