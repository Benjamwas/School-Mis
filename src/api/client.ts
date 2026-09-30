import type { ApiSchool, ApiUser } from './types';

const env = (import.meta as unknown as { env?: Record<string, string> }).env ?? {};
const API_BASE = ((env?.VITE_API_URL as string) || '/api/v1').replace(/\/$/, '');

const ACCESS_KEY = 'sala_access';
const REFRESH_KEY = 'sala_refresh';

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status: number, code = 'ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

let accessToken: string | null = typeof localStorage !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null;
let currentSchoolId: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null;
}

export function storeTokens(access: string, refresh?: string): void {
  accessToken = access;
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  accessToken = null;
  currentSchoolId = null;
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function setSchoolId(id: string | null): void {
  currentSchoolId = id;
}

export function getSchoolId(): string | null {
  return currentSchoolId;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
}

async function request<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const multipart = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (currentSchoolId) headers['X-School-Id'] = currentSchoolId;
  if (body !== undefined && !multipart) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${normalizedPath}`, {
      method,
      headers,
      body: body !== undefined ? (multipart ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError('Network error — is the backend running?', 0);
  }

  if (res.status === 401 && accessToken && getRefreshToken() && !normalizedPath.startsWith('/auth/')) {
    if (await refreshSession()) {
      return request<T>(normalizedPath, { method, body });
    }
  }

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    const err = (payload as { error?: { message?: string; code?: string } }) ?? {};
    throw new ApiError(err.error?.message || `Request failed (${res.status})`, res.status, err.error?.code);
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data ?? (payload as T);
  }
  return payload as T;
}

async function refreshSession(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    const payload = (await res.json()) as { data?: { access: string; refresh?: string } } | { access: string; refresh?: string };
    const data = ('data' in payload ? payload.data : payload) as { access: string; refresh?: string } | undefined;
    if (!data) return false;
    storeTokens(data.access, data.refresh);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export interface Tokens {
  access: string;
  refresh?: string;
}

export function apiLogin(email: string, password: string): Promise<Tokens> {
  return api.post<Tokens>('/auth/login', { email, password });
}

export function apiMe(): Promise<ApiUser> {
  return api.get<ApiUser>('/auth/me');
}

export function apiLogout(): Promise<unknown> {
  return api.post('/auth/logout', { refresh: getRefreshToken() });
}

export function getDashboard<T = unknown>(kind: string): Promise<T> {
  return api.get<T>(`/dashboards/${kind}/`);
}

/** First school a logged-in user should operate in. Non-superusers return their
 *  only scoped school; superusers fall back to the first platform school. */
export async function resolveSchoolFor(me: ApiUser): Promise<string | null> {
  const scoped = (me.school_ids ?? []).filter(Boolean);
  if (scoped.length) return scoped[0];
  if (!me.is_superuser) return null;
  try {
    const schools = await api.get<ApiSchool[]>('/schools/schools/');
    return schools[0]?.id ?? null;
  } catch {
    return null;
  }
}
