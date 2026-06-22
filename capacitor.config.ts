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
    // De app laadt het design-prototype (public/app/ — exact het door de
    // gebruiker aangeleverde bestand, niet nagebouwd).
    url: 'https://gbict-energy.vercel.app/app/',
    cleartext: false,
    androidScheme: 'https',
  },

  ios: {
    // Edge-to-edge: we handle the notch / home-indicator insets ourselves in
    // CSS (safe-area-inset). 'always' added its own insets and caused black
    // strips and a shifting bottom bar on scroll.
    contentInset: 'never',
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
      style: 'light',
      backgroundColor: '#07080D',
    },
  },
}

export default config
