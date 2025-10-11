'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import LandingPage from '@/components/pages/LandingPage';
import Homepage from '@/components/pages/Homepage';

export default function RootPageWrapper({ serverAuthenticated }: { serverAuthenticated: boolean }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(serverAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check client-side authentication
    const clientAuth = authService.isAuthenticated();
    
    console.log('🔍 Client-side auth check:', {
      serverAuthenticated,
      clientAuth,
      hasToken: !!localStorage.getItem('accessToken'),
      cookies: document.cookie
    });

    // If client says authenticated but server doesn't, refresh the page
    if (clientAuth && !serverAuthenticated) {
      console.log('🔄 Client authenticated but server not - refreshing...');
      router.refresh();
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(serverAuthenticated);
    }
    
    setIsLoading(false);
  }, [serverAuthenticated, router]);

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
