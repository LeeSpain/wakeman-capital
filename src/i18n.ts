import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Expanded translation resources
const resources = {
  en: {
    translation: {
      common: {
        signIn: 'Sign in',
        signOut: 'Sign out',
        goToDashboard: 'Go to Dashboard',
        settings: 'Settings',
        language: 'Language',
        region: 'Region',
        currency: 'Currency',
        save: 'Save',
        continue: 'Continue'
      },
      nav: {
        home: 'Home',
        dashboard: 'Dashboard',
        analytics: 'Analytics',
        paperTrading: 'Paper Trading',
        aiCoach: 'AI Coach',
        signals: 'Signals',
        journal: 'Trade Journal',
        trends: 'Trends',
        settings: 'Settings',
        billing: 'Billing',
        admin: 'Admin'
      },
      modal: {
        title: 'Choose your preferences',
        intro: 'Select your language, region and currency to personalize your experience.'
      },
      home: {
        seoTitle: 'Wakeman Capital — AI Market Intelligence',
        seoDescription: 'AI-powered market intelligence, trend analysis, and actionable insights for traders and investors.',
        hero: {
          title: 'Wakeman Capital — AI Market Intelligence',
          subtitle: 'Transform market noise into clear, SMC-aligned insights. Real-time narrative tracking across social and news, distilled into actionable context.',
          mockupAlt: 'Product mockup: trading dashboard overview',
          mockupCaption: "Preview of the app you'll access",
          points: {
            realtime: 'Real-time Signals',
            smc: 'SMC entries + clear invalidation',
            risk: 'Risk tools & journaling'
          }
        },
        stats: {
          realtime: 'Real-time Signals',
          coverage: 'Asset Coverage',
          latency: 'Avg. Latency'
        },
        sales: {
          title: 'Turn Market Intelligence Into Profit',
          subtitle: 'Join traders who pay a low monthly fee plus share profits when they win. Our AI-powered insights deliver SMC-aligned opportunities with transparent pricing.'
        },
        values: {
          precisionEntries: 'Precision Entries',
          precisionDesc: 'SMC-aligned signals with clear invalidation levels and profit targets',
          realTimeIntelligence: 'Real-Time Intelligence',
          intelligenceDesc: '10,000+ daily signals processed in ~1.2s latency across all major markets',
          transparentPricing: 'Transparent Pricing',
          pricingDesc: '$29.99/month + 10% profit share. Pay to access, share when you win'
        },
        social: {
          signalAccuracy: 'Signal Accuracy',
          profitsTracked: 'Profits Tracked',
          activeTraders: 'Active Traders'
        },
        aligned: {
          title: 'Aligned Success Model',
          subtitle: '$29.99/month gives you access to all features. We only take 10% when you make profits—complete alignment with your success.',
          badge: '✓ Affordable monthly access + profit sharing when you win'
        },
        cta: {
          joinNow: 'Join Wakeman Capital Now',
          alreadyMember: 'Already a member?',
          signInHere: 'Sign in here'
        },
        insights: {
          title: 'Wakeman Capital Insights'
        }
      },
      analytics: {
        seoTitle: 'Market Analytics | Trend Pulse',
        seoDescription: 'Advanced market sentiment analysis and trend detection powered by AI algorithms for better trading decisions.',
        pageTitle: 'Market Analytics',
        pageSubtitle: 'AI-powered sentiment analysis and trend detection'
      },
      dashboard: {
        seoTitle: 'Dashboard | Wakeman Capital',
        seoDescription: 'Live trading dashboard with trades, signals, and market trends.',
        welcome: 'Welcome back',
        activeSignals: 'Active signals',
        openTrades: 'Open trades',
        trackedPairs: 'Tracked pairs',
        asOf: 'As of',
        quickTopUp: 'Quick top-up',
        title: 'Dashboard',
        addFunds: 'Add Funds',
        trendsSnapshot: 'Trends Snapshot'
      },
      trend: {
        marketSentiment: 'Market Sentiment Analysis',
        loading: 'Loading market sentiment...',
        noData: 'No trend analysis data available yet.',
        bullish: 'bullish',
        bearish: 'bearish',
        neutral: 'neutral'
      },
      footer: {
        company: 'Wakeman Capital',
        tagline: 'AI-driven market intelligence for modern traders.',
        product: 'Product',
        companySection: 'Company',
        features: 'Features',
        pricing: 'Pricing',
        signalCenter: 'Signal Center',
        aiCoach: 'AI Coach',
        home: 'Home',
        dashboard: 'Dashboard',
        rights: 'All rights reserved.'
      },
      auth: {
        signInTitle: 'Sign in to manage your settings',
        signInDesc: "We'll email you a secure link to sign in.",
        checkInbox: 'Check your inbox for the sign-in link.',
        emailPlaceholder: 'you@example.com',
        sending: 'Sending…',
        sendLink: 'Send link'
      }
    }
  },
  es: {
    translation: {
      common: {
        signIn: 'Iniciar sesión',
        signOut: 'Cerrar sesión',
        goToDashboard: 'Ir al Panel',
        settings: 'Configuración',
        language: 'Idioma',
        region: 'Región',
        currency: 'Moneda',
        save: 'Guardar',
        continue: 'Continuar'
      },
      nav: {
        home: 'Inicio',
        dashboard: 'Panel',
        analytics: 'Analítica',
        paperTrading: 'Simulación',
        aiCoach: 'AI Coach',
        signals: 'Señales',
        journal: 'Diario de Operaciones',
        trends: 'Tendencias',
        settings: 'Configuración',
        billing: 'Facturación',
        admin: 'Admin'
      },
      modal: {
        title: 'Elige tus preferencias',
        intro: 'Selecciona tu idioma, región y moneda para personalizar tu experiencia.'
      },
      home: {
        seoTitle: 'Wakeman Capital — Inteligencia de Mercado con IA',
        seoDescription: 'Inteligencia de mercado impulsada por IA, análisis de tendencias y conocimientos accionables para traders e inversores.',
        hero: {
          title: 'Wakeman Capital — Inteligencia de Mercado con IA',
          subtitle: 'Convierte el ruido del mercado en ideas claras alineadas con SMC. Seguimiento en tiempo real de narrativas en redes y noticias, destiladas en contexto accionable.',
          mockupAlt: 'Mockup del producto: panel de trading',
          mockupCaption: 'Vista previa de la aplicación a la que tendrás acceso',
          points: {
            realtime: 'Señales en tiempo real',
            smc: 'Entradas SMC + invalidación clara',
            risk: 'Herramientas de riesgo y diario'
          }
        },
        stats: {
          realtime: 'Señales en tiempo real',
          coverage: 'Cobertura de Activos',
          latency: 'Latencia Promedio'
        },
        sales: {
          title: 'Convierte la Inteligencia de Mercado en Beneficio',
          subtitle: 'Únete a traders que pagan una tarifa mensual baja y comparten beneficios cuando ganan. Nuestras ideas con IA ofrecen oportunidades alineadas con SMC con precios transparentes.'
        },
        values: {
          precisionEntries: 'Entradas de Precisión',
          precisionDesc: 'Señales alineadas con SMC con niveles claros de invalidación y objetivos de beneficio',
          realTimeIntelligence: 'Inteligencia en Tiempo Real',
          intelligenceDesc: 'Más de 10.000 señales diarias procesadas en ~1,2s de latencia en los principales mercados',
          transparentPricing: 'Precios Transparentes',
          pricingDesc: '$29,99/mes + 10% de reparto de beneficios. Pagas por acceso y compartes cuando ganas'
        },
        social: {
          signalAccuracy: 'Precisión de Señales',
          profitsTracked: 'Beneficios Rastreados',
          activeTraders: 'Traders Activos'
        },
        aligned: {
          title: 'Modelo de Éxito Alineado',
          subtitle: '$29,99/mes te da acceso a todas las funciones. Solo cobramos 10% cuando obtienes beneficios—total alineación con tu éxito.',
          badge: '✓ Acceso mensual asequible + reparto de beneficios cuando ganas'
        },
        cta: {
          joinNow: 'Únete a Wakeman Capital Ahora',
          alreadyMember: '¿Ya tienes cuenta?',
          signInHere: 'Inicia sesión aquí'
        },
        insights: {
          title: 'Ideas de Wakeman Capital'
        }
      },
      analytics: {
        seoTitle: 'Analítica de Mercado | Trend Pulse',
        seoDescription: 'Análisis avanzado de sentimiento y detección de tendencias con IA para mejores decisiones de trading.',
        pageTitle: 'Analítica de Mercado',
        pageSubtitle: 'Análisis de sentimiento y detección de tendencias con IA'
      },
      dashboard: {
        seoTitle: 'Panel | Wakeman Capital',
        seoDescription: 'Panel de trading en vivo con operaciones, señales y tendencias del mercado.',
        welcome: 'Bienvenido de nuevo',
        activeSignals: 'Señales activas',
        openTrades: 'Operaciones abiertas',
        trackedPairs: 'Pares rastreados',
        asOf: 'A fecha de',
        quickTopUp: 'Recarga rápida',
        title: 'Panel',
        addFunds: 'Agregar fondos',
        trendsSnapshot: 'Resumen de tendencias'
      },
      trend: {
        marketSentiment: 'Análisis de Sentimiento del Mercado',
        loading: 'Cargando sentimiento del mercado...',
        noData: 'No hay datos de análisis de tendencias disponibles aún.',
        bullish: 'alcista',
        bearish: 'bajista',
        neutral: 'neutral'
      },
      footer: {
        company: 'Wakeman Capital',
        tagline: 'Inteligencia de mercado con IA para traders modernos.',
        product: 'Producto',
        companySection: 'Compañía',
        features: 'Características',
        pricing: 'Precios',
        signalCenter: 'Centro de Señales',
        aiCoach: 'AI Coach',
        home: 'Inicio',
        dashboard: 'Panel',
        rights: 'Todos los derechos reservados.'
      },
      auth: {
        signInTitle: 'Inicia sesión para gestionar tu configuración',
        signInDesc: 'Te enviaremos un enlace seguro para iniciar sesión.',
        checkInbox: 'Revisa tu bandeja de entrada para el enlace de acceso.',
        emailPlaceholder: 'tu@ejemplo.com',
        sending: 'Enviando…',
        sendLink: 'Enviar enlace'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en','nl','es','ar','zh-CN'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'app_language'
    }
  });

// Keep the <html lang> in sync with the active language
if (typeof document !== 'undefined') {
  const apply = (lng: string) => {
    document.documentElement.lang = lng;
    document.documentElement.dir = i18n.dir(lng);
  };
  apply(i18n.language || 'en');
  i18n.on('languageChanged', apply);
}

export default i18n;
