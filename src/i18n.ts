import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Minimal translation resources (extend as needed)
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
    supportedLngs: ['en','es','fr','de','it','pt','pt-BR','zh-CN','ja','ko','ar','hi','ru'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'app_language'
    }
  });

export default i18n;
