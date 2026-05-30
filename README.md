# HabitLoop 🔁

> **Predictive habit coaching. One tap to log. Smart nudges before you fail.**

HabitLoop goes beyond streak tracking — it learns your personal behavioral patterns and predicts *before* you're about to skip a habit, then nudges you early. Built with Next.js 14, Supabase, and a custom logistic regression engine.

---

## ✦ Features

- **One-tap logging** — tap to cycle done → partial → skipped
- **Skip prediction engine** — logistic regression model per habit, trained on your data
- **Proactive nudges** — smart notifications before you fail, not after
- **Difficulty scaling** — auto-suggests a smaller habit when you're struggling
- **Insights dashboard** — 30-day charts, day-of-week success rates, per-habit consistency
- **PWA** — installable on any device, works offline, no app store needed
- **Push notifications** — native Web Push API, no Firebase required

---

## 🛠 Tech Stack

| Layer | Tool |
|-------|------|
| Frontend + API | Next.js 14 (App Router) |
| Database + Auth | Supabase (Postgres + magic link auth) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| ML Engine | Custom logistic regression (pure JS) |
| Push Notifications | Web Push API |
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

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New project** — name it `habitloop`
3. Go to **SQL Editor** → paste the entire contents of `supabase-schema.sql` → click **Run**
4. Go to **Settings → API** — copy your **Project URL** and **anon public** key

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Enable magic link auth in Supabase

1. Supabase Dashboard → **Authentication → Providers**
2. Make sure **Email** is enabled (it is by default)
3. Go to **Authentication → URL Configuration**
4. Set **Site URL** to `http://localhost:3000` (dev) or your Vercel URL (prod)
5. Add `http://localhost:3000/auth/callback` to **Redirect URLs**

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📦 Deploy to Vercel (free)

### Option A — One-click from GitHub

1. Push your code to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add your environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**
5. Your app is live at `your-project.vercel.app` ✅

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel
# Follow the prompts — it auto-detects Next.js
```

### After deploying

1. Go back to Supabase → **Authentication → URL Configuration**
2. Update **Site URL** to your Vercel URL (e.g. `https://habitloop.vercel.app`)
3. Add `https://habitloop.vercel.app/auth/callback` to **Redirect URLs**

### Custom domain (recommended for college apps)

1. Buy `habitloop.app` on [Namecheap](https://namecheap.com) (~$12/yr)
2. In Vercel → your project → **Settings → Domains** → add your domain
3. Follow Vercel's DNS instructions (takes ~10 min to propagate)
4. Update Supabase redirect URLs again with your custom domain

---

## 📱 Make it installable — PWABuilder

[PWABuilder](https://pwabuilder.com) lets you package your PWA into an Android APK, iOS package, or Windows app — all from your live URL.

### Step 1 — Verify your PWA is valid

Your app already has everything PWABuilder needs:
- ✅ `public/manifest.json` — full app manifest
- ✅ `public/sw.js` — service worker with offline caching
- ✅ HTTPS (Vercel provides this automatically)
- ✅ Icons referenced in manifest (add `icon-192.png` and `icon-512.png` to `/public`)

> **Add icons:** You need two PNG icons in `/public/`:
> - `icon-192.png` — 192×192px
> - `icon-512.png` — 512×512px
>
> Use [favicon.io](https://favicon.io) or [realfavicongenerator.net](https://realfavicongenerator.net) to generate them for free.

### Step 2 — Run PWABuilder

1. Go to [pwabuilder.com](https://pwabuilder.com)
2. Enter your live URL: `https://habitloop.vercel.app` (or your custom domain)
3. Click **Start** — it scans your manifest and service worker
4. You should see a **score of 95+** with all green checks
5. Click **Package for stores**

### Step 3 — Choose your platform

| Platform | What you get | Requirements |
|----------|-------------|--------------|
| **Android** | APK + AAB for Google Play | Free — just download |
| **iOS** | Xcode project | Needs a Mac + Apple Dev account ($99/yr) |
| **Windows** | MSIX for Microsoft Store | Free |

For Google Play, PWABuilder generates a **Trusted Web Activity (TWA)** — your PWA wrapped in a native Android shell. It's the same app, just installable from the Play Store.

### Step 4 — Publish to Google Play

1. Download the **Android package** from PWABuilder
2. Create a [Google Play Console](https://play.google.com/console) account ($25 one-time)
3. Create a new app → upload the AAB file
4. Fill in store listing (name, description, screenshots)
5. Submit for review (~3 days)

---

## 🧠 How the prediction engine works

After 21 days of data, a nightly job computes a skip risk score (0–100) for each of your habits. It uses 5 features:

1. **Day-of-week skip rate** — do you always skip on Tuesdays?
2. **Streak fragility** — streaks under 3 days are unstable
3. **Energy trend** — low energy logged for 2+ days raises risk
4. **Days since last completion** — the longer the gap, the higher the risk
5. **Overall 30-day skip rate** — your baseline for this habit

These are fed into a logistic regression model (implemented in `lib/prediction-engine.ts`). If skip risk > 70%, a smart push notification fires before your usual habit window.

---

## 📁 Project structure

```
habitloop/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout + fonts
│   ├── globals.css               # Global styles
│   ├── middleware.ts             # Auth guard
│   ├── auth/
│   │   ├── login/page.tsx        # Magic link login
│   │   └── callback/route.ts    # Auth redirect handler
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard (server)
│   │   ├── actions.ts            # Server actions
│   │   ├── insights/page.tsx     # Charts + patterns
│   │   └── settings/page.tsx    # Settings
│   └── api/
│       ├── habits/route.ts       # REST API
│       ├── logs/route.ts
│       └── predictions/route.ts  # Runs ML engine
├── components/
│   ├── dashboard/
│   │   ├── DashboardNav.tsx
│   │   ├── TodayView.tsx         # Main habit logging UI
│   │   └── InsightsClient.tsx    # Charts
│   └── habits/
│       ├── ConsistencyRing.tsx   # SVG progress ring
│       └── AddHabitModal.tsx     # Add habit form
├── lib/
│   ├── supabase-client.ts        # Browser Supabase client
│   ├── supabase-server.ts        # Server Supabase client
│   ├── prediction-engine.ts      # Logistic regression ML
│   └── habits.ts                 # Utility functions
├── types/
│   └── index.ts                  # All TypeScript types
├── public/
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service worker
│   ├── icon-192.png              # ← you need to add this
│   └── icon-512.png              # ← you need to add this
└── supabase-schema.sql           # Run this in Supabase
```

---

## 🎓 College application notes

This project demonstrates:
- **Behavioral psychology research** (BJ Fogg's Tiny Habits, Ebbinghaus forgetting curve)
- **Machine learning** (logistic regression, feature engineering, model training)
- **Full-stack development** (Next.js, Supabase, TypeScript)
- **Product thinking** (solving the friction problem, optimistic UI, PWA)
- **Real users** — deploy it, share it, cite your user count

In your essay: *"I built a habit tracking app that predicts when users are about to fail and intervenes before they do — not after. It has [X] active users and improved their 30-day habit consistency by [Y]%."*

---

## 📜 License

MIT — use it, learn from it, ship it.
