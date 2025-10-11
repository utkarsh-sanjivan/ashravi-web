import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'Ashravi - Empowering Parents to Build Positive Child Behaviors',
  description: 'Evidence-based parenting strategies and courses designed by child behavior experts. Join thousands of parents building stronger relationships with their children.',
  keywords: 'parenting courses, child behavior, positive parenting, parent training, family behavior management',
  openGraph: {
    title: 'Ashravi - Parenting Platform for Child Behavior',
    description: 'Evidence-based parenting strategies and courses for parents',
    url: 'https://ashravi.com',
    siteName: 'Ashravi',
    images: [
      {
        url: 'https://ashravi.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ashravi Parenting Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashravi - Parenting Platform',
    description: 'Evidence-based parenting strategies for building positive child behaviors',
    images: ['https://ashravi.com/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Ashravi',
              description: 'Evidence-based parenting platform for child behavior',
              url: 'https://ashravi.com',
              logo: 'https://ashravi.com/logo.png',
              sameAs: [
                'https://facebook.com/ashravi',
                'https://twitter.com/ashravi',
                'https://linkedin.com/company/ashravi',
              ],
            }),
          }}
        />
      </head>
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
