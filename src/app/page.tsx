import { isAuthenticated } from '@/lib/auth';
import RootPageWrapper from '@/components/pages/RootPageWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ashravi - Empowering Parents',
  description: 'Discover evidence-based parenting strategies designed by child behavior experts',
};

interface RootPageProps {
  searchParams: Promise<{ view?: string }>;
}

export default async function RootPage(props: RootPageProps) {
  // Await searchParams before using it
  const searchParams = await props.searchParams;

  // Check authentication on server
  const authenticated = await isAuthenticated();

  console.log('🔐 Server-side authentication check:', authenticated);

  return <RootPageWrapper serverAuthenticated={authenticated} />;
}
