# HabitLoop 🔁

> **Predictive habit coaching. One tap to log. Smart nudges before you fail.**

HabitLoop goes beyond streak tracking — it learns your personal behavioral patterns and predicts *before* you're about to skip a habit, then nudges you early. Built with Next.js 15, Supabase, and a custom logistic regression engine in pure JavaScript.

---

## ✦ What's inside

| Feature | Details |
|---------|---------|
| One-tap logging | Tap to cycle done → partial → skipped |
| Skip prediction engine | Logistic regression, trained per habit per user after 21 days |
| Proactive nudges | Smart notifications before you fail, not after |
| 3-step onboarding | Welcome → habit picker → reminder time |
| Habit management | Edit, archive, restore habits from the Habits tab |
| GitHub-style heatmap | 6 months of activity visualized |
| Weekly mini-chart | Last 7 days at a glance on the dashboard |
| Share stats | Generate a shareable card with your consistency score |
| Dark / Light mode | Full theme toggle with CSS variable system |
| Data export | Download your complete habit log as CSV |
| Habit templates | Morning Routine, Student Success, Athlete, Mindful Life |
| Skip reason tracking | Records *why* you skipped to improve predictions |
| Habit notes | Add a 280-char note after logging any habit |
| PWA install banner | Prompts iOS and Android users to add to home screen |
| Offline support | Service worker caches shell, queues logs when offline |
| Push notifications | Web Push API — no Firebase needed |
| Confetti | Fires when you complete all habits for the day |
| Haptic feedback | 8ms vibration on mobile habit tap |
| Rate limiting | API protected against abuse |
| Accessibility | ARIA labels, keyboard nav, reduced motion, skip link |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend + API | Next.js 15 (App Router) |
| Database + Auth | Supabase (Postgres + magic link auth) |
| Styling | Tailwind CSS + CSS custom properties |
| Charts | Recharts |
| ML Engine | Custom logistic regression (pure JavaScript) |
| Push notifications | Web Push API |
| Deployment | Vercel |

---

## 🚀 Setup — Step by Step

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/habitloop.git
cd habitloop
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → create a free account → **New project**
2. Name it `habitloop`, choose a region close to you
3. Go to **SQL Editor** → paste the **entire** contents of `supabase-schema.sql` → **Run**
4. Go to **Settings → API Keys** → copy:
   - **Project URL** (e.g. `https://xxxx.supabase.co`)
   - **Publishable key** (starts with `sb_publishable_`)

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key-here
```

### 4. Configure auth redirect URLs in Supabase

Go to **Supabase → Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` (dev) or your Vercel URL (prod)
- **Redirect URLs**: Add `http://localhost:3000/auth/callback`

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📦 Deploy to Vercel

### Option A — GitHub import (recommended)

1. Push your code to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy** — your app is live at `your-project.vercel.app` ✅

### After deploying

1. Update Supabase **Site URL** to your Vercel URL
2. Add `https://your-project.vercel.app/auth/callback` to **Redirect URLs**

### Custom domain

Buy `habitloop.app` on Namecheap (~$12/yr) → add to Vercel → update Supabase redirect URLs.

---

## 📱 PWABuilder — Getting 45/45

Your app already has everything PWABuilder needs:
- ✅ Full `manifest.json` with all required fields
- ✅ 11 icon sizes (32px → 1024px) including maskable
- ✅ Screenshots for narrow form factor
- ✅ Service worker with offline caching + background sync
- ✅ HTTPS (Vercel auto-provides)
- ✅ `display: standalone` + `start_url` + `scope` + `id`

