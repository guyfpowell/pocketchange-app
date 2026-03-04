# PocketChange App

Mobile companion app for the [PocketChange](https://pocketchange.org.uk) platform.

**Donors only.** Thin client — all financial logic lives on the server.

---

## What it does

PocketChange lets donors give directly to people experiencing homelessness. Recipients carry a badge with a QR code; donors scan it with this app, choose an amount, and donate from their pre-loaded wallet. Donors can then track exactly how their money was spent — which vendors redeemed it and when.

---

## Tech stack

| | |
|---|---|
| Framework | React Native + Expo 54 |
| Routing | Expo Router 6 |
| Language | TypeScript (strict) |
| State | Zustand (auth) + TanStack Query (server data) |
| HTTP | Axios with Bearer token + auto-refresh interceptors |
| Secure storage | Expo SecureStore |
| Font | Poppins |

---

## Getting started

### Prerequisites

- Node 20+
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode + Simulator, or Expo Go on a physical device
- Android: Android Studio + Emulator, or Expo Go on a physical device

### Install

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` and set the API URL:

```bash
cp .env.example .env
```

```
# Production backend
EXPO_PUBLIC_API_URL=https://pocketchange-backend.onrender.com/api

# Local development
# EXPO_PUBLIC_API_URL=http://localhost:4000/api

EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Feature flags — set to true only in a custom dev build
EXPO_PUBLIC_STRIPE_ENABLED=false
```

### Expo Go vs custom build

Most of the app runs in **Expo Go** out of the box. The one exception is wallet top-up, which uses `@stripe/stripe-react-native` (a native module not bundled with Expo Go).

| Feature | Expo Go | Custom build |
|---------|---------|--------------|
| Sign in / register | ✅ | ✅ |
| QR scanner | ✅ | ✅ |
| Recipient profile + donate | ✅ | ✅ |
| Donation history + spend breakdown | ✅ | ✅ |
| Wallet top-up (Stripe) | ℹ️ placeholder shown | ✅ set `EXPO_PUBLIC_STRIPE_ENABLED=true` |

To build a custom dev client: see the [Expo dev builds guide](https://docs.expo.dev/develop/development-builds/introduction/).

### Run

```bash
# Start Metro bundler (scan QR with Expo Go)
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android
```

---

## Project structure

```
app/                  ← Expo Router file-based routes
  (auth)/             ← Unauthenticated screens (sign-in, register)
  (donor)/            ← Tab navigator (dashboard, scan, history, profile)
  recipient/[id].tsx  ← Recipient public profile + donate
  donation/[id].tsx   ← Spend breakdown for a single donation

src/
  components/ui/      ← Shared UI: Button, Card, Input, Spinner, Badge, Logo
  components/donor/   ← Donor-specific components (Phase 3+)
  components/recipient/ ← Recipient-specific components (Phase 5+)
  services/           ← API service modules (one per domain)
  hooks/              ← TanStack Query hooks
  store/              ← Zustand auth store
  lib/api.ts          ← Axios instance + auth interceptors
  theme/index.ts      ← Brand colours, spacing, typography tokens
  types/index.ts      ← Shared TypeScript types

assets/
  icon.png            ← App icon (used for iOS, Android adaptive, splash)
```

---

## Architecture rules

- **No financial logic in the app.** Server is the sole source of truth.
- **No balance calculations.** All amounts come from API responses.
- **No direct API calls in components.** Everything goes through `src/services/`.
- **Tokens stored in Expo SecureStore only** — never AsyncStorage.
- If any mobile decision conflicts with the website backend architecture, **the website wins**.

---

## Build phases

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Scaffold — Expo setup, theme, shared UI | ✅ Complete |
| 2 | Authentication — login, register, session | ✅ Complete |
| 3 | Donor Dashboard — wallet balance, top-up | ✅ Complete |
| 4 | QR Scanner & short code lookup | ✅ Complete |
| 5 | Recipient public profile | ✅ Complete |
| 6 | Donation flow | ✅ Complete |
| 7 | Donation history | ✅ Complete |
| 8 | Spend breakdown | ✅ Complete |
| 9 | Profile & account management | ✅ Complete |

See [plan-app.md](./plan-app.md) for the full implementation plan.

---

## Testing

74 unit tests across 17 suites covering services, hooks, the auth store, and UI components.

```bash
npm test          # watch mode
npm test -- --watchAll=false  # single run
```

---

## Contributing

Follow the commit convention:

```
chore: project setup
feat: authentication flow
feat: qr scanning
feat: recipient profile
feat: donation flow
feat: spend breakdown view
test: auth tests
```
