'use client';

import { useMemo } from 'react';
import { useProfileQuery } from '@/store/api/auth.api';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectIsAuthenticated } from '@/store/selectors/user.selectors';
import LandingPage from '@/components/pages/LandingPage';
import Homepage from '@/components/pages/Homepage';

export default function RootPageWrapper({ serverAuthenticated }: { serverAuthenticated: boolean }) {
  const clientAuthenticated = useAppSelector(selectIsAuthenticated);
  const { isLoading: profileLoading } = useProfileQuery(undefined, {
    skip: serverAuthenticated || clientAuthenticated,
  });

  const isAuthenticated = useMemo(
    () => Boolean(serverAuthenticated || clientAuthenticated),
    [serverAuthenticated, clientAuthenticated]
  );

  const isLoading = profileLoading && !isAuthenticated;

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '1.5rem',
        color: '#0070f3'
      }}>
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Homepage />;
  }

  return <LandingPage />;
}
