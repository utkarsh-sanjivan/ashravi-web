'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { clearUser } from '@/store/user.slice';
import { selectIsAuthenticated, selectUserProfile } from '@/store/selectors/user.selectors';
import type { RootState } from '@/store';

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  serverAuthenticated?: boolean;
  onRedirect?: () => void;
}

interface UseAuthGuardResult {
  isAuthenticated: boolean;
  isChecking: boolean;
  user: RootState['user'] | null;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}): UseAuthGuardResult {
  const { requireAuth = true, redirectTo = '/auth/login', serverAuthenticated = false, onRedirect } = options;
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const hasRedirectedRef = useRef(false);
  const userState = useAppSelector(selectUserProfile);
  const clientAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthenticated = Boolean(serverAuthenticated || clientAuthenticated);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!requireAuth) {
      setIsChecking(false);
      return;
    }

    if (!isAuthenticated) {
      if (hasRedirectedRef.current) {
        setIsChecking(false);
        return;
      }

      dispatch(clearUser());

      const targetUrl = new URL(redirectTo, window.location.origin);
      if (pathname && !targetUrl.searchParams.has('redirect')) {
        targetUrl.searchParams.set('redirect', pathname);
      }

      if (typeof onRedirect === 'function') {
        onRedirect();
      }

      router.replace(`${targetUrl.pathname}${targetUrl.search}`);
      hasRedirectedRef.current = true;
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
  }, [dispatch, hasHydrated, isAuthenticated, onRedirect, pathname, redirectTo, requireAuth, router]);

  return {
    isAuthenticated,
    isChecking,
    user: isAuthenticated ? userState : null,
  } as UseAuthGuardResult;
}
