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
        sendLink: 'Send link',
        paymentSeoTitle: 'Complete Your Subscription — Wakeman Capital',
        paymentSeoDescription: 'Complete your monthly subscription to access professional trading insights and earn 10% profit share.',
        seoTitleLogin: 'Welcome Back — AI Market Intelligence',
        seoTitleSignup: 'Join Wakeman Capital — AI Market Intelligence',
        seoDescription: 'Access your Wakeman Capital account or join thousands of traders using AI-powered market intelligence.'
      },
      layout: {
        main: 'Main',
        account: 'Account',
        toggleSidebar: 'Toggle sidebar'
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
        sendLink: 'Enviar enlace',
        paymentSeoTitle: 'Completa tu suscripción — Wakeman Capital',
        paymentSeoDescription: 'Completa tu suscripción mensual para acceder a información profesional de trading y ganar 10% de reparto de beneficios.',
        seoTitleLogin: 'Bienvenido de nuevo — Inteligencia de Mercado IA',
        seoTitleSignup: 'Únete a Wakeman Capital — Inteligencia de Mercado IA',
        seoDescription: 'Accede a tu cuenta de Wakeman Capital o únete a miles de traders que usan inteligencia de mercado impulsada por IA.'
      },
      layout: {
        main: 'Principal',
        account: 'Cuenta',
        toggleSidebar: 'Alternar barra lateral'
      }
    }
  }
  ,
  nl: {
    translation: {
      common: {
        signIn: 'Inloggen',
        signOut: 'Uitloggen',
        goToDashboard: 'Naar dashboard',
        settings: 'Instellingen',
        language: 'Taal',
        region: 'Regio',
        currency: 'Valuta',
        save: 'Opslaan',
        continue: 'Doorgaan'
      },
      nav: {
        home: 'Home',
        dashboard: 'Dashboard',
        analytics: 'Analytics',
        paperTrading: 'Paper Trading',
        aiCoach: 'AI Coach',
        signals: 'Signalen',
        journal: 'Handelsdagboek',
        trends: 'Trends',
        settings: 'Instellingen',
        billing: 'Facturatie',
        admin: 'Admin'
      },
      modal: {
        title: 'Kies je voorkeuren',
        intro: 'Selecteer je taal, regio en valuta voor een gepersonaliseerde ervaring.'
      },
      home: {
        seoTitle: 'Wakeman Capital — AI Marktinformatie',
        seoDescription: 'AI-gestuurde marktanalyse, trenddetectie en actiegerichte inzichten voor traders en beleggers.',
        hero: {
          title: 'Wakeman Capital — AI Marktinformatie',
          subtitle: 'Zet marktruis om in heldere, SMC-uitgelijnde inzichten. Real-time narratiefvolgen over social en nieuws, samengevat tot bruikbare context.',
          mockupAlt: 'Productmockup: handelsdashboard',
          mockupCaption: 'Voorbeeld van de app die je krijgt',
          points: { realtime: 'Realtime signalen', smc: 'SMC entries + duidelijke invalidatie', risk: 'Risicotools & journaal' }
        },
        stats: { realtime: 'Realtime signalen', coverage: 'Assetdekking', latency: 'Gem. latentie' },
        sales: { title: 'Zet Marktinformatie om in Winst', subtitle: 'Sluit je aan bij traders die een lage maandprijs betalen en winstdelen wanneer ze winnen. Onze AI-inzichten leveren SMC-uitgelijnde kansen met transparante prijzen.' },
        values: {
          precisionEntries: 'Precieze instappen',
          precisionDesc: 'SMC-uitgelijnde signalen met duidelijke invalidatie en doelen',
          realTimeIntelligence: 'Real-time intelligentie',
          intelligenceDesc: '10.000+ signalen per dag verwerkt met ~1,2s latentie',
          transparentPricing: 'Transparante prijzen',
          pricingDesc: '$29,99/maand + 10% winstdeling'
        },
        social: { signalAccuracy: 'Signaalnauwkeurigheid', profitsTracked: 'Bijgehouden winsten', activeTraders: 'Actieve traders' },
        aligned: { title: 'Uitgelijnd succesmodel', subtitle: '$29,99/maand geeft toegang tot alles. We nemen alleen 10% wanneer je winst maakt—volledig uitgelijnd met jouw succes.', badge: '✓ Betaalbare toegang + winstdeling bij winst' },
        cta: { joinNow: 'Word lid van Wakeman Capital', alreadyMember: 'Al lid?', signInHere: 'Log hier in' },
        insights: { title: 'Wakeman Capital Insights' }
      },
      analytics: {
        seoTitle: 'Marktanalyse | Trend Pulse',
        seoDescription: 'Geavanceerde sentimentsanalyse en trenddetectie met AI voor betere handelsbeslissingen.',
        pageTitle: 'Marktanalyse',
        pageSubtitle: 'AI-gestuurde sentiment- en trendanalyse'
      },
      dashboard: {
        seoTitle: 'Dashboard | Wakeman Capital',
        seoDescription: 'Live handelsdashboard met trades, signalen en markttrends.',
        welcome: 'Welkom terug',
        activeSignals: 'Actieve signalen',
        openTrades: 'Openstaande trades',
        trackedPairs: 'Gemonitorde paren',
        asOf: 'Per',
        quickTopUp: 'Snel opwaarderen',
        title: 'Dashboard',
        addFunds: 'Geld toevoegen',
        trendsSnapshot: 'Trendoverzicht'
      },
      trend: { marketSentiment: 'Marktsentimentanalyse', loading: 'Marktsentiment laden...', noData: 'Nog geen trendgegevens beschikbaar.', bullish: 'bullish', bearish: 'bearish', neutral: 'neutraal' },
      footer: { company: 'Wakeman Capital', tagline: 'AI-gedreven marktinformatie voor moderne traders.', product: 'Product', companySection: 'Bedrijf', features: 'Functies', pricing: 'Prijzen', signalCenter: 'Signaalcentrum', aiCoach: 'AI Coach', home: 'Home', dashboard: 'Dashboard', rights: 'Alle rechten voorbehouden.' },
      auth: {
        signInTitle: 'Log in om je instellingen te beheren',
        signInDesc: 'We e-mailen je een beveiligde link om in te loggen.',
        checkInbox: 'Controleer je inbox voor de inloglink.',
        emailPlaceholder: 'jij@voorbeeld.com',
        sending: 'Verzenden…',
        sendLink: 'Link sturen',
        paymentSeoTitle: 'Voltooi je abonnement — Wakeman Capital',
        paymentSeoDescription: 'Voltooi je maandabonnement om toegang te krijgen tot professionele handelsinzichten en 10% winstdeling te verdienen.',
        seoTitleLogin: 'Welkom terug — AI Marktinformatie',
        seoTitleSignup: 'Word lid van Wakeman Capital — AI Marktinformatie',
        seoDescription: 'Log in op je Wakeman Capital-account of sluit je aan bij duizenden traders die AI-gestuurde marktinformatie gebruiken.'
      },
      layout: { main: 'Hoofd', account: 'Account', toggleSidebar: 'Zijbalk wisselen' }
    }
  },
  ar: {
    translation: {
      common: {
        signIn: 'تسجيل الدخول',
        signOut: 'تسجيل الخروج',
        goToDashboard: 'اذهب إلى لوحة التحكم',
        settings: 'الإعدادات',
        language: 'اللغة',
        region: 'المنطقة',
        currency: 'العملة',
        save: 'حفظ',
        continue: 'متابعة'
      },
      nav: {
        home: 'الرئيسية',
        dashboard: 'لوحة التحكم',
        analytics: 'التحليلات',
        paperTrading: 'تداول تجريبي',
        aiCoach: 'مدرب الذكاء الاصطناعي',
        signals: 'الإشارات',
        journal: 'سجل التداول',
        trends: 'الاتجاهات',
        settings: 'الإعدادات',
        billing: 'الفوترة',
        admin: 'المدير'
      },
      modal: { title: 'اختر تفضيلاتك', intro: 'حدد اللغة والمنطقة والعملة لتخصيص تجربتك.' },
      home: {
        seoTitle: 'واكمان كابيتال — ذكاء السوق بالذكاء الاصطناعي',
        seoDescription: 'تحليل سوق مدعوم بالذكاء الاصطناعي، واكتشاف الاتجاهات، ورؤى عملية للمتداولين والمستثمرين.',
        hero: {
          title: 'واكمان كابيتال — ذكاء السوق بالذكاء الاصطناعي',
          subtitle: 'حوّل ضجيج السوق إلى رؤى واضحة متوافقة مع SMC. تتبع فوري للسرد عبر الشبكات والأخبار في سياق عملي.',
          mockupAlt: 'صورة للمنتج: لوحة تداول',
          mockupCaption: 'معاينة للتطبيق الذي ستحصل عليه',
          points: { realtime: 'إشارات فورية', smc: 'مداخل SMC + إبطال واضح', risk: 'أدوات المخاطر والمذكرات' }
        },
        stats: { realtime: 'إشارات فورية', coverage: 'تغطية الأصول', latency: 'متوسط التأخير' },
        sales: { title: 'حوّل ذكاء السوق إلى ربح', subtitle: 'انضم إلى متداولين يدفعون رسوماً شهرية منخفضة ويشاركون الأرباح عند تحقيقها. تقدم رؤانا بالذكاء الاصطناعي فرصاً متوافقة مع SMC بأسعار شفافة.' },
        values: {
          precisionEntries: 'مداخل دقيقة',
          precisionDesc: 'إشارات متوافقة مع SMC مع مستويات إبطال وأهداف ربح واضحة',
          realTimeIntelligence: 'ذكاء فوري',
          intelligenceDesc: 'أكثر من 10,000 إشارة يومياً بزمن تأخير ~1.2 ثانية',
          transparentPricing: 'تسعير شفاف',
          pricingDesc: '$29.99/شهر + 10% مشاركة أرباح'
        },
        social: { signalAccuracy: 'دقة الإشارات', profitsTracked: 'الأرباح المتعقبة', activeTraders: 'المتداولون النشطون' },
        aligned: { title: 'نموذج نجاح متوافق', subtitle: '$29.99/شهرياً يمنحك الوصول إلى كل الميزات. نأخذ 10% فقط عندما تربح — توافق كامل مع نجاحك.', badge: '✓ اشتراك شهري منخفض + مشاركة أرباح عند الربح' },
        cta: { joinNow: 'انضم إلى واكمان كابيتال الآن', alreadyMember: 'هل أنت عضو بالفعل؟', signInHere: 'سجّل الدخول هنا' },
        insights: { title: 'رؤى واكمان كابيتال' }
      },
      analytics: { seoTitle: 'تحليلات السوق | ترند بالس', seoDescription: 'تحليل متقدم لمعنويات السوق واكتشاف الاتجاهات بالذكاء الاصطناعي لاتخاذ قرارات تداول أفضل.', pageTitle: 'تحليلات السوق', pageSubtitle: 'تحليل معنويات واتجاهات مدعوم بالذكاء الاصطناعي' },
      dashboard: { seoTitle: 'لوحة التحكم | واكمان كابيتال', seoDescription: 'لوحة تداول مباشرة بالصفقات والإشارات واتجاهات السوق.', welcome: 'مرحباً بعودتك', activeSignals: 'الإشارات النشطة', openTrades: 'الصفقات المفتوحة', trackedPairs: 'الأزواج المتابعة', asOf: 'اعتباراً من', quickTopUp: 'شحن سريع', title: 'لوحة التحكم', addFunds: 'إضافة أموال', trendsSnapshot: 'لمحة عن الاتجاهات' },
      trend: { marketSentiment: 'تحليل معنويات السوق', loading: 'جاري تحميل معنويات السوق...', noData: 'لا توجد بيانات تحليل للاتجاهات بعد.', bullish: 'صاعد', bearish: 'هابط', neutral: 'محايد' },
      footer: { company: 'واكمان كابيتال', tagline: 'ذكاء سوق مدفوع بالذكاء الاصطناعي للمتداولين المعاصرين.', product: 'المنتج', companySection: 'الشركة', features: 'الميزات', pricing: 'الأسعار', signalCenter: 'مركز الإشارات', aiCoach: 'مدرب الذكاء الاصطناعي', home: 'الرئيسية', dashboard: 'لوحة التحكم', rights: 'جميع الحقوق محفوظة.' },
      auth: { signInTitle: 'سجّل الدخول لإدارة إعداداتك', signInDesc: 'سنرسل لك رابطاً آمناً لتسجيل الدخول عبر البريد الإلكتروني.', checkInbox: 'تحقق من بريدك للوصول إلى رابط تسجيل الدخول.', emailPlaceholder: 'you@example.com', sending: 'جارٍ الإرسال…', sendLink: 'إرسال الرابط', paymentSeoTitle: 'أكمل اشتراكك — واكمان كابيتال', paymentSeoDescription: 'أكمل اشتراكك الشهري للوصول إلى رؤى التداول الاحترافية واحصل على 10% مشاركة أرباح.', seoTitleLogin: 'مرحباً بعودتك — ذكاء السوق بالذكاء الاصطناعي', seoTitleSignup: 'انضم إلى واكمان كابيتال — ذكاء السوق بالذكاء الاصطناعي', seoDescription: 'ادخل إلى حسابك في واكمان كابيتال أو انضم إلى آلاف المتداولين الذين يستخدمون ذكاء السوق المدعوم بالذكاء الاصطناعي.' },
      layout: { main: 'الرئيسية', account: 'الحساب', toggleSidebar: 'تبديل الشريط الجانبي' }
    }
  },
  'zh-CN': {
    translation: {
      common: {
        signIn: '登录',
        signOut: '退出登录',
        goToDashboard: '进入仪表盘',
        settings: '设置',
        language: '语言',
        region: '地区',
        currency: '货币',
        save: '保存',
        continue: '继续'
      },
      nav: {
        home: '首页',
        dashboard: '仪表盘',
        analytics: '分析',
        paperTrading: '模拟交易',
        aiCoach: 'AI 教练',
        signals: '信号',
        journal: '交易日志',
        trends: '趋势',
        settings: '设置',
        billing: '结算',
        admin: '管理员'
      },
      modal: { title: '选择您的偏好', intro: '选择语言、地区和货币以个性化您的体验。' },
      home: {
        seoTitle: 'Wakeman Capital — AI 市场情报',
        seoDescription: 'AI 驱动的市场情报、趋势分析和面向交易者与投资者的可操作洞察。',
        hero: {
          title: 'Wakeman Capital — AI 市场情报',
          subtitle: '将市场噪音转化为清晰、符合 SMC 的洞察。实时跟踪社交与新闻叙事，提炼为可操作的上下文。',
          mockupAlt: '产品展示：交易仪表盘界面',
          mockupCaption: '您将使用的应用预览',
          points: { realtime: '实时信号', smc: 'SMC 入场 + 明确失效', risk: '风控工具与日志' }
        },
        stats: { realtime: '实时信号', coverage: '资产覆盖', latency: '平均延迟' },
        sales: { title: '将市场情报转化为收益', subtitle: '加入每月低费并在盈利时分成的交易者。我们的 AI 洞察以透明定价提供与 SMC 一致的机会。' },
        values: {
          precisionEntries: '精确入场',
          precisionDesc: '与 SMC 一致的信号，具备明确的失效与目标',
          realTimeIntelligence: '实时情报',
          intelligenceDesc: '每日 10,000+ 信号处理，平均 ~1.2 秒延迟',
          transparentPricing: '透明定价',
          pricingDesc: '$29.99/月 + 10% 利润分成'
        },
        social: { signalAccuracy: '信号准确率', profitsTracked: '跟踪利润', activeTraders: '活跃交易者' },
        aligned: { title: '利益一致模式', subtitle: '$29.99/月解锁全部功能。仅在你盈利时收取 10% — 与你的成功完全一致。', badge: '✓ 低月费 + 盈利时分成' },
        cta: { joinNow: '立即加入 Wakeman Capital', alreadyMember: '已经是会员？', signInHere: '在此登录' },
        insights: { title: 'Wakeman Capital 洞察' }
      },
      analytics: { seoTitle: '市场分析 | Trend Pulse', seoDescription: '基于 AI 的高级市场情绪分析与趋势识别，助力更优交易决策。', pageTitle: '市场分析', pageSubtitle: 'AI 驱动的情绪与趋势分析' },
      dashboard: { seoTitle: '仪表盘 | Wakeman Capital', seoDescription: '实时交易仪表盘，包含交易、信号与市场趋势。', welcome: '欢迎回来', activeSignals: '活跃信号', openTrades: '持仓交易', trackedPairs: '跟踪货币对', asOf: '截至', quickTopUp: '快捷充值', title: '仪表盘', addFunds: '添加资金', trendsSnapshot: '趋势快照' },
      trend: { marketSentiment: '市场情绪分析', loading: '正在加载市场情绪…', noData: '暂无趋势分析数据。', bullish: '看涨', bearish: '看跌', neutral: '中性' },
      footer: { company: 'Wakeman Capital', tagline: '为现代交易者提供 AI 驱动的市场情报。', product: '产品', companySection: '公司', features: '功能', pricing: '定价', signalCenter: '信号中心', aiCoach: 'AI 教练', home: '首页', dashboard: '仪表盘', rights: '版权所有。' },
      auth: { signInTitle: '登录以管理您的设置', signInDesc: '我们会向您发送安全的登录链接。', checkInbox: '请在邮箱中查收登录链接。', emailPlaceholder: 'you@example.com', sending: '发送中…', sendLink: '发送链接', paymentSeoTitle: '完成您的订阅 — Wakeman Capital', paymentSeoDescription: '完成每月订阅以获取专业交易洞察，并享受 10% 利润分成。', seoTitleLogin: '欢迎回来 — AI 市场情报', seoTitleSignup: '加入 Wakeman Capital — AI 市场情报', seoDescription: '登录您的 Wakeman Capital 账号，或加入数千名使用 AI 市场情报的交易者。' },
      layout: { main: '主要', account: '账户', toggleSidebar: '切换侧边栏' }
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
