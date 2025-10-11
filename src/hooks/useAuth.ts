'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import authService from '@/services/authService';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      
      // Clear cookie
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Redirect to login
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  const getUser = useCallback(() => {
    return authService.getStoredUser();
  }, []);

  return {
    logout,
    isAuthenticated,
    getUser,
    isLoading,
  };
}
