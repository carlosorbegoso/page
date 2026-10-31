/**
 * Cursor Particles Engine - Liquid particle system following cursor
 * Particles spawn at cursor, fall with gravity, bounce, and connect with lines
 * Subtle & lightweight — small particles, soft goo, doesn't overwhelm content
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
        this.time = 0;
        this.animationId = null;
        this.isActive = true;
        this.particleCount = 60;
        this.burstParticles = [];
        this.mouseSpeed = 0;
        this.lastMouse = { x: 0, y: 0 };

        // Audio data (fed from AudioReactiveEngine)
        this.audioVol = 0;
        this.audioBass = 0;
        this.audioMid = 0;
        this.audioTreble = 0;
        this.audioPulse = 0;

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

        // SVG goo filter — softer blur so particles don't merge into huge blobs
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.cssText = 'position: absolute; width: 0; height: 0;';
        svg.innerHTML = `
            <defs>
                <filter id="goo-filter">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
                    <feColorMatrix in="blur" mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -6" result="goo"/>
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

        this._onClick = (e) => {
            this.createBurst(e.clientX, e.clientY);
        };
        document.addEventListener('click', this._onClick);

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

    /** Audio data input — called externally by AudioReactiveEngine */
    setAudioData(vol, bands, pulse) {
        this.audioVol = vol;
        this.audioBass = bands.bass;
        this.audioMid = bands.mid;
        this.audioTreble = bands.treble;
        this.audioPulse = pulse;
    }

    createParticles() {
        this.particles = [];
        const w = this.canvas.width;
        const h = this.canvas.height;

        for (let i = 0; i < this.particleCount; i++) {
            const size = Math.random() * 4 + 1;
            this.particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: size,
                weight: Math.random() * 0.8 + 0.1,
            });
        }
    }

    createBurst(x, y) {
        const count = 10;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = 2 + Math.random() * 3;
            this.burstParticles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 3,
                life: 1,
            });
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        if (!this.isActive) return;

        this.time += 0.016;

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

        // Mouse speed
        const dx = mx - this.lastMouse.x;
        const dy = my - this.lastMouse.y;
        this.mouseSpeed = Math.sqrt(dx * dx + dy * dy);
        this.lastMouse.x = mx;
        this.lastMouse.y = my;

        // Audio
        const aBass = this.audioBass;
        const aPulse = this.audioPulse;

        // Subtle hue cycling
        const hueBase = (200 + this.time * 3) % 360;

        // Gradient for particles
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, `hsla(${hueBase}, 70%, 65%, 0.6)`);
        gradient.addColorStop(0.5, `hsla(${(hueBase + 20) % 360}, 80%, 60%, 0.45)`);
        gradient.addColorStop(1, `hsla(${(hueBase + 70) % 360}, 65%, 65%, 0.5)`);
        ctx.fillStyle = gradient;

        // ─── Main particles ─────────────────────────────────────────────
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Shrink faster so they don't accumulate
            p.size -= 0.15;

            // Respawn at mouse when too small
            if (p.size < 0.3) {
                p.x = mx + (Math.random() * 12 - 6);
                p.y = my + (Math.random() * 12 - 6);
                p.size = Math.random() * 8 + 2 + aBass * 4;
                p.weight = Math.random() * 0.8 + 0.1;
            }

            // Gravity — lighter so they float longer
            p.y += p.weight;
            p.weight += 0.025;

            // Audio: bass hit pushes particles outward from mouse
            if (aPulse > 0.15) {
                const toX = p.x - mx;
                const toY = p.y - my;
                const d = Math.sqrt(toX * toX + toY * toY);
                if (d > 0 && d < 200) {
                    p.x += (toX / d) * aPulse * 4;
                    p.y += (toY / d) * aPulse * 3;
                }
            }

            // Respawn instead of bouncing at bottom — avoids pile-up
            if (p.y > h + 10) {
                p.size = 0; // will respawn at mouse next frame
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(p.size, 0), 0, Math.PI * 2);
            ctx.fill();
        }

        // ─── Burst particles ────────────────────────────────────────────
        for (let i = this.burstParticles.length - 1; i >= 0; i--) {
            const bp = this.burstParticles[i];
            bp.x += bp.vx;
            bp.y += bp.vy;
            bp.vy += 0.08;
            bp.vx *= 0.96;
            bp.vy *= 0.96;
            bp.life -= 0.03;
            bp.size *= 0.97;

            if (bp.life <= 0 || bp.size < 0.2) {
                this.burstParticles.splice(i, 1);
                continue;
            }

            ctx.fillStyle = `hsla(${hueBase}, 80%, 65%, ${bp.life * 0.7})`;
            ctx.beginPath();
            ctx.arc(bp.x, bp.y, Math.max(bp.size, 0), 0, Math.PI * 2);
            ctx.fill();
        }

        // ─── Connect nearby particles ───────────────────────────────────
        this.connectParticles(ctxL, hueBase);
    }

    connectParticles(ctx, hueBase) {
        const maxDist = 80;
        const maxDistSq = maxDist * maxDist;
        const particles = this.particles;

        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    const opacity = (1 - dist / maxDist) * 0.25;
                    ctx.strokeStyle = `hsla(${hueBase}, 70%, 65%, ${opacity})`;
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
        document.removeEventListener('click', this._onClick);
        window.removeEventListener('resize', this._onResize);
        document.removeEventListener('visibilitychange', this._onVisibility);
        this.canvas?.remove();
        this.canvasLines?.remove();
        this.svgFilter?.remove();
        this.particles = [];
        this.burstParticles = [];
    }
}
