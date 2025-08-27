// ===== CONFIGURACIÓN DE EFECTOS 3D =====

export const THREE_CONFIG = {
    // Configuración de partículas
    particles: {
        count: 1000,
        size: 0.05,
        opacity: 0.8,
        speed: {
            rotation: 0.001,
            mouse: 0.0005
        },
        colors: {
            light: {
                primary: 0x2C5AA0,
                secondary: 0xFF6B35,
                accent: 0x4285F4
            },
            dark: {
                primary: 0x64B5F6,
                secondary: 0xFF8A65,
                accent: 0x81C784
            }
        }
    },

    // Configuración de cursor 3D
    cursor: {
        enabled: true,
        size: {
            dot: 8,
            trail: 20
        },
        colors: {
            dot: 'var(--secondary-color)',
            trail: 'var(--primary-color)'
        },
        animation: {
            speed: 0.1,
            scale: 2
        }
    },

    // Configuración de cards 3D
    cards: {
        enabled: true,
        perspective: 1000,
        rotation: {
            max: 15,
            speed: 0.1
        },
        elevation: {
            hover: -10,
            mobile: -5
        }
    },

    // Configuración de ondas
    waves: {
        enabled: true,
        geometry: {
            width: 20,
            height: 20,
            segments: 32
        },
        animation: {
            speed: 0.001,
            amplitude: 0.5
        },
        material: {
            color: 0x2C5AA0,
            opacity: 0.1,
            wireframe: true
        }
    },

    // Configuración de rendimiento
    performance: {
        maxFPS: 60,
        enableAntialiasing: true,
        enableShadows: false,
        pixelRatio: 'auto'
    },

    // Configuración responsive
    responsive: {
        mobile: {
            particles: {
                count: 500,
                size: 0.03
            },
            cursor: {
                enabled: false
            },
            cards: {
                rotation: {
                    max: 5
                }
            }
        },
        tablet: {
            particles: {
                count: 750,
                size: 0.04
            }
        }
    },

    // Configuración de temas
    themes: {
        light: {
            particles: {
                opacity: 0.8,
                blending: 'additive'
            },
            cursor: {
                blendMode: 'difference'
            }
        },
        dark: {
            particles: {
                opacity: 0.9,
                blending: 'additive'
            },
            cursor: {
                blendMode: 'normal'
            }
        }
    },

    // Configuración de accesibilidad
    accessibility: {
        reducedMotion: {
            enabled: true,
            disableAnimations: true,
            disableCursor: true
        },
        highContrast: {
            enabled: true,
            cursorColors: {
                dot: '#ffffff',
                trail: '#000000'
            }
        }
    }
};

// Función para obtener configuración según el dispositivo
export function getDeviceConfig() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    if (isMobile) {
        return THREE_CONFIG.responsive.mobile;
    } else if (isTablet) {
        return THREE_CONFIG.responsive.tablet;
    }
    
    return THREE_CONFIG;
}

// Función para obtener configuración según el tema
export function getThemeConfig() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? THREE_CONFIG.themes.dark : THREE_CONFIG.themes.light;
}

// Función para obtener configuración de accesibilidad
export function getAccessibilityConfig() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    return {
        reducedMotion: prefersReducedMotion ? THREE_CONFIG.accessibility.reducedMotion : null,
        highContrast: prefersHighContrast ? THREE_CONFIG.accessibility.highContrast : null
    };
}

// Función para aplicar configuración dinámica
export function applyDynamicConfig(threeEffects) {
    const deviceConfig = getDeviceConfig();
    const themeConfig = getThemeConfig();
    const accessibilityConfig = getAccessibilityConfig();
    
    // Aplicar configuración de dispositivo
    if (deviceConfig.particles) {
        threeEffects.updateParticleConfig(deviceConfig.particles);
    }
    
    // Aplicar configuración de tema
    if (themeConfig.particles) {
        threeEffects.updateThemeConfig(themeConfig);
    }
    
    // Aplicar configuración de accesibilidad
    if (accessibilityConfig.reducedMotion?.enabled) {
        threeEffects.disableAnimations();
    }
    
    if (accessibilityConfig.highContrast?.enabled) {
        threeEffects.applyHighContrast();
    }
}

export default THREE_CONFIG;
