/* ===== CONFIGURACIÓN CENTRALIZADA DEL PORTFOLIO ===== */

export const CONFIG = {
    // ===== CONFIGURACIÓN GENERAL =====
    APP_NAME: 'Carlos Orbegoso Portfolio',
    VERSION: '2.0.0',
    DEBUG: false,
    
    // ===== CONFIGURACIÓN DE LOGGING =====
    LOGGING: {
        LEVEL: 'warn', // 'error', 'warn', 'info', 'debug'
        SHOW_TIMESTAMPS: true,
        SHOW_PREFIX: true,
        CONSOLE_OUTPUT: true
    },
    
    // ===== CONFIGURACIÓN DE ANIMACIONES =====
    ANIMATIONS: {
        ENABLED: true,
        DURATION: {
            FAST: 200,
            NORMAL: 400,
            SLOW: 800
        },
        EASING: {
            FAST: 'ease',
            NORMAL: 'cubic-bezier(0.4, 0, 0.2, 1)',
            SLOW: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
    },
    
    // ===== CONFIGURACIÓN DE THREE.JS =====
    THREE_JS: {
        ENABLED: true,
        PERFORMANCE: {
            MOBILE: 'low',
            TABLET: 'medium',
            DESKTOP: 'high'
        },
        PARTICLES: {
            COUNT: {
                MOBILE: 100,
                TABLET: 200,
                DESKTOP: 500
            }
        }
    },
    
    // ===== CONFIGURACIÓN DE IDIOMAS =====
    LANGUAGES: {
        DEFAULT: 'en',
        SUPPORTED: ['en', 'es'],
        FALLBACK: 'en'
    },
    
    // ===== CONFIGURACIÓN DE TEMAS =====
    THEMES: {
        DEFAULT: 'light',
        SUPPORTED: ['light', 'dark'],
        AUTO_DETECT: true
    },
    
    // ===== CONFIGURACIÓN RESPONSIVE =====
    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 1024,
        DESKTOP: 1200
    },
    
    // ===== CONFIGURACIÓN DE API =====
    API: {
        BASE_URL: '',
        TIMEOUT: 5000,
        RETRY_ATTEMPTS: 3
    },
    
    // ===== CONFIGURACIÓN DE NOTIFICACIONES =====
    NOTIFICATIONS: {
        AUTO_HIDE: true,
        DURATION: 5000,
        POSITION: 'top-right',
        MAX_VISIBLE: 3
    },
    
    // ===== CONFIGURACIÓN DE SCROLL =====
    SCROLL: {
        SMOOTH: true,
        OFFSET: 80,
        THROTTLE: 100
    },
    
    // ===== CONFIGURACIÓN DE PERFORMANCE =====
    PERFORMANCE: {
        LAZY_LOADING: true,
        DEBOUNCE_DELAY: 300,
        THROTTLE_DELAY: 100,
        CLEANUP_INTERVAL: 30000
    }
};

// ===== CONFIGURACIÓN DE ENTORNO =====
export const ENV = {
    IS_DEVELOPMENT: true,
    IS_PRODUCTION: false,
    IS_TESTING: false
};

// ===== CONFIGURACIÓN DE FEATURES =====
export const FEATURES = {
    THREE_JS: true,
    ANIMATIONS: true,
    NOTIFICATIONS: true,
    THEME_SWITCHING: true,
    LANGUAGE_SWITCHING: true,
    MOBILE_OPTIMIZATIONS: true,
    TOUCH_GESTURES: true,
    ACCESSIBILITY: true
};

// ===== CONFIGURACIÓN DE DEBUG =====
export const DEBUG = {
    LOG_LEVEL: CONFIG.DEBUG ? 'debug' : 'error',
    SHOW_PERFORMANCE: false,
    SHOW_ANIMATIONS: false,
    SHOW_THREE_JS: false
};

// ===== VALIDACIÓN DE CONFIGURACIÓN =====
export function validateConfig() {
    const requiredKeys = ['APP_NAME', 'VERSION', 'ANIMATIONS', 'THREE_JS'];
    
    for (const key of requiredKeys) {
        if (!CONFIG[key]) {
            throw new Error(`Missing required config key: ${key}`);
        }
    }
    
    return true;
}

// ===== CONFIGURACIÓN DINÁMICA =====
export function updateConfig(newConfig) {
    Object.assign(CONFIG, newConfig);
    validateConfig();
}

// ===== CONFIGURACIÓN POR DISPOSITIVO =====
export function getDeviceConfig() {
    const width = window.innerWidth;
    
    if (width <= CONFIG.BREAKPOINTS.MOBILE) {
        return {
            type: 'mobile',
            performance: CONFIG.THREE_JS.PERFORMANCE.MOBILE,
            particles: CONFIG.THREE_JS.PARTICLES.COUNT.MOBILE
        };
    } else if (width <= CONFIG.BREAKPOINTS.TABLET) {
        return {
            type: 'tablet',
            performance: CONFIG.THREE_JS.PERFORMANCE.TABLET,
            particles: CONFIG.THREE_JS.PARTICLES.COUNT.TABLET
        };
    } else {
        return {
            type: 'desktop',
            performance: CONFIG.THREE_JS.PERFORMANCE.DESKTOP,
            particles: CONFIG.THREE_JS.PARTICLES.COUNT.DESKTOP
        };
    }
}
