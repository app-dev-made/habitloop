import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'HabitLoop — Build Habits That Stick',
    template: '%s · HabitLoop',
  },
  description: 'Predictive habit coaching. One tap to log, smart nudges before you fail. Build habits that actually last.',
  keywords: ['habit tracker','habit coaching','productivity','self improvement','daily habits','streak tracker','behavior change'],
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
        {/* Fonts - preconnect first, then load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />

        {/* PWA / mobile */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="HabitLoop" />
        <meta name="application-name" content="HabitLoop" />

        {/* Windows tiles */}
        <meta name="msapplication-TileColor" content="#1D9E75" />
        <meta name="msapplication-TileImage" content="/icons/icon-144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Apple touch icon (explicit, in addition to Next.js icons) */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />

        {/* Apple splash screens — prevents white flash on iOS PWA launch */}
        {/* iPhone 14 Pro Max */}
        <link rel="apple-touch-startup-image" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" href="/icons/icon-512.png" />
        {/* iPhone 14 / 13 / 12 */}
        <link rel="apple-touch-startup-image" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" href="/icons/icon-512.png" />
        {/* iPhone SE */}
        <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="/icons/icon-256.png" />
        {/* iPad */}
        <link rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" href="/icons/icon-512.png" />

        {/* Accessibility / color scheme */}
        <meta name="color-scheme" content="dark light" />
      </head>
      <body>
        {/* Keyboard/screen-reader skip link */}
        <a href="#main-content" className="skip-link">Skip to main content</a>

        <div id="main-content">
          {children}
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          // Restore theme before first paint — prevents flash
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
                .then(function(reg) {
                  // Register periodic background sync (daily reminder)
                  if ('periodicSync' in reg) {
                    reg.periodicSync.register('daily-reminder', {
                      minInterval: 24 * 60 * 60 * 1000
                    }).catch(function() {
                      // Permission not granted — silent fail
                    });
                  }
                })
                .catch(function(err) {
                  // SW registration failed — app still works, just no offline
                });
            });
          }
        ` }} />
      </body>
    </html>
  )
}
