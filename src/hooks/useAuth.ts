'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useLogoutMutation } from '@/store/api/auth.api';
import { selectIsAuthenticated, selectUserProfile } from '@/store/selectors/user.selectors';

export function useAuth() {
  const router = useRouter();
  const [logoutMutation, { isLoading }] = useLogoutMutation();
  const userState = useAppSelector(selectUserProfile);
  const isUserAuthenticated = useAppSelector(selectIsAuthenticated);

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logoutMutation, router]);

  const isAuthenticated = useCallback(() => {
    return isUserAuthenticated;
  }, [isUserAuthenticated]);

  const getUser = useCallback(() => {
    return isUserAuthenticated ? userState : null;
  }, [isUserAuthenticated, userState]);

  return {
    logout,
    isAuthenticated,
    getUser,
    isLoading,
  };
}
