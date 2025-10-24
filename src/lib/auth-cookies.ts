import { cookies } from 'next/headers';
import { env } from '@/config/env';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true as const,
  sameSite: 'strict' as const,
  secure: env.NODE_ENV === 'production',
  path: '/',
};

const SESSION_COOKIE_OPTIONS = {
  httpOnly: false as const,
  sameSite: 'strict' as const,
  secure: env.NODE_ENV === 'production',
  path: '/',
};

interface SetAuthCookiesInput {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUser;
  remember?: boolean;
}

export async function setAuthCookies({ accessToken, refreshToken, user, remember }: SetAuthCookiesInput) {
  const cookieStore = await cookies();
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days vs 7 days

  cookieStore.set('accessToken', accessToken, {
    ...TOKEN_COOKIE_OPTIONS,
    maxAge,
  });

  if (refreshToken) {
    cookieStore.set('refreshToken', refreshToken, {
      ...TOKEN_COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 60, // 60 days for refresh token
    });
  }

  if (user) {
    cookieStore.set('session', JSON.stringify(user), {
      ...TOKEN_COOKIE_OPTIONS,
      maxAge,
    });
  }

  cookieStore.set(env.AUTH_SESSION_COOKIE_NAME, 'active', {
    ...SESSION_COOKIE_OPTIONS,
    maxAge,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('session');
  cookieStore.delete(env.AUTH_SESSION_COOKIE_NAME);
}

export async function getAccessTokenFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken');
  return token?.value ?? null;
}

export async function getRefreshTokenFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('refreshToken');
  return token?.value ?? null;
}
