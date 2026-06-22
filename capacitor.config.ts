import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'nl.gbict.energy',
  appName: 'GBICT Energy',
  webDir: 'out',

  // Marks the webview so the web app reliably knows it runs inside the app
  // (server- and client-side), independent of the Capacitor bridge timing.
  appendUserAgent: 'GBICTEnergyApp',

  /* ── Live server mode ──────────────────────────────────
     Because the app uses server-side auth and API routes,
     we load directly from the production Vercel deployment.
     The iOS shell is just the native wrapper.
  ─────────────────────────────────────────────────────── */
  server: {
    // Laad direct /login (geen 307-redirect → geen zwart tussenscherm).
    // Niet-ingelogd -> login, ingelogd -> dashboard. Echte Supabase-auth.
    url: 'https://gbict-energy.vercel.app/login',
    cleartext: false,
    androidScheme: 'https',
  },

  ios: {
    contentInset: 'never',
    scrollEnabled: true,
    // Warm cream achtergrond (matcht het design) — geen zwarte flits meer.
    backgroundColor: '#F3EEE3',
    preferredContentMode: 'mobile',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#F3EEE3',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#F3EEE3',
    },
  },
}

export default config
