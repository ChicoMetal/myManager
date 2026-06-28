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

# 🚀 New Features

## 🔊 Audio

| # | Status | Task | Notes |
|---|--------|------|-------|
| A1 | `[x]` | Source real WAV files for sound picker | Converted from macOS system sounds via afconvert — 44.1kHz mono WAV |
| A2 | `[ ]` | Test sound preview on real device | Rebuild done; verify ▷ plays audio and volume is audible |
| A3 | `[ ]` | Test rest-end sound + haptic on notification dismiss | Requires real device |

---

## 👁 Eye Rest Enhancements

| # | Status | Task | Notes |
|---|--------|------|-------|
| E1 | `[ ]` | Add app icon | Generic icon currently used |
| E2 | `[ ]` | Add splash screen | `#a2d2ff` background, app name |
| E3 | `[ ]` | Eye Rest history / stats screen | Track rest events, streaks |
| E4 | `[ ]` | App-active health check | Weekly nudge notification + launch banner if `enabled=true` but zero notifications scheduled (`getAllScheduledNotificationsAsync`). iOS silently kills scheduled notifications after app update / device restart. |
| E5 | `[ ]` | Widget (iOS lock screen / home) | `expo-widgets` — future |
| E6 | `[ ]` | Siri shortcut "Start eye rest" | `expo-shortcuts` — future |

---

## 💰 Finance (Next Feature)

| # | Status | Task | Notes |
|---|--------|------|-------|
| F1 | `[ ]` | Design finance feature | Brainstorm → spec → plan → subagent flow |
| F2 | `[ ]` | Add Finance card to dashboard | One entry in `lib/features.ts` + `app/(features)/finance/` |

---

## 🌐 Internationalisation (i18n)

| # | Status | Task | Notes |
|---|--------|------|-------|
| L1 | `[ ]` | Choose i18n library | Recommended: `i18next` + `react-i18next` + `expo-localization` |
| L2 | `[ ]` | Extract hardcoded strings to `locales/en.json` | Components use `t('key')` hook |
| L3 | `[ ]` | Translate: English (base) + Spanish | Priority languages |
| L4 | `[ ]` | RTL layout support | `I18nManager.forceRTL` + NativeWind RTL variants |

---

## 🎨 Material Design 3

| # | Status | Task | Notes |
|---|--------|------|-------|
| M1 | `[ ]` | Decide scope: full MD3 vs MD-inspired | Full MD3 = replace NativeWind primitives with `react-native-paper`; inspired = adopt MD3 color roles into current `constants/theme.ts` |
| M2 | `[ ]` | Map current palette to MD3 color roles | `#a2d2ff`/`#b8b8ff` maps cleanly to primary/secondary |
| M3 | `[ ]` | Replace UI primitives with MD3 variants | Button → FilledButton/TonalButton/TextButton; Card → ElevatedCard |
| M4 | `[ ]` | Apply MD3 motion | Reanimated shared element transitions; Expo Router layout animations |
| M5 | `[ ]` | MD3 typography scale | displayLarge → labelLarge — map to current TYPOGRAPHY constants |

---

## ☁️ Cloud Sync

| # | Status | Task | Notes |
|---|--------|------|-------|
| C1 | `[ ]` | Choose backend (Supabase / Cloudflare) | `StorageAdapter` in `lib/storage.ts` is a single-file swap — no store changes |
| C2 | `[ ]` | Add `app/(auth)/` screens | Sign-in/up behind auth guard in `_layout.tsx` |
| C3 | `[ ]` | Replace `asyncStorageAdapter` with cloud adapter | `lib/storage.ts` only |
| C4 | `[ ]` | Wire TanStack Query for server state | Already in `package.json`, not yet used |

---

---

# 🏗 Architecture / Tech Debt

## 🐛 Known Bugs

| # | Status | Task | Notes |
|---|--------|------|-------|
| B1 | `[ ]` | "Edit Mode" title for new mode | Dynamically set nav title in `mode/[id].tsx` based on `id === 'new'` |
| B2 | `[ ]` | Dashboard card status stale after toggle | `getStatus()` called once at render; needs `useEyeRestStore` selector subscription |
| B3 | `[ ]` | Dark mode on real device full verification | Simulator auto-switches; need manual test on physical device |
| B5 | `[ ]` | Eye Rest dashboard label shows "Off" when disabled — should show "On"/"Off" based on `enabled` state | Feature registry `getStatus()` in `lib/features.ts` / store `getStatusLine()` needs to reflect enabled toggle |
| B6 | `[ ]` | Pause button visible for out-of-schedule modes | Mode cards in `app/(features)/eye-rest/index.tsx` — hide pause button when mode is outside active time/day range (already shows Moon icon + "Resumes …" label, but pause btn still appears) |
| B7 | `[x]` | Out-of-range mode still shows countdown on real device | Verified on physical iPhone: when current time is outside mode's active window, card should show "Resumes [next valid time]" (Moon state) but instead keeps showing countdown ticking toward the next valid fire time — likely `getNextFireTimes()` returning a future in-range time and the card falling into `isToday` branch incorrectly |
| B8 | `[ ]` | "Rest over" notification label too specific — rename to "Alert over" or mode-based label | `lib/notifications.ts` rest-over notification title/body hardcoded to "rest" language; should be generic ("Task over", "Time's up") to support future non-eye-rest alert types |
| B9 | `[ ]` | Mode editor only supports preset interval values — add free-form cycle duration input | `app/(features)/eye-rest/mode/[id].tsx` — replace fixed picker with a numeric input (or picker + custom option) so users can enter any interval in minutes for the alert period |
| B4 | `[x]` | Rest duration shows 20s even when mode configured to 10s | Fixed: `lib/notifications.ts:103` — notification body now interpolates `mode.restDurationSeconds` instead of hardcoded "20 seconds" |

