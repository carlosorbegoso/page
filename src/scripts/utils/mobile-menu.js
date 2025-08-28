/**
 * Mobile Menu Manager
 * Maneja la funcionalidad del menú móvil y la animación del hamburguesa
 */

export class MobileMenuManager {
    constructor() {
        this.menuToggle = null;
        this.navLinks = null;
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        // Esperar a que los componentes estén cargados
        this.waitForComponents();
    }
    
    waitForComponents() {
        const maxAttempts = 50; // Máximo 5 segundos
        let attempts = 0;
        
        const checkComponents = () => {
            this.menuToggle = document.getElementById('menu-toggle');
            this.navLinks = document.querySelector('.nav-links');
            
            if (this.menuToggle && this.navLinks) {
                this.setupEventListeners();
                console.log('🚀 MobileMenuManager inicializado');
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    // Intentar cada 100ms
                    setTimeout(checkComponents, 100);
                } else {
                    console.warn('⚠️ Elementos del menú móvil no encontrados después de múltiples intentos');
                }
            }
        };
        
        // Comenzar a verificar
        checkComponents();
    }
    
    setupEventListeners() {
        // Toggle del menú
        this.menuToggle.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        // Cerrar menú al hacer click en un enlace
        this.navLinks.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                this.closeMenu();
            }
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.menuToggle.contains(e.target) && !this.navLinks.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Cerrar menú al cambiar tamaño de ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isMenuOpen = true;
        this.menuToggle.classList.add('active');
        this.navLinks.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log('📱 Menú móvil abierto');
    }
    
    closeMenu() {
        this.isMenuOpen = false;
        this.menuToggle.classList.remove('active');
        this.navLinks.classList.remove('active');
        document.body.style.overflow = '';
        
        console.log('📱 Menú móvil cerrado');
    }
    
    // Método público para cerrar el menú desde otros componentes
    forceClose() {
        this.closeMenu();
    }
    
    // Método para verificar el estado del menú
    isOpen() {
        return this.isMenuOpen;
    }
}
