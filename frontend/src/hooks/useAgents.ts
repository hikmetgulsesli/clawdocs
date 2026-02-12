/**
 * React hook for fetching agent data
 */

import { useState, useEffect, useCallback } from 'react';
import type { Agent } from '@clawdocs/shared';
import { getAgents, getAgent, APIError } from '../api/client.js';

interface UseAgentsResult {
  /** Array of all agents */
  data: Agent[] | null;
  /** Loading state */
  loading: boolean;
  /** Error object if request failed */
  error: Error | null;
  /** Refetch function to reload data */
  refetch: () => void;
}

interface UseAgentResult {
  /** Single agent data */
  data: Agent | null;
  /** Loading state */
  loading: boolean;
  /** Error object if request failed */
  error: Error | null;
  /** Refetch function to reload data */
  refetch: () => void;
}

/**
 * Hook for fetching all agents
 * Returns { data, loading, error, refetch }
 */
export function useAgents(): UseAgentsResult {
  const [data, setData] = useState<Agent[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const agents = await getAgents();
        if (!cancelled) {
          setData(agents);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof APIError) {
            setError(err);
          } else if (err instanceof Error) {
            setError(err);
          } else {
            setError(new Error(String(err)));
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { data, loading, error, refetch };
}

/**
 * Hook for fetching a single agent by ID
 * @param id - The agent ID to fetch
 */
export function useAgent(id: string | null): UseAgentResult {
  const [data, setData] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const agent = await getAgent(id!);
        if (!cancelled) {
          setData(agent);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof APIError) {
            setError(err);
          } else if (err instanceof Error) {
            setError(err);
          } else {
            setError(new Error(String(err)));
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [id, refreshKey]);

  return { data, loading, error, refetch };
}
