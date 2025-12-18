/**
 * Premium Card Effects Module
 * 3D Tilt effect, glow tracking, and interactive animations
 */

export class CardEffects {
    constructor() {
        this.cards = [];
        this.isEnabled = true;
        this.isMobile = window.innerWidth <= 768;

        // Disable on mobile for performance
        if (!this.isMobile) {
            this.init();
        }
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupCards());
        } else {
            this.setupCards();
        }

        // Re-setup on resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleResize() {
        this.isMobile = window.innerWidth <= 768;
        if (this.isMobile) {
            this.disableAllEffects();
        } else {
            this.setupCards();
        }
    }

    setupCards() {
        // Select all cards that should have 3D effects
        const cardSelectors = [
            '.project-card',
            '.skill-category',
            '.experience-content',
            '.contact-item',
            '.stat-card',
            '.column-card',
            '.glass-card-premium',
            '.card-3d-tilt'
        ];

        const allCards = document.querySelectorAll(cardSelectors.join(', '));

        allCards.forEach(card => {
            if (!card.dataset.tiltInitialized) {
                this.initCard(card);
                card.dataset.tiltInitialized = 'true';
            }
        });
    }

    initCard(card) {
        // Add event listeners for 3D tilt
        card.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, card));
        card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
        card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));

        // Store card reference
        this.cards.push(card);
    }

    handleMouseEnter(e, card) {
        if (!this.isEnabled || this.isMobile) return;

        // Add active state
        card.style.transition = 'transform 0.1s ease-out';
    }

    handleMouseMove(e, card) {
        if (!this.isEnabled || this.isMobile) return;

        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Calculate rotation (max 8 degrees)
        const rotateX = (mouseY / (rect.height / 2)) * -8;
        const rotateY = (mouseX / (rect.width / 2)) * 8;

        // Apply 3D transform
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(10px)
            scale(1.02)
        `;

        // Update CSS custom properties for glow effect
        const percentX = ((e.clientX - rect.left) / rect.width) * 100;
        const percentY = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${percentX}%`);
        card.style.setProperty('--mouse-y', `${percentY}%`);
    }

    handleMouseLeave(e, card) {
        if (!this.isEnabled || this.isMobile) return;

        // Reset transform with smooth transition
        card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';

        // Reset CSS custom properties
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    }

    disableAllEffects() {
        this.cards.forEach(card => {
            card.style.transform = '';
            card.style.transition = '';
        });
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
        this.disableAllEffects();
    }
}

// Auto-initialize
const cardEffects = new CardEffects();
export default cardEffects;
