@AGENTS.md

# myManager — Project Guide

## What this is
Personal React Native toolkit app. Starts with Eye Rest Reminder feature. More features added over time (finance next). Modular: each feature is a self-contained folder, registered in one line in `lib/features.ts`.

## Quick start
```bash
npm run dev:ios          # start Metro + relaunch on simulator (~5s)
npm run dev:ios:rebuild  # full native rebuild (after new native packages)
npm test                 # 68 tests
```

## Tech stack
- **Expo SDK 56** — `expo-router/entry` is the main entry (NOT index.ts)
- **Expo Router** — file-based routing, `app/(features)/` for feature screens
- **NativeWind v4** — use `className`, `dark:` prefix for dark mode; never StyleSheet except animated values
- **Zustand + AsyncStorage** — `store/eye-rest.store.ts`; storage adapter in `lib/storage.ts` is swappable for cloud
- **expo-audio** — NOT expo-av (incompatible with SDK 56)
- **expo-haptics** — haptic feedback on rest-end signal

## Key files
| File | Purpose |
|------|---------|
| `lib/features.ts` | Feature registry — add one entry to show feature on dashboard |
| `store/eye-rest.store.ts` | Zustand store; `activeModeIds[]` not a single activeModeId |
| `lib/notifications.ts` | Scheduling — `EYE_REST_ALARM` category, 60-slot merge-sort cap |
| `lib/storage.ts` | Swappable storage adapter |
| `constants/colors.ts` | ALL hex values live here only — never inline |
| `constants/sounds.ts` | 8 sound options; `key` = wav filename without extension |
| `docs/next-steps.md` | Task tracker — check this first to know what's pending |
| `scripts/dev.sh` | Dev runner script |

## Styling rules
1. Raw hex → `constants/colors.ts` only
2. Layout/spacing → NativeWind classes (`px-4`, `gap-3`, etc.)
3. Color → semantic NativeWind classes with `dark:` (`bg-neutral-50 dark:bg-neutral-900`)
4. Header background → set in `_layout.tsx` via `useColorScheme()` + COLORS tokens (NativeWind has no effect on native nav bar)
5. No inline styles except Reanimated animated values

## Known iOS build gotchas
- **After pod install** — header shims auto-recreated by Podfile `post_install` hook; `dev.sh` also re-creates them
- **react-native-worklets** — peer dep of reanimated 4.x, must be installed: `npm install react-native-worklets@0.8.3 --legacy-peer-deps`
- **expo-linking** — must be installed or `ExpoModulesProvider.swift` won't register it
- **package.json main** — must stay `"expo-router/entry"` not `"index.ts"`
- **Full runbook** — `.claude/skills/run-simulator/SKILL.md`

## Design system
- Primary: `#a2d2ff` (brand-300), Secondary: `#b8b8ff` (accent-300)
- Neutrals: blue-gray tinted (`neutral-900` = `#0d1028`)
- Full palette + semantic tokens: `docs/superpowers/specs/2026-06-20-myManager-design.md`
