/**
 * Cursor Particles Engine
 * Futuristic cursor with particle trail effect
 */

export class CursorParticlesEngine {
    constructor() {
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isActive = true;

        // Check for touch device or reduced motion
        this.isTouchDevice = 'ontouchstart' in window;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.innerWidth <= 768;

        // Reduce particles on smaller screens
        this.maxParticles = this.isMobile ? 25 : 50;

        if (this.isTouchDevice || this.prefersReducedMotion) {
            return;
        }

        this.init();
    }

    init() {
        // Create container for particles
        this.container = document.createElement('div');
        this.container.className = 'cursor-particles-container';
        this.container.style.cssText = `
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 9998;
            overflow: hidden;
        `;
        document.body.appendChild(this.container);

        // Create custom cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.innerHTML = `
            <div class="cursor-dot"></div>
            <div class="cursor-ring"></div>
            <div class="cursor-ring-outer"></div>
        `;
        document.body.appendChild(this.cursor);

        // Add styles
        this.addStyles();

        // Event listeners
        this.bindEvents();

        // Start animation loop
        this.animate();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body {
                cursor: none !important;
            }

            a, button, [role="button"], input, textarea, select, .clickable {
                cursor: none !important;
            }

            .custom-cursor {
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
            }

            .cursor-dot {
                position: absolute;
                width: 8px;
                height: 8px;
                background: #64b5f6;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 10px #64b5f6, 0 0 20px rgba(100, 181, 246, 0.5);
            }

            .cursor-ring {
                position: absolute;
                width: 32px;
                height: 32px;
                border: 1px solid rgba(100, 181, 246, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.15s ease, border-color 0.15s ease, width 0.15s ease, height 0.15s ease;
            }

            .cursor-ring-outer {
                position: absolute;
                width: 48px;
                height: 48px;
                border: 1px solid rgba(100, 181, 246, 0.2);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.2s ease, opacity 0.2s ease;
                animation: cursorRingPulse 2s ease-in-out infinite;
            }

            @keyframes cursorRingPulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
            }

            .custom-cursor.hover .cursor-ring {
                width: 50px;
                height: 50px;
                border-color: rgba(255, 107, 53, 0.8);
            }

            .custom-cursor.hover .cursor-dot {
                background: #ff6b35;
                box-shadow: 0 0 15px #ff6b35, 0 0 30px rgba(255, 107, 53, 0.5);
            }

            .custom-cursor.hover .cursor-ring-outer {
                opacity: 0;
            }

            .custom-cursor.clicking .cursor-dot {
                transform: translate(-50%, -50%) scale(0.5);
            }

            .custom-cursor.clicking .cursor-ring {
                transform: translate(-50%, -50%) scale(0.8);
            }

            .cursor-particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: #64b5f6;
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                box-shadow: 0 0 6px rgba(100, 181, 246, 0.8);
            }

            @media (max-width: 768px) {
                body {
                    cursor: auto !important;
                }

                .custom-cursor,
                .cursor-particles-container {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            // Update cursor position
            this.cursor.style.left = `${this.mouseX}px`;
            this.cursor.style.top = `${this.mouseY}px`;

            // Create particle trail
            if (this.isActive && Math.random() > 0.5) {
                this.createParticle(this.mouseX, this.mouseY);
            }
        });

        // Hover effect on interactive elements
        document.querySelectorAll('a, button, [role="button"], input, textarea, select, .clickable').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
            });
        });

        // Click effect
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('clicking');
            this.createBurstParticles();
        });

        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('clicking');
        });

        // Handle new elements
        const observer = new MutationObserver(() => {
            document.querySelectorAll('a:not([data-cursor-bound]), button:not([data-cursor-bound]), [role="button"]:not([data-cursor-bound])').forEach(el => {
                el.setAttribute('data-cursor-bound', 'true');
                el.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('hover');
                });
                el.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('hover');
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
        });
    }

    createParticle(x, y) {
        if (this.particles.length >= this.maxParticles) {
            return;
        }

        const particle = document.createElement('div');
        particle.className = 'cursor-particle';

        // Random offset
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;

        particle.style.left = `${x + offsetX}px`;
        particle.style.top = `${y + offsetY}px`;

        // Random color variation
        const colors = ['#64b5f6', '#90caf9', '#42a5f5', '#81d4fa'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        this.container.appendChild(particle);

        const particleData = {
            element: particle,
            x: x + offsetX,
            y: y + offsetY,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
            life: 1,
            decay: 0.02 + Math.random() * 0.02,
            size: 2 + Math.random() * 3
        };

        particle.style.width = `${particleData.size}px`;
        particle.style.height = `${particleData.size}px`;

        this.particles.push(particleData);
    }

    createBurstParticles() {
        const burstCount = 12;
        for (let i = 0; i < burstCount; i++) {
            const angle = (i / burstCount) * Math.PI * 2;
            const velocity = 3 + Math.random() * 2;

            const particle = document.createElement('div');
            particle.className = 'cursor-particle';
            particle.style.left = `${this.mouseX}px`;
            particle.style.top = `${this.mouseY}px`;
            particle.style.background = '#ff6b35';
            particle.style.boxShadow = '0 0 8px rgba(255, 107, 53, 0.8)';

            this.container.appendChild(particle);

            this.particles.push({
                element: particle,
                x: this.mouseX,
                y: this.mouseY,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                decay: 0.03,
                size: 3 + Math.random() * 2
            });
        }
    }

    animate() {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // Gravity
            p.life -= p.decay;

            if (p.life <= 0) {
                p.element.remove();
                this.particles.splice(i, 1);
            } else {
                p.element.style.left = `${p.x}px`;
                p.element.style.top = `${p.y}px`;
                p.element.style.opacity = p.life;
                p.element.style.transform = `scale(${p.life})`;
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    destroy() {
        this.isActive = false;
        this.container?.remove();
        this.cursor?.remove();
        this.particles.forEach(p => p.element.remove());
        this.particles = [];
    }
}

// Auto-initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        new CursorParticlesEngine();
    });
}
