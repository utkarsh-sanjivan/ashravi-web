'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useLogoutMutation } from '@/store/api/auth.api';
import { selectIsAuthenticated, selectUserProfile } from '@/store/selectors/user.selectors';
import { clearUser } from '@/store/user.slice';

export function useAuth() {
  const router = useRouter();
  const [logoutMutation, { isLoading }] = useLogoutMutation();
  const userState = useAppSelector(selectUserProfile);
  const isUserAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(clearUser());
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [dispatch, logoutMutation, router]);

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