Steps:
1. Go to [pwabuilder.com](https://pwabuilder.com)
2. Enter your live Vercel URL
3. Score should be **45/45** ✅
4. Click **Package for stores** → Android APK/AAB
5. Submit to Google Play ($25 one-time)

---

## 📁 Project Structure

```
habitloop/
├── app/
│   ├── page.tsx                     # Landing page
│   ├── layout.tsx                   # Root layout + PWA meta
│   ├── globals.css                  # Global styles + light mode
│   ├── error.tsx                    # Global error boundary
│   ├── not-found.tsx                # 404 page
│   ├── auth/
│   │   ├── login/page.tsx           # Magic link login
│   │   └── callback/route.ts        # Auth redirect (→ onboarding or dashboard)
│   ├── onboarding/page.tsx          # 3-step new user setup
│   ├── dashboard/
│   │   ├── page.tsx                 # Main dashboard (server)
│   │   ├── loading.tsx              # Skeleton loading state
│   │   ├── error.tsx                # Dashboard error boundary
│   │   ├── actions.ts               # Server actions (log, create, archive)
│   │   ├── habits/                  # Habit management (edit, restore)
│   │   ├── insights/                # Charts + heatmap + share
│   │   └── settings/                # Theme, notifications, export, sign out
│   └── api/
│       ├── habits/route.ts          # REST API (rate limited)
│       ├── logs/route.ts            # REST API (rate limited)
│       └── predictions/route.ts     # ML engine endpoint (rate limited)
├── components/
│   ├── dashboard/
│   │   ├── DashboardNav.tsx         # Time-aware greeting + avatar
│   │   ├── TodayView.tsx            # Habit list + skip modal + confetti
│   │   ├── InsightsClient.tsx       # Charts + heatmap + share
│   │   └── WeeklySummary.tsx        # 7-day mini bar chart
│   ├── habits/
│   │   ├── HabitCard.tsx            # Swipe-to-archive card with confirmation
│   │   ├── ConsistencyRing.tsx      # SVG progress ring (accessible)
│   │   ├── HeatMap.tsx              # GitHub-style 6-month heatmap
│   │   ├── AddHabitModal.tsx        # 3-view modal: pick/template/custom
│   │   ├── HabitManagerClient.tsx   # Edit + archive + restore habits
│   │   └── NoteModal.tsx             # 280-char note after logging
│   └── ui/
│       ├── BottomNav.tsx            # 4-tab nav with ARIA labels
│       ├── Confetti.tsx             # Canvas confetti animation
│       ├── InstallBanner.tsx        # iOS + Android PWA install prompt
│       ├── ShareCard.tsx            # Stats share card (SSR-safe)
│       ├── ThemeToggle.tsx          # Dark/light mode toggle
│       ├── SkeletonLoader.tsx       # Shimmer loading components
│       └── Toast.tsx                # Toast notification system
├── lib/
│   ├── supabase-client.ts           # Browser Supabase client
│   ├── supabase-server.ts           # Server Supabase client (async cookies)
│   ├── prediction-engine.ts         # Logistic regression ML model
│   ├── habits.ts                    # Utility functions + constants
│   └── rate-limit.ts                # In-memory API rate limiter
├── types/index.ts                   # All TypeScript types
├── public/
│   ├── manifest.json                # PWA manifest (45/45 score)
│   ├── sw.js                        # Service worker v2 (offline + push + sync)
│   ├── icons/                       # 11 icon sizes
│   ├── screenshots/                 # Required for PWABuilder
│   ├── browserconfig.xml            # Windows tiles
│   ├── robots.txt                   # SEO
│   └── sitemap.xml                  # SEO
└── supabase-schema.sql              # Complete DB setup (run this first!)
```

---

## 🎓 College Application Notes

This project demonstrates:
- **Machine learning** — logistic regression with 5 behavioral features, retrained per user
- **Behavioral psychology** — BJ Fogg's Tiny Habits framework, Ebbinghaus forgetting curve
- **Full-stack engineering** — Next.js, Supabase, TypeScript, PWA APIs
- **Product thinking** — onboarding, friction reduction, optimistic UI, skip reason tracking
- **Accessibility** — ARIA labels, keyboard navigation, reduced motion, high contrast
- **Security** — Row Level Security, rate limiting, environment variable management
- **Real users** — deploy it, share it, cite your user count and consistency improvement %

**Essay angle:** *"80% of people fail new habits within 2 weeks. I built a behavioral coaching app that predicts when users are about to skip and intervenes before they do — not after. It has [X] active users and improved their 30-day consistency by [Y]%."*

---

## 📜 License

MIT — use it, learn from it, ship it.
