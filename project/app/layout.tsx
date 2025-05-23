import { AuthProvider } from '@/components/auth/auth-provider';
import { CartProvider } from '@/components/cart/cart-provider';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { VercelAnalytics, VercelSpeedInsights, analyticsConfig } from '@/lib/analytics';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-RLPFD10EGB';

export const metadata: Metadata = {
  title: 'Luxe Intimates | Premium Adult Products',
  description: 'Discover our curated collection of premium intimate products for adults',
  metadataBase: new URL(appUrl),
  keywords: ['lingerie', 'intimate wear', 'adult products', 'luxury', 'premium', 'fashion'],
  authors: [{ name: 'Luxe Intimates' }],
  creator: 'Luxe Intimates',
  publisher: 'Luxe Intimates',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Luxe Intimates | Premium Adult Products',
    description: 'Discover our curated collection of premium intimate products for adults',
    url: appUrl,
    siteName: 'Luxe Intimates',
    type: 'website',
    images: [
      {
        url: `${appUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Luxe Intimates - Premium Adult Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxe Intimates | Premium Adult Products',
    description: 'Discover our curated collection of premium intimate products for adults',
    images: [`${appUrl}/twitter-image.jpg`],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
          async
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem={true}
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        
        {/* Vercel Analytics */}
        {analyticsConfig.enabled && (
          <>
            <VercelAnalytics />
            <VercelSpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}