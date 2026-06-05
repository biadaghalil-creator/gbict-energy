import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'nl.gbict.energy',
  appName: 'GBICT Energy',
  webDir: 'out',

  /* ── Live server mode ──────────────────────────────────
     Because the app uses server-side auth and API routes,
     we load directly from the production Vercel deployment.
     The iOS shell is just the native wrapper.
  ─────────────────────────────────────────────────────── */
  server: {
    url: 'https://gbict-energy.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },

  ios: {
    contentInset: 'always',
    scrollEnabled: true,
    backgroundColor: '#07080D',
    preferredContentMode: 'mobile',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#07080D',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#07080D',
    },
  },
}

export default config
