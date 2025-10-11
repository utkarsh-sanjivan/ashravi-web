import { isAuthenticated } from '@/lib/auth';
import RootPageWrapper from '@/components/pages/RootPageWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ashravi - Empowering Parents',
  description: 'Discover evidence-based parenting strategies designed by child behavior experts',
};

export default async function RootPage() {
  // Check authentication on server
  const authenticated = await isAuthenticated();

  console.log('🔐 Server-side authentication check:', authenticated);

  return <RootPageWrapper serverAuthenticated={authenticated} />;
}
