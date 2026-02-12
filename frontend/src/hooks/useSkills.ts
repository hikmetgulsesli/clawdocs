/**
 * React hook for fetching skill data
 */

import { useState, useEffect, useCallback } from 'react';
import type { Skill } from '@clawdocs/shared';
import { getSkills, getSkill, APIError } from '../api/client.js';

interface UseSkillsResult {
  /** Array of all skills */
  data: Skill[] | null;
  /** Loading state */
  loading: boolean;
  /** Error object if request failed */
  error: Error | null;
  /** Refetch function to reload data */
  refetch: () => void;
}

interface UseSkillResult {
  /** Single skill data */
  data: Skill | null;
  /** Loading state */
  loading: boolean;
  /** Error object if request failed */
  error: Error | null;
  /** Refetch function to reload data */
  refetch: () => void;
}

/**
 * Hook for fetching all skills
 * Returns { data, loading, error, refetch }
 */
export function useSkills(): UseSkillsResult {
  const [data, setData] = useState<Skill[] | null>(null);
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
        const skills = await getSkills();
        if (!cancelled) {
          setData(skills);
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
 * Hook for fetching a single skill by name
 * @param name - The skill name to fetch
 */
export function useSkill(name: string | null): UseSkillResult {
  const [data, setData] = useState<Skill | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!name) {
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
        const skill = await getSkill(name!);
        if (!cancelled) {
          setData(skill);
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
  }, [name, refreshKey]);

  return { data, loading, error, refetch };
}
