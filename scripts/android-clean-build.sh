#!/usr/bin/env bash
# ============================================================
# 🧹 Seoul Steps — Android clean & rebuild script
# ============================================================
# Usage (from project root, after `npm install`):
#   bash scripts/android-clean-build.sh
#
# This script:
#   1. Builds the web app (Vite -> dist/)
#   2. Syncs Capacitor (copies dist/ into android/)
#   3. Cleans gradle caches + build folders
#   4. Builds a release APK and a release AAB
# Output:
#   android/app/build/outputs/apk/release/app-release-unsigned.apk
#   android/app/build/outputs/bundle/release/app-release.aab
# ============================================================
set -e

echo "▶ 1/5  Building web bundle…"
npm run build

echo "▶ 2/5  Syncing Capacitor…"
npx cap sync android

if [ ! -d "android" ]; then
  echo "✗ android/ folder not found. Run: npx cap add android"
  exit 1
fi

cd android

echo "▶ 3/5  Cleaning gradle caches & previous builds…"
./gradlew clean || true
rm -rf .gradle build app/build

# Remove stale local caches that often cause AGP errors
rm -rf "$HOME/.gradle/caches/transforms-3" 2>/dev/null || true
rm -rf "$HOME/.gradle/caches/build-cache-1" 2>/dev/null || true

echo "▶ 4/5  Building release APK…"
./gradlew assembleRelease --no-daemon --warning-mode=all

echo "▶ 5/5  Building release AAB (Play Store)…"
./gradlew bundleRelease --no-daemon --warning-mode=all

cd ..

echo ""
echo "✅  Done."
echo "   APK : android/app/build/outputs/apk/release/app-release-unsigned.apk"
echo "   AAB : android/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "ℹ  Sign the APK with your keystore using apksigner before installing on real devices."
