import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import LandingPage from '@/components/pages/LandingPage';
import Homepage from '@/components/pages/Homepage';

export const metadata = {
  title: 'Ashravi - Empowering Parents and Teachers',
  description: 'Evidence-based child behavior strategies for parents, teachers, and counselors',
};

export default async function RootPage() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    return <Homepage />;
  }

  return <LandingPage />;
}
