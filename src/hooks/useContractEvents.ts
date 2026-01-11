"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePublicClient, useAccount } from "wagmi";
import { type Address, type Hex } from "viem";

import {
  ContractService,
  createContractService,
  type AccountUpdatedEvent,
  type TransactionExecutedEvent,
  type WithdrawExecutedEvent,
} from "@/src/wallet-sdk";

// ============================================================================
// Types
// ============================================================================

export interface UseContractEventsReturn {
  // Event data
  accountUpdatedEvents: AccountUpdatedEvent[];
  transactionExecutedEvents: TransactionExecutedEvent[];
  withdrawExecutedEvents: WithdrawExecutedEvent[];

  // Loading state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchEvents: (fromBlock?: bigint) => Promise<void>;
  clearEvents: () => void;

  // Latest events
  latestCommitments: Hex[];
  latestNullifiers: Hex[];
}

export interface UseContractEventsOptions {
  /** Block number to start fetching from (default: 0) */
  fromBlock?: bigint;
  /** Whether to auto-fetch on mount (default: true) */
  autoFetch?: boolean;
  /** Polling interval in ms (default: no polling) */
  pollingInterval?: number;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useContractEvents(
  options: UseContractEventsOptions = {}
): UseContractEventsReturn {
  const { fromBlock = 0n, autoFetch = true, pollingInterval } = options;

  // Wagmi hooks
  const publicClient = usePublicClient();
  const { chainId } = useAccount();

  // State
  const [accountUpdatedEvents, setAccountUpdatedEvents] = useState<
    AccountUpdatedEvent[]
  >([]);
  const [transactionExecutedEvents, setTransactionExecutedEvents] = useState<
    TransactionExecutedEvent[]
  >([]);
  const [withdrawExecutedEvents, setWithdrawExecutedEvents] = useState<
    WithdrawExecutedEvent[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track last fetched block
  const lastFetchedBlockRef = useRef<bigint>(fromBlock);

  // Contract service
  const contractServiceRef = useRef<ContractService | null>(null);

  /**
   * Initialize or get contract service
   */
  const getContractService = useCallback(() => {
    if (!publicClient) return null;

    if (!contractServiceRef.current) {
      contractServiceRef.current = createContractService(
        publicClient,
        undefined,
        chainId
      );
    }

    return contractServiceRef.current;
  }, [publicClient, chainId]);

  /**
   * Fetch all events from a given block
   */
  const fetchEvents = useCallback(
    async (startBlock?: bigint) => {
      const service = getContractService();
      if (!service) {
        setError("Public client not available");
        return;
      }

      const fetchFromBlock = startBlock ?? lastFetchedBlockRef.current;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch all event types in parallel
        const [accountEvents, txEvents, withdrawEvents] = await Promise.all([
          service.getAccountUpdatedEvents(fetchFromBlock),
          service.getTransactionExecutedEvents(fetchFromBlock),
          service.getWithdrawExecutedEvents(undefined, fetchFromBlock),
        ]);

        // Append new events (avoid duplicates)
        setAccountUpdatedEvents((prev) => {
          const existingHashes = new Set(prev.map((e) => e.transactionHash));
          const newEvents = accountEvents.filter(
            (e) => !existingHashes.has(e.transactionHash)
          );
          return [...prev, ...newEvents];
        });

        setTransactionExecutedEvents((prev) => {
          const existingHashes = new Set(prev.map((e) => e.transactionHash));
          const newEvents = txEvents.filter(
            (e) => !existingHashes.has(e.transactionHash)
          );
          return [...prev, ...newEvents];
        });

        setWithdrawExecutedEvents((prev) => {
          const existingHashes = new Set(prev.map((e) => e.transactionHash));
          const newEvents = withdrawEvents.filter(
            (e) => !existingHashes.has(e.transactionHash)
          );
          return [...prev, ...newEvents];
        });

        // Update last fetched block
        const allEvents = [...accountEvents, ...txEvents, ...withdrawEvents];
        if (allEvents.length > 0) {
          const maxBlock = allEvents.reduce(
            (max, e) => (e.blockNumber > max ? e.blockNumber : max),
            0n
          );
          lastFetchedBlockRef.current = maxBlock + 1n;
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    },
    [getContractService]
  );

  /**
   * Clear all events
   */
  const clearEvents = useCallback(() => {
    setAccountUpdatedEvents([]);
    setTransactionExecutedEvents([]);
    setWithdrawExecutedEvents([]);
    lastFetchedBlockRef.current = fromBlock;
  }, [fromBlock]);

  /**
   * Auto-fetch on mount if enabled
   */
  useEffect(() => {
    if (autoFetch && publicClient) {
      fetchEvents(fromBlock);
    }
  }, [autoFetch, publicClient, fromBlock]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Setup polling if interval is configured
   */
  useEffect(() => {
    if (!pollingInterval || !publicClient) return;

    const interval = setInterval(() => {
      fetchEvents();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval, publicClient, fetchEvents]);

  /**
   * Reset contract service when chain changes
   */
  useEffect(() => {
    contractServiceRef.current = null;
  }, [chainId]);

  // Computed values
  const latestCommitments = accountUpdatedEvents.map((e) => e.commitment);
  const latestNullifiers = transactionExecutedEvents.flatMap(
    (e) => e.nullifiers
  );

  return {
    accountUpdatedEvents,
    transactionExecutedEvents,
    withdrawExecutedEvents,
    isLoading,
    error,
    fetchEvents,
    clearEvents,
    latestCommitments,
    latestNullifiers,
  };
}

// ============================================================================
// Helper Hook: Watch for specific nullifier usage
// ============================================================================

export function useNullifierStatus(nullifier: Hex | null): {
  isUsed: boolean;
  isLoading: boolean;
} {
  const publicClient = usePublicClient();
  const { chainId } = useAccount();
  const [isUsed, setIsUsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!nullifier || !publicClient) {
      setIsUsed(false);
      return;
    }

    const checkNullifier = async () => {
      setIsLoading(true);
      try {
        const service = createContractService(publicClient, undefined, chainId);
        const used = await service.isNullifierUsed(nullifier);
        setIsUsed(used);
      } catch (error) {
        console.error("Failed to check nullifier status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkNullifier();
  }, [nullifier, publicClient, chainId]);

  return { isUsed, isLoading };
}

// ============================================================================
// Helper Hook: Watch for new deposits to a commitment
// ============================================================================

export function useWatchDeposit(
  commitment: Hex | null,
  onDeposit?: (event: AccountUpdatedEvent) => void
): {
  isConfirmed: boolean;
  event: AccountUpdatedEvent | null;
} {
  const { accountUpdatedEvents, fetchEvents } = useContractEvents({
    autoFetch: false,
    pollingInterval: 5000, // Poll every 5 seconds
  });

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [event, setEvent] = useState<AccountUpdatedEvent | null>(null);

  useEffect(() => {
    if (!commitment) return;

    const matchingEvent = accountUpdatedEvents.find(
      (e) => e.commitment.toLowerCase() === commitment.toLowerCase()
    );

    if (matchingEvent) {
      setIsConfirmed(true);
      setEvent(matchingEvent);
      onDeposit?.(matchingEvent);
    }
  }, [commitment, accountUpdatedEvents, onDeposit]);

  // Start watching when commitment is set
  useEffect(() => {
    if (commitment) {
      fetchEvents(0n);
    }
  }, [commitment, fetchEvents]);

  return { isConfirmed, event };
}
