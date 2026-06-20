#!/usr/bin/env bash
# dev.sh — start myManager on the iPhone 17 Pro simulator
# Usage: npm run dev:ios   OR   ./scripts/dev.sh [--rebuild]
#
#   --rebuild   full native rebuild (needed after: new native packages, pod install)
#   (no flag)   Metro + simulator relaunch only (fast, ~5s)

set -e
cd "$(dirname "$0")/.."

export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
UDID="85165CDD-58D5-4C1D-8E08-0BCD14C52F38"
BUNDLE_ID="com.personal.mymanager"

# ── helpers ────────────────────────────────────────────────────────────────
log()  { echo "▶  $*"; }
ok()   { echo "✓  $*"; }
fail() { echo "✗  $*" >&2; exit 1; }

# ── re-create ObjC header shims (expo-av headers removed from ExpoModulesCore)
recreate_shims() {
  for slice in ios-arm64 ios-arm64_x86_64-simulator; do
    HDR="ios/Pods/ExpoModulesCore/ExpoModulesCore.xcframework/${slice}/ExpoModulesCore.framework/Headers"
    [ -d "$HDR" ] || continue
    printf '#import <Foundation/Foundation.h>\n@protocol EXEventEmitter <NSObject>\n- (NSArray<NSString *> *)supportedEvents;\n- (void)startObserving;\n- (void)stopObserving;\n@end\n' \
      > "${HDR}/EXEventEmitter.h"
    printf '#import <Foundation/Foundation.h>\n@protocol EXEventEmitterService <NSObject>\n- (void)sendEventWithName:(NSString *)eventName body:(id)body;\n@end\n' \
      > "${HDR}/EXEventEmitterService.h"
    printf '#import <Foundation/Foundation.h>\n@protocol EXLegacyExpoViewProtocol <NSObject>\n@optional\n- (void)setModuleRegistry:(id)moduleRegistry;\n@end\n' \
      > "${HDR}/EXLegacyExpoViewProtocol.h"
  done
  ok "Header shims ready"
}

# ── boot simulator if needed ───────────────────────────────────────────────
boot_simulator() {
  STATE=$(xcrun simctl list devices | grep "$UDID" | grep -o '(Booted)\|(Shutdown)' | tr -d '()')
  if [ "$STATE" != "Booted" ]; then
    log "Booting iPhone 17 Pro simulator..."
    xcrun simctl boot "$UDID"
    open -a Simulator
    sleep 4
  fi
  ok "Simulator booted"
}

# ── start Metro if not already running ────────────────────────────────────
start_metro() {
  if curl -s http://localhost:8081/status | grep -q "running"; then
    ok "Metro already running on :8081"
  else
    log "Starting Metro bundler..."
    npx expo start --clear &
    METRO_PID=$!
    echo "$METRO_PID" > /tmp/mymanager_metro.pid
    # wait for Metro to be ready
    for i in $(seq 1 20); do
      sleep 2
      if curl -s http://localhost:8081/status | grep -q "running"; then
        ok "Metro ready (PID $METRO_PID)"
        return
      fi
    done
    fail "Metro didn't start in time — check terminal output"
  fi
}

# ── relaunch app ───────────────────────────────────────────────────────────
relaunch_app() {
  log "Relaunching $BUNDLE_ID..."
  xcrun simctl terminate "$UDID" "$BUNDLE_ID" 2>/dev/null || true
  sleep 1
  xcrun simctl launch "$UDID" "$BUNDLE_ID"
  ok "App launched"
}

# ── full native rebuild ────────────────────────────────────────────────────
full_rebuild() {
  log "Running full native rebuild (this takes ~3-8 min)..."
  recreate_shims
  npx expo run:ios --device "iPhone 17 Pro"
  ok "Rebuild complete"
}

# ── main ───────────────────────────────────────────────────────────────────
echo ""
echo "  myManager dev runner"
echo "  ─────────────────────"

if [ "$1" = "--rebuild" ]; then
  full_rebuild
else
  recreate_shims
  boot_simulator
  start_metro
  sleep 3
  relaunch_app
fi

echo ""
ok "Done. App running on iPhone 17 Pro simulator."
echo ""
