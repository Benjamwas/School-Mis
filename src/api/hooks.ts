import { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { api, ApiError, getDashboard } from './client';

export function useApiLive(): boolean {
  return useApp().sessionMode === 'api';
}

export interface LoadState<T> {
  loading: boolean;
  data: T | null;
  /** Set when a live API call failed, so pages can show the failure instead of
   *  silently rendering prototype data as if it came from the backend. */
  error: string | null;
}

function describe(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return 'Your session has expired. Please sign in again.';
    if (err.status === 403) return 'You do not have permission to view this data.';
    if (err.status === 0) return 'Cannot reach the SALA API. Is the backend running?';
    return err.message || `Request failed (${err.status}).`;
  }
  return err instanceof Error ? err.message : 'Request failed.';
}

/** Fetch a dashboard block from the backend when in API mode; otherwise stay on mock data. */
export function useDashboard<T>(kind: string): LoadState<T> {
  const live = useApiLive();
  const [state, setState] = useState<LoadState<T>>({ loading: true, data: null, error: null });

  useEffect(() => {
    let alive = true;
    if (!live) {
      setState({ loading: false, data: null, error: null });
      return () => { alive = false; };
    }
    setState({ loading: true, data: null, error: null });
    getDashboard<T>(kind)
      .then((data) => { if (alive) setState({ loading: false, data, error: null }); })
      .catch((err) => { if (alive) setState({ loading: false, data: null, error: describe(err) }); });
    return () => { alive = false; };
  }, [kind, live]);

  return state;
}

/** Fetch an object-returning endpoint (reports list, summary objects, counts). */
export function useObject<T>(path: string): LoadState<T> {
  const live = useApiLive();
  const [state, setState] = useState<LoadState<T>>({ loading: true, data: null, error: null });

  useEffect(() => {
    let alive = true;
    if (!live) {
      setState({ loading: false, data: null, error: null });
      return () => { alive = false; };
    }
    setState({ loading: true, data: null, error: null });
    api.get<T>(path)
      .then((data) => { if (alive) setState({ loading: false, data, error: null }); })
      .catch((err) => { if (alive) setState({ loading: false, data: null, error: describe(err) }); });
    return () => { alive = false; };
  }, [path, live]);

  return state;
}

/** Fetch a list resource (returns the raw array for DRF paginated/envelope responses). */
export function useList<T>(path: string): LoadState<T[]> {
  const live = useApiLive();
  const [state, setState] = useState<LoadState<T[]>>({ loading: true, data: null, error: null });

  useEffect(() => {
    let alive = true;
    if (!live) {
      setState({ loading: false, data: null, error: null });
      return () => { alive = false; };
    }
    setState({ loading: true, data: null, error: null });
    api.get<T[]>(path)
      .then((data) => { if (alive) setState({ loading: false, data, error: null }); })
      .catch((err) => { if (alive) setState({ loading: false, data: null, error: describe(err) }); });
    return () => { alive = false; };
  }, [path, live]);

  return state;
}

/** Fetch a single resource by id from the backend when in API mode. */
export function useDetail<T>(path: string, id: string | undefined): LoadState<T> {
  const live = useApiLive();
  const [state, setState] = useState<LoadState<T>>({ loading: true, data: null, error: null });

  const url = id ? `${path}${id}/` : null;

  useEffect(() => {
    let alive = true;
    if (!live || !url) {
      setState({ loading: false, data: null, error: null });
      return () => { alive = false; };
    }
    setState({ loading: true, data: null, error: null });
    api.get<T>(url)
      .then((data) => { if (alive) setState({ loading: false, data, error: null }); })
      .catch((err) => { if (alive) setState({ loading: false, data: null, error: describe(err) }); });
    return () => { alive = false; };
  }, [url, live]);

  return state;
}