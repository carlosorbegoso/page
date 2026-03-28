/**
 * Cursor Particles Engine - Liquid particle system following cursor
 * Particles spawn at cursor, fall with gravity, bounce, and connect with lines
 */

export class CursorParticlesEngine {
    constructor() {
        this.isTouchDevice = 'ontouchstart' in window;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.innerWidth <= 768;

        if (this.isTouchDevice || this.prefersReducedMotion || this.isMobile) return;

        this.canvas = null;
        this.canvasLines = null;
        this.ctx = null;
        this.ctxLines = null;
        this.particles = [];
        this.mouse = { x: undefined, y: undefined };
        this.canvasCenterX = window.innerWidth / 2;
        this.canvasCenterY = window.innerHeight / 2;
        this.radius = window.innerWidth / 5;
        this.angle = 0;
        this.animationId = null;
        this.isActive = true;
        this.particleCount = 100;

        this.init();
    }

    init() {
        // Lines canvas (behind particles)
        this.canvasLines = document.createElement('canvas');
        this.canvasLines.style.cssText = `
            position: fixed; inset: 0; pointer-events: none;
            z-index: 9989; width: 100%; height: 100%;
        `;
        document.body.appendChild(this.canvasLines);
        this.ctxLines = this.canvasLines.getContext('2d');

        // Particles canvas (with goo filter)
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed; inset: 0; pointer-events: none;
            z-index: 9990; width: 100%; height: 100%;
            filter: url(#goo-filter);
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // SVG goo filter
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.cssText = 'position: absolute; width: 0; height: 0;';
        svg.innerHTML = `
            <defs>
                <filter id="goo-filter">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
                    <feColorMatrix in="blur" mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"/>
                    <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
                </filter>
            </defs>
        `;
        document.body.appendChild(svg);
        this.svgFilter = svg;

        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        this._onMouseMove = (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        };
        document.addEventListener('mousemove', this._onMouseMove);

        // Reset mouse position periodically so particles autopilot when mouse leaves
        this.mouseResetInterval = setInterval(() => {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        }, 50);

        this._onResize = () => this.resize();
        window.addEventListener('resize', this._onResize);

        this._onVisibility = () => { this.isActive = !document.hidden; };
        document.addEventListener('visibilitychange', this._onVisibility);
    }

    resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.canvas.width = w;
        this.canvas.height = h;
        this.canvasLines.width = w;
        this.canvasLines.height = h;
        this.canvasCenterX = w / 2;
        this.canvasCenterY = h / 2;
        this.radius = w / 5;
        this.createParticles();
    }

    createParticles() {
        this.particles = [];
        const w = this.canvas.width;
        const h = this.canvas.height;

        for (let i = 0; i < this.particleCount; i++) {
            const size = Math.random() * 8 + 2;
            this.particles.push({
                x: Math.random() * (w - size * 2) + size,
                y: Math.random() * (h - size * 2) + size,
                size: size,
                minSize: size,
                weight: Math.random() * 2 + 0.1,
            });
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        if (!this.isActive) return;

        const ctx = this.ctx;
        const ctxL = this.ctxLines;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctxL.clearRect(0, 0, w, h);

        // Autopilot when mouse is outside window
        let mx = this.mouse.x;
        let my = this.mouse.y;
        if (mx === undefined || my === undefined) {
            this.angle += 0.008;
            mx = this.canvasCenterX + this.radius * 2 * Math.cos(this.angle);
            my = this.canvasCenterY + this.radius * 0.9 * Math.sin(this.angle * 2);
        }

        // Neural gradient for particles
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, 'rgba(100, 181, 246, 0.7)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(170, 68, 255, 0.6)');
        ctx.fillStyle = gradient;

        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Shrink over time
            p.size -= 0.12;

            // Respawn at mouse when too small
            if (p.size < 0.5) {
                p.x = mx + (Math.random() * 16 - 8);
                p.y = my + (Math.random() * 16 - 8);
                p.size = Math.random() * 20 + 3;
                p.weight = Math.random() * 2 + 0.1;
            }

            // Gravity
            p.y += p.weight;
            p.weight += 0.04;

            // Bounce off bottom
            if (p.y > h - p.size) {
                p.weight *= -0.4;
                p.y = h - p.size;
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(p.size, 0), 0, Math.PI * 2);
            ctx.fill();
        }

        // Connect nearby particles with lines
        this.connectParticles(ctxL);
    }

    connectParticles(ctx) {
        const maxDist = 90;
        const particles = this.particles;

        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.35;
                    ctx.strokeStyle = `rgba(100, 181, 246, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    destroy() {
        this.isActive = false;
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.mouseResetInterval) clearInterval(this.mouseResetInterval);
        document.removeEventListener('mousemove', this._onMouseMove);
        window.removeEventListener('resize', this._onResize);
        document.removeEventListener('visibilitychange', this._onVisibility);
        this.canvas?.remove();
        this.canvasLines?.remove();
        this.svgFilter?.remove();
        this.particles = [];
    }
}
