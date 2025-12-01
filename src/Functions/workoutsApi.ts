import AsyncStorage from '@react-native-async-storage/async-storage';
import { api_root_url } from '../Settings/constants';
import { WorkoutCard, WorkoutDetail, Session, SessionEvent } from './types';

const ROOT = api_root_url.replace(/\/$/, '');
const API = ROOT.endsWith('/api') ? ROOT : `${ROOT}/api`;
export const MEDIA_BASE = ROOT.endsWith('/api') ? ROOT.slice(0, -4) : ROOT;

async function getAuthToken(): Promise<string | null> {
  const keys = ['access', 'access_token', 'token', 'authToken'];
  for (const k of keys) {
    const v = await AsyncStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${API}${path}`);
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
  });
  const token = await getAuthToken();
  const res = await fetch(url.toString(), {
    headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body?: any): Promise<T> {
  const token = await getAuthToken();
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });


  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export const WorkoutsApi = {
  list: (opts?: { genre?: string; difficulty?: string }) =>
    get<WorkoutCard[]>('/workouts', opts),
  detail: (slug: string) => get<WorkoutDetail>(`/workouts/${slug}`),

  startOrResume: (workoutId: number) =>
    post<Session>(`/workouts/sessions?workout_id=${workoutId}`),

  sendEvent: (sessionId: number, payload: SessionEvent) =>
    post<Session>(`/workouts/sessions/${sessionId}/events`, payload),
};