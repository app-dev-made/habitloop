import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'HabitLoop — Build Habits That Stick',
    template: '%s · HabitLoop',
  },
  description: 'Predictive habit coaching. One tap to log, smart nudges before you fail. Free forever.',
  keywords: ['habit tracker', 'habit coaching', 'productivity', 'self improvement', 'daily habits', 'behavior change', 'streak tracker'],
  authors: [{ name: 'HabitLoop' }],
  creator: 'HabitLoop',
  metadataBase: new URL('https://habitloop-rosy.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://habitloop-rosy.vercel.app',
    title: 'HabitLoop — Build Habits That Stick',
    description: 'Predictive habit coaching. One tap to log, smart nudges before you fail.',
    siteName: 'HabitLoop',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'HabitLoop — Build Habits That Stick' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HabitLoop — Build Habits That Stick',
    description: 'Predictive habit coaching. One tap to log, smart nudges before you fail.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HabitLoop',
  },
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: [
      { url: '/icons/icon-32.png',  sizes: '32x32',   type: 'image/png' },
      { url: '/icons/icon-96.png',  sizes: '96x96',   type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#0F0E0C' },
    { media: '(prefers-color-scheme: light)', color: '#1D9E75' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  colorScheme: 'dark light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="HabitLoop" />
        <meta name="application-name" content="HabitLoop" />
        <meta name="msapplication-TileColor" content="#1D9E75" />
        <meta name="msapplication-TileImage" content="/icons/icon-144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body>
        {/* Skip to content for keyboard/screen reader users */}
        <a href="#main-content" className="skip-link">Skip to main content</a>

        <div id="main-content">
          {children}
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          // Restore theme before paint to avoid flash
          (function() {
            try {
              var t = localStorage.getItem('theme');
              if (t === 'light') document.documentElement.classList.add('light');
            } catch(e) {}
          })();

          // Register service worker
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .catch(function(e) { console.warn('SW registration failed:', e); });
            });
          }

          // Register periodic background sync after SW is ready
          if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(function(reg) {
              reg.periodicSync.register('daily-reminder', { minInterval: 24 * 60 * 60 * 1000 })
                .catch(function() {});
            });
          }
        ` }} />
      </body>
    </html>
  )
}
