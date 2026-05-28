import crypto from 'crypto';

export type QrLoginStatus = 'pending' | 'scanned' | 'confirmed' | 'expired' | 'cancelled' | 'used';

export interface QrLoginSession {
  token: string;
  status: QrLoginStatus;
  createdAt: number;
  expiresAt: number;
  authToken?: string;
  userAgent?: string;
}

type GlobalWithQr = typeof globalThis & { __moonTvQrLoginStore?: Map<string, QrLoginSession> };

const g = globalThis as GlobalWithQr;
export const qrLoginStore = g.__moonTvQrLoginStore || new Map<string, QrLoginSession>();
g.__moonTvQrLoginStore = qrLoginStore;

export function createQrLoginSession(ttlMs = 120_000) {
  cleanupQrLoginSessions();
  const token = crypto.randomBytes(24).toString('base64url');
  const now = Date.now();
  const session: QrLoginSession = {
    token,
    status: 'pending',
    createdAt: now,
    expiresAt: now + ttlMs,
  };
  qrLoginStore.set(token, session);
  return session;
}

export function getQrLoginSession(token?: string | null) {
  if (!token) return null;
  const session = qrLoginStore.get(token) || null;
  if (session && session.expiresAt <= Date.now() && session.status !== 'confirmed' && session.status !== 'used') {
    session.status = 'expired';
  }
  return session;
}

export function cleanupQrLoginSessions() {
  const now = Date.now();
  for (const [token, session] of Array.from(qrLoginStore.entries())) {
    if (session.expiresAt + 300_000 < now || session.status === 'used') {
      qrLoginStore.delete(token);
    }
  }
}
