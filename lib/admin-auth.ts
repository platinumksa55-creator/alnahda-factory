import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { AdminConfig } from './types';
import { readStoreFile, writeStoreFile } from './storage';

const CONFIG_FILE = 'admin-config.json';
const SESSION_COOKIE_NAME = 'alnahda_admin_token';
const SECRET_KEY = process.env.ADMIN_SESSION_SECRET || 'alnahda-textile-factory-secret-key-2025';

export function getAdminConfig(): AdminConfig {
  const salt = 'default-salt-alnahda';
  const passwordHash = crypto.createHash('sha256').update('admin123' + salt).toString('hex');
  const fallback: AdminConfig = {
    username: 'admin',
    passwordHash,
    salt,
    siteName: { ar: 'النهضة للمنسوجات', en: 'Al-Nahda for Textiles' },
    contactPhone: '+201222422996',
    contactEmail: 'info@alnahdafactory.com',
    contactAddress: {
      ar: 'المحلة الكبرى - 2 شارع الحلو - طريق دمرو',
      en: 'EL-Mahalla EL Kobra, 2 AL-Halou St, Damro Road'
    }
  };
  return readStoreFile<AdminConfig>(CONFIG_FILE, fallback);
}

export function saveAdminConfig(config: AdminConfig): boolean {
  return writeStoreFile<AdminConfig>(CONFIG_FILE, config);
}

export function verifyAdminCredentials(username: string, password: string):boolean {
  const config = getAdminConfig();
  if (config.username !== username) {
    return false;
  }
  const hash = crypto.createHash('sha256').update(password + config.salt).toString('hex');
  return hash === config.passwordHash;
}

export function updateAdminPassword(newPassword: string): boolean {
  const config = getAdminConfig();
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.createHash('sha256').update(newPassword + salt).toString('hex');
  config.salt = salt;
  config.passwordHash = passwordHash;
  return saveAdminConfig(config);
}

// Generate signed session token
export function createSessionToken(username: string): string {
  const payload = {
    u: username,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payloadStr).toString('base64url');
  return `${payloadStr}.${signature}`;
}

// Verify signed session token
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadStr, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(payloadStr).toString('base64url');
  if (signature !== expectedSignature) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Check session in API route or Server Component
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// Check session from NextRequest (for route handlers or middleware)
export function isAuthenticatedRequest(req: NextRequest): boolean {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export { SESSION_COOKIE_NAME };
