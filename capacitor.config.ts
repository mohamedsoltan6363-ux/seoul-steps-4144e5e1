import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ee47839bdf784c1196781b934ad0f99b',
  appName: 'Seoul Steps',
  webDir: 'dist',
  server: {
    // Hot-reload from Lovable sandbox during development.
    // Comment out / remove the `url` line before producing a final offline APK.
    url: 'https://ee47839b-df78-4c11-9678-1b934ad0f99b.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
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
