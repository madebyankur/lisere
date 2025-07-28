import './globals.css';

import { Instrument_Serif, Inter } from 'next/font/google';

// Using any for children prop due to React 19 type compatibility issues
// TODO: Update when React 19 types are more stable
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
});

export const metadata = {
  title: {
    default: 'Liseré',
    template: '%s | Liseré',
  },
  description:
    'Liseré is a lightweight and composable React component for selecting and highlighting text. Perfect for code documentation, tutorials, and interactive text highlighting and selection.',
  keywords: [
    'react',
    'text highlighter',
    'syntax highlighting',
    'code highlighting',
    'react component',
    'documentation',
    'typescript',
    'javascript',
    'ui component',
    'text selection',
  ],
  authors: [{ name: 'Ankur Chauhan' }],
  creator: 'Ankur Chauhan',
  publisher: 'Liseré',
  formatDetection: {
    email: 'hi@ankurchauhan.design',
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lisere.ankur.design'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lisere.ankur.design',
    siteName: 'Liseré',
    title: 'Liseré',
    description:
      'Liseré is a lightweight and composable React component for selecting and highlighting text. Perfect for code documentation, tutorials, and interactive text highlighting and selection.',
    images: [
      {
        url: '/assets/og.png',
        width: 1200,
        height: 630,
        alt: 'Liseré - Lightweight and composable React component for text highlighting',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@madebyankur',
    creator: '@madebyankur',
    title: 'Liseré',
    description:
      'Liseré is a lightweight and composable React component for selecting and highlighting text. Perfect for code documentation, tutorials, and interactive text highlighting and selection.',
    images: [
      {
        url: '/assets/twitter.png',
        alt: 'Liseré - Lightweight and composable React component for text highlighting',
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'development',
  classification: 'Developer Tools',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Liseré',
    'application-name': 'Liseré',
    'msapplication-TileColor': '#fafaf9',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#fafaf9',
    'color-scheme': 'light dark',
  },
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link
          rel="apple-touch-icon"
          href="/assets/apple-touch-icon.png"
          sizes="180x180"
        />
        <link
          rel="apple-touch-icon"
          href="/assets/apple-touch-icon-152x152.png"
          sizes="152x152"
        />
        <link
          rel="apple-touch-icon"
          href="/assets/apple-touch-icon-120x120.png"
          sizes="120x120"
        />
        <link
          rel="apple-touch-icon"
          href="/assets/apple-touch-icon-76x76.png"
          sizes="76x76"
        />

        <link
          rel="icon"
          href="/assets/favicon.svg"
          type="image/svg+xml"
          sizes="32x32"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={cn(
          instrumentSerif.variable,
          inter.variable,
          'bg-background antialiased',
        )}
      >
        <main className="bg-background">{children}</main>
      </body>
    </html>
  );
}
