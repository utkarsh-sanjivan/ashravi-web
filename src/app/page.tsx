import { Suspense } from 'react';
import { isAuthenticated, getUser } from '@/lib/auth';
import LandingPage from '@/components/pages/LandingPage';
import Homepage from '@/components/pages/Homepage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ashravi - Empowering Parents',
  description: 'Discover evidence-based parenting strategies designed by child behavior experts',
};

interface RootPageProps {
  searchParams: { view?: string };
}

// Loading component
function PageLoading() {
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

export default async function RootPage({ searchParams }: RootPageProps) {
  // Allow viewing specific page via URL parameter for development
  if (searchParams.view === 'home') {
    return <Homepage />;
  }
  
  if (searchParams.view === 'landing') {
    return <LandingPage />;
  }

  // Normal authentication check
  const authenticated = await isAuthenticated();
  const user = await getUser();

  // Log user info in development
  if (process.env.NODE_ENV === 'development') {
    if (user) {
      console.log('🔐 Authenticated User:', {
        name: user.name,
        email: user.email,
        id: user.id,
      });
    } else {
      console.log('🔓 Not authenticated - showing Landing Page');
    }
  }

  if (authenticated) {
    return (
      <Suspense fallback={<PageLoading />}>
        <Homepage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageLoading />}>
      <LandingPage />
    </Suspense>
  );
}
