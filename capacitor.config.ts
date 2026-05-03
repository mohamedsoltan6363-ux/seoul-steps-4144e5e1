import type { CapacitorConfig } from '@capacitor/cli';

/**
 * ⚙️ Seoul Steps — Capacitor configuration
 *
 * 🔌 OFFLINE mode (production APK / IPA):
 *   The `server` block is COMMENTED OUT below. The app is loaded directly
 *   from the bundled `dist/` folder, so it works 100% without internet
 *   (apart from Supabase calls which require network).
 *
 * 🔁 HOT-RELOAD mode (only while developing on a device):
 *   Uncomment the `server` block below to load from the Lovable sandbox.
 *   ⚠️ Comment it back out before producing the final APK / IPA.
 */
const config: CapacitorConfig = {
  appId: 'app.lovable.ee47839bdf784c1196781b934ad0f99b',
  appName: 'Seoul Steps',
  webDir: 'dist',

  // 🔁 Uncomment ONLY for live hot-reload during development:
  // server: {
  //   url: 'https://ee47839b-df78-4c11-9678-1b934ad0f99b.lovableproject.com?forceHideBadge=true',
  //   cleartext: true,
  // },

  android: {
    allowMixedContent: true,
    backgroundColor: '#ec4899',
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#ec4899',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      backgroundColor: '#ec4899',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#ec4899',
    },
  },
};

export default config;
