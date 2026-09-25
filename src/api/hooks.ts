import { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { api, getDashboard } from './client';

export function useApiLive(): boolean {
  return useApp().sessionMode === 'api';
}

export interface LoadState<T> {
  loading: boolean;
  data: T | null;
}

/** Fetch a dashboard block from the backend when in API mode; otherwise stay on mock data. */
export function useDashboard<T>(kind: string): LoadState<T> {
  const live = useApiLive();
  const [state, setState] = useState<LoadState<T>>({ loading: true, data: null });

  useEffect(() => {
    let alive = true;
    if (!live) {
      setState({ loading: false, data: null });
      return () => { alive = false; };
    }
    setState({ loading: true, data: null });
    getDashboard<T>(kind)
      .then((data) => { if (alive) setState({ loading: false, data }); })
      .catch(() => { if (alive) setState({ loading: false, data: null }); });
    return () => { alive = false; };
  }, [kind, live]);

  return state;
}

/** Fetch a list resource (returns the raw array for DRF paginated/envelope responses). */
export function useList<T>(path: string): LoadState<T[]> {
  const live = useApiLive();
  const [state, setState] = useState<LoadState<T[]>>({ loading: true, data: null });

  useEffect(() => {
    let alive = true;
    if (!live) {
      setState({ loading: false, data: null });
      return () => { alive = false; };
    }
    setState({ loading: true, data: null });
    api.get<T[]>(path)
      .then((data) => { if (alive) setState({ loading: false, data }); })
      .catch(() => { if (alive) setState({ loading: false, data: null }); });
    return () => { alive = false; };
  }, [path, live]);

  return state;
}