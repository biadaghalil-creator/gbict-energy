export type Locale = 'en' | 'nl' | 'de' | 'fr' | 'es'
export const LOCALES: Locale[] = ['en', 'nl', 'de', 'fr', 'es']
export const DEFAULT_LOCALE: Locale = 'en'

export type TranslationDict = {
  // Navigation
  nav: {
    howItWorks: string
    benefits: string
    pricing: string
    login: string
    signup: string
    dashboard: string
    connections: string
    savings: string
    activity: string
    friends: string
    vpp: string
    settings: string
    logout: string
  }
  // Landing page
  landing: {
    badge: string
    heroTitle: string
    heroTitleHighlight: string
    heroSubtitle: string
    ctaPrimary: string
    ctaSecondary: string
    statsUsers: string
    statsSaved: string
    statsDevices: string
    howItWorksTitle: string
    step1Title: string
    step1Desc: string
    step2Title: string
    step2Desc: string
    step3Title: string
    step3Desc: string
  }
  // Pricing page
  pricing: {
    title: string
    subtitle: string
    trialBadge: string
    perMonth: string
    proName: string
    proDesc: string
    businessName: string
    businessDesc: string
    enterpriseName: string
    enterpriseDesc: string
    priceCustom: string
    ctaTrial: string
    ctaContact: string
    trialNote: string
    faqTitle: string
    vatNote: string
    enterpriseTitle: string
    enterpriseSubtitle: string
  }
  // Auth
  auth: {
    loginTitle: string
    loginSubtitle: string
    signupTitle: string
    signupSubtitle: string
    emailLabel: string
    passwordLabel: string
    loginBtn: string
    signupBtn: string
    noAccount: string
    hasAccount: string
  }
  // Common
  common: {
    free14days: string
    noCard: string
    cancel: string
    submit: string
    loading: string
    copied: string
    perMonth: string
    learnMore: string
  }
}
