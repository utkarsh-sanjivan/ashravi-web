import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Ashravi Web',
  description: 'Welcome to Ashravi Web learning platform',
};

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Ashravi Web</h1>
      <p className="text-lg">Your comprehensive learning platform for children</p>
    </main>
  );
}
