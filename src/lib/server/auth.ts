// src/lib/server/auth.ts
import jwt, { type SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { serverEnv } from './env';
import type { RequestEvent } from '@sveltejs/kit';

const { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, ADMIN_EMAIL, ADMIN_PASSWORD_HASH } = serverEnv;

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin';
  type: 'access' | 'refresh';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: Omit<JWTPayload, 'type'>): string {
  const tokenPayload = { ...payload, type: 'access' as const };
  return jwt.sign(
    tokenPayload,
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export function generateRefreshToken(payload: Omit<JWTPayload, 'type'>): string {
  const tokenPayload = { ...payload, type: 'refresh' as const };
  return jwt.sign(
    tokenPayload,
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function authenticateAdmin(email: string, password: string): Promise<{ userId: string; email: string } | null> {
  if (email !== ADMIN_EMAIL) {
    return null;
  }
  
  const isValid = await verifyPassword(password, ADMIN_PASSWORD_HASH);
  if (!isValid) {
    return null;
  }
  
  return {
    userId: 'admin',
    email: ADMIN_EMAIL
  };
}

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export async function requireAuth(event: RequestEvent): Promise<JWTPayload> {
  const authHeader = event.request.headers.get('Authorization');
  const token = extractBearerToken(authHeader);
  
  if (!token) {
    throw new Response('Token de acesso obrigatório', { status: 401 });
  }
  
  const payload = verifyToken(token);
  if (!payload || payload.type !== 'access') {
    throw new Response('Token inválido ou expirado', { status: 401 });
  }
  
  // Store user info in locals for use in routes
  event.locals.user = payload;
  
  return payload;
}

export function requireRefreshToken(token: string): JWTPayload {
  const payload = verifyToken(token);
  if (!payload || payload.type !== 'refresh') {
    throw new Response('Token de renovação inválido', { status: 401 });
  }
  return payload;
}