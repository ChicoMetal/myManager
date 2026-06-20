# myManager — Next Steps & Pending Tracker

**App:** Personal React Native toolkit  
**Current feature:** Eye Rest Reminder (fully built, verified on simulator)  
**Last updated:** 2026-06-20

---

## Legend
- `[ ]` Pending
- `[x]` Complete
- `[~]` In progress
- `[-]` Blocked / deferred

---

## 🔊 Audio

| # | Status | Task | Notes |
|---|--------|------|-------|
| A1 | `[x]` | Source real WAV files for sound picker | Converted from macOS system sounds via afconvert — 44.1kHz mono WAV, 0.6–1.7s each |
| A2 | `[ ]` | Test sound preview in mode editor on real device | Need rebuild to bundle new WAV files into iOS app |
| A3 | `[ ]` | Test rest-end sound + haptic on notification dismiss | Requires real device (notifications don't fire fully in simulator) |

---

## 🔔 Notifications

| # | Status | Task | Notes |
|---|--------|------|-------|
| N1 | `[ ]` | Test notification delivery on real device | Simulator can't deliver background notifications reliably |
| N2 | `[ ]` | Test "Dismiss" action button → opens rest screen | Requires real device with notification fired |
| N3 | `[ ]` | Test "Stop Reminders" action button | Cancels today's schedule |
| N4 | `[ ]` | Add notification icon asset | `app.json` references `./assets/images/notification-icon.png` — file missing |
| N5 | `[ ]` | Verify quiet hours work correctly (active window) | Schedule only fires within activeStart–activeEnd |
| N6 | `[ ]` | Verify day filtering (activeDays) | Only fires on selected days |

---

## 🐛 Known Bugs / UX Issues

| # | Status | Task | Notes |
|---|--------|------|-------|
| B1 | `[ ]` | "Edit Mode" title shows for new mode creation | Fix: set nav title dynamically in `mode/[id].tsx` based on `id === 'new'` |
| B2 | `[ ]` | Dashboard card status doesn't update after enabling | `getStatus()` called once at render; needs store subscription or re-render trigger |
| B3 | `[ ]` | NativeWind dark mode not fully applied | Colours render but dark: variants may need testing on device with dark mode enabled |

---

## 🏗 Build / Infrastructure

| # | Status | Task | Notes |
|---|--------|------|-------|
| I1 | `[ ]` | Add notification icon asset | Create `assets/images/notification-icon.png` (96x96, white on transparent) |
| I2 | `[ ]` | Create EAS project for OTA updates | `eas build --platform ios` for production builds |
| I3 | `[ ]` | Set up `.env` for bundle ID / scheme if needed | Currently hardcoded `com.personal.mymanager` |
| I4 | `[ ]` | Upgrade Node from 22.0.0 → ≥22.13.0 | Metro warns about version mismatch; nvm: `nvm install 22.13` |
| I5 | `[ ]` | Scope down `diagnostics: false` in jest.config.js | Currently silences ALL TypeScript errors in tests — should be scoped |

---

## ✨ Features — Eye Rest Enhancements

| # | Status | Task | Notes |
|---|--------|------|-------|
| E1 | `[ ]` | Add app icon | Generic icon currently used |
| E2 | `[ ]` | Add splash screen with brand colors | `#a2d2ff` background, app name |
| E3 | `[ ]` | Eye Rest history / stats screen | Track rest events, streaks |
| E4 | `[ ]` | Widget support (iOS lock screen / home) | `expo-widgets` — future |
| E5 | `[ ]` | Siri shortcut "Start eye rest" | `expo-shortcuts` — future |
| E6 | `[ ]` | App-active health check system | Periodic notification (e.g. weekly) reminding user to open app and verify Eye Rest is still running. Needed because iOS can silently kill scheduled notifications after app updates, restarts, or notification permission changes. Implementation: schedule a low-priority "Are your reminders still active?" notification 7 days out; reschedule it each time the app opens (AppState active). If user hasn't opened app in 7 days, notification fires. Show in-app banner on launch if `enabled=true` but no notifications are currently scheduled (detect via `expo-notifications` `getAllScheduledNotificationsAsync`). |

---

## 💰 Features — Finance (Next Feature)

| # | Status | Task | Notes |
|---|--------|------|-------|
| F1 | `[ ]` | Design finance feature | Follow same brainstorm → spec → plan → subagent flow |
| F2 | `[ ]` | Add Finance card to dashboard registry | One entry in `lib/features.ts` + new folder `app/(features)/finance/` |

---

## 🌐 Internationalisation (i18n)

| # | Status | Task | Notes |
|---|--------|------|-------|
| L1 | `[ ]` | Choose i18n library | Recommended: `i18next` + `react-i18next` + `expo-localization` for device locale detection |
| L2 | `[ ]` | Extract all hardcoded strings to translation files | Strings live in `locales/en.json` (and `es.json`, etc.); components use `t('key')` hook |
| L3 | `[ ]` | Add language selector in settings (future settings screen) | Or auto-detect from `expo-localization` — `Localization.locale` |
| L4 | `[ ]` | Translate: English (base) | All existing UI strings |
| L5 | `[ ]` | Translate: Spanish | Priority second language |
| L6 | `[ ]` | RTL layout support | `I18nManager.forceRTL` + NativeWind RTL class variants for Arabic/Hebrew future |

---

## 🎨 Material Design

| # | Status | Task | Notes |
|---|--------|------|-------|
| M1 | `[ ]` | Decide scope: full MD3 or MD-inspired on top of current design system | Full MD3 means replacing NativeWind primitives; MD-inspired means adopting MD3 tokens/motion while keeping structure |
| M2 | `[ ]` | Evaluate `react-native-paper` (MD3) vs custom | `react-native-paper` v5 implements MD3 with theming; alternatively port MD3 color roles to current `constants/theme.ts` |
| M3 | `[ ]` | Map current palette to MD3 color roles | MD3 roles: primary, onPrimary, primaryContainer, surface, surfaceVariant, etc. Current `#a2d2ff`/`#b8b8ff` maps cleanly to primary/secondary |
| M4 | `[ ]` | Replace UI primitives with MD3 variants | Button → MD3 FilledButton/TonalButton/TextButton; Card → MD3 ElevatedCard/FilledCard; Badge → MD3 Badge |
| M5 | `[ ]` | Apply MD3 motion (transitions between screens) | `react-native-reanimated` shared element transitions; Expo Router layout animations |
| M6 | `[ ]` | MD3 typography scale | MD3 uses: displayLarge/Medium/Small, headlineLarge, titleLarge, bodyLarge, labelLarge — map to current TYPOGRAPHY constants |

---

## ☁️ Cloud Sync (Future)

| # | Status | Task | Notes |
|---|--------|------|-------|
| C1 | `[ ]` | Choose cloud backend (Supabase / Cloudflare) | Zustand `persist` uses swappable `StorageAdapter` — no store changes needed |
| C2 | `[ ]` | Add `app/(auth)/` screens | Sign-in / sign-up behind auth guard in `_layout.tsx` |
| C3 | `[ ]` | Replace `asyncStorageAdapter` with cloud adapter | Single file swap: `lib/storage.ts` |
| C4 | `[ ]` | Add TanStack Query for server state | Already in stack (`package.json`), not yet used |

---

## ✅ Completed

| # | Date | Task |
|---|------|------|
| D1 | 2026-06-20 | Scaffold Expo SDK 56 app with NativeWind v4, Expo Router, Zustand |
| D2 | 2026-06-20 | Color palette (#a2d2ff/#b8b8ff base, split-complementary warm, blue-gray neutrals) |
| D3 | 2026-06-20 | UI primitives: Text, Button, Card, Badge, TimePicker, DaySelector, SoundPicker |
| D4 | 2026-06-20 | Feature registry pattern (lib/features.ts + FeatureCard) |
| D5 | 2026-06-20 | Eye Rest store (Zustand persist, multi-mode, paused, restDurationSeconds, sound) |
| D6 | 2026-06-20 | Notification service (EYE_REST_ALARM category, DISMISS/STOP_REMINDERS actions, 60-slot merge-sort cap) |
| D7 | 2026-06-20 | Eye Rest main screen (toggle, pause, countdown, AppState refresh, permission flow) |
| D8 | 2026-06-20 | Eye Rest modes list (per-mode Switch toggles, delete guard, FAB) |
| D9 | 2026-06-20 | Eye Rest mode editor (name, interval, rest duration, hours, days, sound picker) |
| D10 | 2026-06-20 | Rest countdown screen (useLayoutEffect timer, auto-end silent, done-early sound+haptic) |
| D11 | 2026-06-20 | 68/68 tests passing |
| D12 | 2026-06-20 | iOS native build working on iPhone 17 Pro simulator |
| D13 | 2026-06-20 | All 3 screens verified manually: dashboard, Eye Rest main, mode editor |
| D14 | 2026-06-20 | expo-av → expo-audio migration (SDK 56 compatibility) |

---

## How to update this doc

Mark items complete: change `[ ]` → `[x]`  
Add new items with next available number in that section.  
Move completed items to the ✅ Completed table at the bottom.
