'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/hooks/useAppSelector';
import { useProfileQuery } from '@/store/api/auth.api';
import { selectIsAuthenticated, selectUserProfile } from '@/store/selectors/user.selectors';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  children: string[];
  enrolledCourses: string[];
  wishlist: string[];
}

export function useUser() {
  const userState = useAppSelector(selectUserProfile);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { isFetching } = useProfileQuery(undefined, {
    skip: isAuthenticated,
  });

  const user = useMemo<User | null>(() => {
    if (!isAuthenticated) {
      return null;
    }

    return {
      id: userState.id ?? '',
      name: userState.name ?? '',
      email: userState.email ?? '',
      role: userState.role ?? 'user',
      avatar: undefined,
      children: [],
      enrolledCourses: [],
      wishlist: [],
    };
  }, [isAuthenticated, userState]);

  return { user, loading: isFetching };
}
