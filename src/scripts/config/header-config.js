/**
 * Configuración del Header Adaptativo
 * Define las configuraciones de transparencia para diferentes dispositivos y temas
 */

export const HEADER_CONFIG = {
    // Configuraciones por dispositivo para tema claro
    light: {
        mobile: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderOpacity: 0.15,
            shadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            borderColor: 'rgba(100, 181, 246, 0.15)'
        },
        tablet: {
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(15px)',
            borderOpacity: 0.08,
            shadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
            borderColor: 'rgba(100, 181, 246, 0.08)'
        },
        desktop: {
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(6px)',
            borderOpacity: 0.02,
            shadow: '0 1px 8px rgba(0, 0, 0, 0.03)',
            borderColor: 'rgba(100, 181, 246, 0.02)'
        }
    },
    
    // Configuraciones por dispositivo para tema oscuro
    dark: {
        mobile: {
            background: 'rgba(26, 26, 46, 0.9)',
            backdropFilter: 'blur(20px)',
            borderOpacity: 0.2,
            shadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            borderColor: 'rgba(79, 195, 247, 0.2)'
        },
        tablet: {
            background: 'rgba(26, 26, 46, 0.7)',
            backdropFilter: 'blur(15px)',
            borderOpacity: 0.12,
            shadow: '0 2px 15px rgba(0, 0, 0, 0.15)',
            borderColor: 'rgba(79, 195, 247, 0.12)'
        },
        desktop: {
            background: 'rgba(26, 26, 46, 0.25)',
            backdropFilter: 'blur(6px)',
            borderOpacity: 0.03,
            shadow: '0 1px 8px rgba(0, 0, 0, 0.05)',
            borderColor: 'rgba(79, 195, 247, 0.03)'
        }
    },
    
    // Breakpoints para detección de dispositivo
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1440
    },
    
    // Configuraciones de transición
    transitions: {
        duration: '0.4s',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        header: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        theme: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    
    // Configuraciones de responsive
    responsive: {
        mobile: {
            padding: 'var(--spacing-sm) var(--spacing-md)',
            gap: 'var(--spacing-md)',
            iconSize: '32px',
            buttonSize: '32px'
        },
        tablet: {
            padding: 'var(--spacing-md) var(--spacing-lg)',
            gap: 'var(--spacing-lg)',
            iconSize: '36px',
            buttonSize: '36px'
        },
        desktop: {
            padding: 'var(--spacing-md) var(--spacing-xl)',
            gap: 'var(--spacing-2xl)',
            iconSize: '40px',
            buttonSize: '36px'
        }
    }
};

// Función helper para obtener configuración
export function getHeaderConfig(theme, deviceType) {
    return HEADER_CONFIG[theme]?.[deviceType] || HEADER_CONFIG.light.desktop;
}

// Función helper para obtener breakpoint
export function getDeviceType(width, height) {
    const ratio = width / height;
    
    if (width <= HEADER_CONFIG.breakpoints.mobile || (width <= HEADER_CONFIG.breakpoints.tablet && ratio < 1.2)) {
        return 'mobile';
    } else if (width <= HEADER_CONFIG.breakpoints.tablet || (width <= HEADER_CONFIG.breakpoints.desktop && ratio < 1.5)) {
        return 'tablet';
    } else {
        return 'desktop';
    }
}
