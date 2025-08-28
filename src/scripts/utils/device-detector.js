/**
 * Device Detector & Adaptive Header Transparency
 * Detecta el tipo de dispositivo y ajusta la transparencia del header dinámicamente
 */

import { HEADER_CONFIG, getHeaderConfig, getDeviceType } from '../config/header-config.js';

export class DeviceDetector {
    constructor() {
        this.deviceType = getDeviceType(window.innerWidth, window.innerHeight);
        this.isMobile = this.deviceType === 'mobile';
        this.isTablet = this.deviceType === 'tablet';
        this.isDesktop = this.deviceType === 'desktop';
        
        this.init();
    }
    
    detectDevice() {
        return getDeviceType(window.innerWidth, window.innerHeight);
    }
    
    getTransparencyConfig() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        return getHeaderConfig(currentTheme, this.deviceType);
    }
    
    updateHeaderTransparency() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        const config = this.getTransparencyConfig();
        
        // Aplicar configuración adaptativa usando variables CSS
        header.style.setProperty('--header-bg', config.background);
        header.style.setProperty('--header-backdrop', config.backdropFilter);
        header.style.setProperty('--header-border', `1px solid ${config.borderColor}`);
        header.style.setProperty('--header-shadow', config.shadow);
        
        // Aplicar estilos directamente para compatibilidad
        header.style.background = config.background;
        header.style.backdropFilter = config.backdropFilter;
        header.style.borderBottom = `1px solid ${config.borderColor}`;
        header.style.boxShadow = config.shadow;
        
        // Log para debugging
        console.log(`🎨 Header adaptado para ${this.deviceType} (${document.documentElement.getAttribute('data-theme') || 'light'}):`, config);
    }
    
    updateThemeTransparency(theme) {
        // Simplemente actualizar la transparencia del header
        // La configuración ya incluye el tema correcto
        this.updateHeaderTransparency();
    }
    
    handleResize() {
        const newDeviceType = this.detectDevice();
        if (newDeviceType !== this.deviceType) {
            this.deviceType = newDeviceType;
            this.isMobile = this.deviceType === 'mobile';
            this.isTablet = this.deviceType === 'tablet';
            this.isDesktop = this.deviceType === 'desktop';
            
            console.log(`📱 Dispositivo cambiado a: ${this.deviceType}`);
            this.updateHeaderTransparency();
        }
    }
    
    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupDeviceDetector();
            });
        } else {
            this.setupDeviceDetector();
        }
    }
    
    setupDeviceDetector() {
        // Aplicar transparencia inicial
        this.updateHeaderTransparency();
        
        // Escuchar cambios de tamaño de ventana
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Escuchar cambios de tema
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme');
                    this.updateThemeTransparency(newTheme);
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        console.log(`🚀 DeviceDetector inicializado para: ${this.deviceType}`);
    }
    
    // Método público para forzar actualización
    refresh() {
        this.updateHeaderTransparency();
    }
    
    // Método para obtener información del dispositivo
    getDeviceInfo() {
        return {
            type: this.deviceType,
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isDesktop: this.isDesktop,
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.innerWidth / window.innerHeight
        };
    }
}