---

## 🔔 Notifications Verification

| # | Status | Task | Notes |
|---|--------|------|-------|
| N1 | `[ ]` | Test delivery on real device | Simulator background notifications unreliable |
| N2 | `[ ]` | Test "Dismiss" → opens rest screen | Real device only |
| N3 | `[ ]` | Test "Stop Reminders" → cancels schedule | Real device only |
| N4 | `[ ]` | Add notification icon asset | `assets/images/notification-icon.png` (96×96, white on transparent) |
| N5 | `[ ]` | Verify quiet hours (activeStart–activeEnd) | Manual test |
| N6 | `[ ]` | Verify day filtering (activeDays) | Manual test |

---

## ⚙️ Build / Infrastructure

| # | Status | Task | Notes |
|---|--------|------|-------|
| I1 | `[ ]` | Upgrade Node 22.0.0 → ≥22.13.0 | Metro warns on version mismatch; `nvm install 22.13` |
| I2 | `[ ]` | Create EAS project for OTA + production builds | `eas build --platform ios` |
| I3 | `[ ]` | ios/ rebuild idempotency | When ios/ is deleted (fresh machine / CI), the full rebuild hits: worklets peer dep, expo-linking autolink, header shims, blank screen (wrong main). Document as a one-shot setup script or add to dev.sh |

---

## 🧪 Test Suite Health

| # | Status | Task | Notes |
|---|--------|------|-------|
| T1 | `[ ]` | Scope `diagnostics: false` in jest.config.js | Currently silences ALL TypeScript errors in tests — should be narrowed to only the affected test file |
| T2 | `[ ]` | Add comments to brittle RNTL v14 test workarounds | `__mocks__/@testing-library/react-native.js` and `useLayoutEffect` in rest.tsx exist due to React 19 + RNTL v14 `actScopeDepth` bug — undocumented, causes confusion |
| T3 | `[ ]` | Remove unused test deps | `react-test-renderer` and `test-renderer` installed but never imported |

---

## 📐 Architecture Docs

| # | Status | Task | Notes |
|---|--------|------|-------|
| X1 | `[ ]` | Write `docs/architecture.md` | Feature-registry pattern, store design, notification scheduling flow, storage adapter swap path — saves 10 min of file archaeology every new session |
| X2 | `[ ]` | Document ios/ rebuild from scratch | One-shot shell script or checklist for fresh machine / CI: exact order of: worklets install → prebuild → pod install → shim recreation → build |

---

## ✅ Completed

| # | Date | Task |
|---|------|------|
| D1 | 2026-06-20 | Scaffold Expo SDK 56 + NativeWind v4 + Expo Router + Zustand |
| D2 | 2026-06-20 | Color palette (#a2d2ff/#b8b8ff base, split-complementary, blue-gray neutrals) |
| D3 | 2026-06-20 | UI primitives: Text, Button, Card, Badge, TimePicker, DaySelector, SoundPicker |
| D4 | 2026-06-20 | Feature registry pattern (lib/features.ts + FeatureCard + dashboard) |
| D5 | 2026-06-20 | Eye Rest store (Zustand persist, multi-mode, paused, restDurationSeconds, sound) |
| D6 | 2026-06-20 | Notification service (EYE_REST_ALARM category, 60-slot merge-sort cap) |
| D7 | 2026-06-20 | Eye Rest main screen (toggle, pause, countdown, AppState refresh, permission flow) |
| D8 | 2026-06-20 | Eye Rest modes list (per-mode Switch toggles, delete guard, FAB) |
| D9 | 2026-06-20 | Eye Rest mode editor (name, interval, rest duration, hours, days, sound picker) |
| D10 | 2026-06-20 | Rest countdown screen (auto-end silent, done-early sound+haptic) |
| D11 | 2026-06-20 | 68/68 tests passing |
| D12 | 2026-06-20 | iOS native build on iPhone 17 Pro simulator |
| D13 | 2026-06-20 | expo-av → expo-audio migration (SDK 56 compat) |
| D14 | 2026-06-20 | Sound files (8 options from macOS system sounds, afconvert 44.1kHz mono WAV) |
| D15 | 2026-06-20 | dev.sh quick-start script (npm run dev:ios) |
| D16 | 2026-06-20 | CLAUDE.md project guide + memory files |
| D17 | 2026-06-21 | Fix notification body hardcoded "20s" → dynamic `mode.restDurationSeconds` |

---

## How to update
`[ ]` → `[x]` when done. Move to ✅ table. New items get next number in their section.
