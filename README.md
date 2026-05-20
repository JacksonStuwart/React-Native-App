# Atlas — Personal Dashboard

Atlas is a personal life dashboard built with **Next.js 15**, **TypeScript**, **Tailwind v4**, **shadcn/ui**, and **Firebase**. It tracks expenses (with categories, budgets, and charts), tasks (with priorities, due dates, tags, and drag-reorder), crypto (live prices, watchlist, portfolio, max-price calculator), and an AES-encrypted password vault.

This branch is the rewrite of an earlier Expo / React Native app (`Accounts`). The original RN source is preserved under [`legacy/`](./legacy) for reference.

---

## Stack

- **Framework**: Next.js 15 (App Router) · React 19 · TypeScript 5
- **Styling**: Tailwind CSS v4 with HSL design tokens · shadcn/ui primitives · Framer Motion
- **Backend**: Firebase Auth + Firestore (modular v9+ SDK, IndexedDB offline cache)
- **Data**: TanStack Query for the CoinGecko proxy; custom hooks wrapping Firestore `onSnapshot` for real-time reads
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts (area, pie, bar, sparkline)
- **DnD**: `@dnd-kit/sortable` for task reordering
- **Crypto**: `crypto-js` AES (compatible with the legacy RN ciphertext)
- **Password strength**: `@zxcvbn-ts/core` (lazy-loaded)
- **Icons / theme / toasts / palette**: lucide-react · next-themes · sonner · cmdk

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure Firebase
cp .env.local.example .env.local
# Edit .env.local with your Firebase web app credentials

# 3. Run
npm run dev
# → http://localhost:3000
```

### Other scripts

```bash
npm run build       # production build
npm run start       # serve the built app
npm run lint        # ESLint via next lint
npm run typecheck   # tsc --noEmit
```

---

## Firebase setup

1. Create a project at <https://console.firebase.google.com>
2. In **Project settings → General → Your apps**, register a Web app and copy the config keys into `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
3. **Authentication → Sign-in method**: enable Email/Password.
4. **Firestore Database**: create the database (Native mode). Apply security rules and composite indexes by deploying:
   ```bash
   npx firebase-tools deploy --only firestore:rules,firestore:indexes
   ```
   or paste `firestore.rules` and `firestore.indexes.json` from the repo root into the Firebase console.
5. **Production deploys**: in **Authentication → Settings → Authorized domains**, add your production domain (e.g. `atlas.yourdomain.com`) or login will silently fail in prod.

---

## Features

| Area | What's in it |
|---|---|
| **Expenses** | Amount, category, date, description, notes, recurring toggle. Tabs for List (with search/category/date-range filters and CSV export), Charts (30-day trend area, category pie, 12-month bar), Budgets (overall monthly/yearly or per-category, with progress bars and over-budget indicators), and Categories (icon + color picker, CRUD). |
| **Tasks** | Title, priority (low/medium/high), due date with overdue/today indicators, tags (chips), drag-to-reorder among active tasks; completed tasks sink to the bottom. Filters by status, priority, and tag. |
| **Crypto** | Tracker (top 50 coins via CoinGecko, 7-day sparklines, 24h change), Watchlist (star coins from Tracker), Portfolio (track held amounts; values update with live prices), Calculator (port of the original RN max-price math, enhanced with live BTC price auto-fill and configurable reference coin). |
| **Vault** | Session-scoped master key (in `sessionStorage`, cleared on Lock or sign-out). Verifier sentinel detects wrong key without trial-decrypting every entry. Per entry: AES-encrypted username, password, and notes; plaintext source name and tags for searchability. Password generator (configurable), zxcvbn strength meter, copy-to-clipboard with 30s auto-clear. |
| **Cross-cutting** | Dark mode (system / light / dark). Cmd/Ctrl+K command palette for navigation and theme. Responsive shell with sidebar on desktop and Sheet drawer on mobile. Real-time updates via Firestore `onSnapshot`. Offline cache via IndexedDB persistence. PWA manifest for install. Multi-currency support (defaults to INR; switch in Settings). |

---

## Project structure

```
app/
  layout.tsx                         root layout with providers
  globals.css                        Tailwind v4 tokens + dark mode
  manifest.ts                        PWA manifest
  page.tsx                           landing
  (auth)/{login,signup,forgot}       auth routes
  dashboard/                         protected routes
    layout.tsx                       auth guard + shell
    page.tsx                         overview
    expenses/                        list, charts, budgets, categories
    tasks/                           smart task manager
    crypto/                          tracker, watchlist, portfolio, calculator
    vault/                           encrypted credentials
    settings/                        currency, profile
  api/crypto/markets/route.ts        CoinGecko proxy
components/
  ui/                                shadcn primitives
  providers/                         theme, auth, query
  expenses/, tasks/, crypto/, vault/ feature components
  sidebar, topbar, command-palette, theme-toggle, user-menu
hooks/                               use-auth, use-expenses, use-tasks, use-vault, use-crypto, use-master-key, ...
lib/
  firebase.ts                        modular SDK init
  auth.ts                            sign in/up/out + provisioning
  crypto.ts                          AES encrypt/decrypt + password gen
  firestore-schema.ts                Zod schemas + TS types
  expense-utils.ts                   month/year totals, series, budget math
  constants.ts                       currencies, default categories, priorities
  icons.tsx                          dynamic lucide icon mapping
  csv.ts                             export helper
  utils.ts                           cn, formatCurrency, formatCompactNumber
firestore.rules                      security rules (owner-only)
firestore.indexes.json               composite indexes
firebase.json                        firebase-tools config
legacy/                              the original React Native app
```

---

## Firestore data model

```
users/{uid}                          { displayName, email, settings: { currency, theme } }
  /expenses/{id}                     { amount, currency, categoryId, description, date, isRecurring, recurringRule, notes }
  /categories/{id}                   { name, icon, color, budgetMonthly, order }
  /budgets/{id}                      { name, amount, scope, categoryId, period }
  /tasks/{id}                        { title, completed, priority, dueDate, tags, order }
  /vault/{id}                        { name, username (AES), password (AES), url, notes (AES), tags }
  /vaultMeta/verifier                { ciphertext (AES of fixed marker) }
  /watchlist/{coinId}                { coinId, symbol }
  /portfolio/{coinId}                { coinId, amount }
```

Subcollections are reachable only by the document's owner; see `firestore.rules`.

---

## Deploying

Atlas runs on any Node-compatible host. **Vercel** is the easiest:

1. Push the branch and import the repo into Vercel.
2. Add the `NEXT_PUBLIC_FIREBASE_*` env vars in the Vercel project settings.
3. Add the production domain to Firebase Authentication's authorized domains list.
4. Deploy.

---

## Migrating from the React Native app

The original RN app stored expenses on **Firebase Realtime Database** with a per-month tree (`Users/{uid}/{YEAR}/{MONTH}/{id}`). Atlas uses **Firestore** with a single `expenses` subcollection per user, which is faster for querying, easier to chart, and cheaper to read in aggregate.

Atlas does **not** auto-migrate the old data — opening Atlas with the same Firebase project starts fresh. If you want the old data, a one-time migration script is straightforward to write against the legacy Realtime DB structure (shallow JSON: read all `Users/{uid}/{year}/{month}` keys, write each to `users/{uid}/expenses/{newId}` in Firestore with the date parsed from the `Date` field).

`crypto-js` AES output is identical across web and RN with the same passphrase, so the password vault's ciphertext is portable in either direction if you ever want to export from one and import into the other manually.

---

## License

Private project, all rights reserved.
