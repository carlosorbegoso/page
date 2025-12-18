/**
 * Premium Ripple Effect Module
 * Material Design inspired ripple animation for buttons and interactive elements
 */

export class RippleEffect {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Select all elements that should have ripple effect
        const rippleSelectors = [
            '.btn',
            '.btn-primary',
            '.btn-outline',
            '.btn-cta',
            '.contact-btn',
            '.submit-btn',
            '.back-to-top',
            '.nav-link',
            '.mobile-nav-item',
            '[data-ripple]'
        ];

        const elements = document.querySelectorAll(rippleSelectors.join(', '));

        elements.forEach(element => {
            if (!element.dataset.rippleInitialized) {
                element.addEventListener('click', this.createRipple.bind(this));
                element.dataset.rippleInitialized = 'true';

                // Ensure element has position relative for ripple positioning
                const computedStyle = window.getComputedStyle(element);
                if (computedStyle.position === 'static') {
                    element.style.position = 'relative';
                }
                element.style.overflow = 'hidden';
            }
        });
    }

    createRipple(event) {
        const element = event.currentTarget;
        if (!element) return;

        // Remove any existing ripples
        const existingRipples = element.querySelectorAll('.ripple-wave');
        existingRipples.forEach(r => r.remove());

        // Get element dimensions
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;

        // Calculate ripple position from click point
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-wave');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            transform: scale(0);
            animation: rippleWave 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;

        // Set ripple color based on button type
        if (element.classList.contains('btn-primary') || element.classList.contains('btn-cta')) {
            ripple.style.background = 'rgba(255, 255, 255, 0.35)';
        } else if (element.classList.contains('btn-outline')) {
            ripple.style.background = 'rgba(100, 181, 246, 0.25)';
        } else if (element.classList.contains('nav-link') || element.classList.contains('mobile-nav-item')) {
            ripple.style.background = 'rgba(0, 255, 255, 0.15)';
        } else {
            ripple.style.background = 'rgba(100, 181, 246, 0.2)';
        }

        element.appendChild(ripple);

        // Remove ripple after animation completes
        ripple.addEventListener('animationend', () => ripple.remove());
    }

    // Method to manually add ripple to new elements
    addRippleTo(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (!element.dataset.rippleInitialized) {
                element.addEventListener('click', this.createRipple.bind(this));
                element.dataset.rippleInitialized = 'true';

                const computedStyle = window.getComputedStyle(element);
                if (computedStyle.position === 'static') {
                    element.style.position = 'relative';
                }
                element.style.overflow = 'hidden';
            }
        });
    }
}

// CSS for ripple animation (injected once)
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleWave {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }

    /* Ensure ripple containers have proper styling */
    [data-ripple-initialized] {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Auto-initialize
const rippleEffect = new RippleEffect();
export default rippleEffect;
