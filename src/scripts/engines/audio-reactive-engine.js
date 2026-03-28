/**
 * Audio Reactive Engine - Neural Mind Edition
 * Deep, organic audio-reactive system for the ENTIRE portfolio
 * Every visual element breathes with sound - particles, cards, titles,
 * Three.js engines, CSS animations, glows, and scanlines all respond.
 *
 * Inspired by Frank's Laboratory audio visualizer (bezier curve bars)
 * The canvas visualizer is centered on screen with mix-blend-mode: screen
 */

import { log } from '../utils/logger.js';

// ─── Microphone Capture ─────────────────────────────────────────────────────

class Microphone {
    constructor(fftSize = 512) {
        this.initialized = false;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.frequencyData = null;
        this.fftSize = fftSize;
        this.stream = null;
    }

    async init() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = this.audioContext.createMediaStreamSource(this.stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.fftSize;
            this.analyser.smoothingTimeConstant = 0.82;
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            this.frequencyData = new Uint8Array(bufferLength);
            source.connect(this.analyser);
            this.initialized = true;
            return true;
        } catch (err) {
            log.warn('Microphone access denied:', err.message);
            return false;
        }
    }

    getSamples() {
        if (!this.initialized) return null;
        this.analyser.getByteTimeDomainData(this.dataArray);
        return [...this.dataArray].map(e => e / 128 - 1);
    }

    getVolume() {
        if (!this.initialized) return 0;
        this.analyser.getByteTimeDomainData(this.dataArray);
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            const val = this.dataArray[i] / 128 - 1;
            sum += val * val;
        }
        return Math.sqrt(sum / this.dataArray.length);
    }

    getBands() {
        if (!this.initialized) return { bass: 0, mid: 0, treble: 0, subBass: 0 };
        this.analyser.getByteFrequencyData(this.frequencyData);
        const len = this.frequencyData.length;
        const subBassEnd = Math.floor(len * 0.05);
        const bassEnd = Math.floor(len * 0.15);
        const midEnd = Math.floor(len * 0.5);

        let subBass = 0, bass = 0, mid = 0, treble = 0;
        for (let i = 0; i < subBassEnd; i++) subBass += this.frequencyData[i];
        for (let i = subBassEnd; i < bassEnd; i++) bass += this.frequencyData[i];
        for (let i = bassEnd; i < midEnd; i++) mid += this.frequencyData[i];
        for (let i = midEnd; i < len; i++) treble += this.frequencyData[i];

        return {
            subBass: subBass / (subBassEnd * 255),
            bass: bass / ((bassEnd - subBassEnd) * 255),
            mid: mid / ((midEnd - bassEnd) * 255),
            treble: treble / ((len - midEnd) * 255)
        };
    }

    dispose() {
        if (this.stream) this.stream.getTracks().forEach(t => t.stop());
        if (this.audioContext && this.audioContext.state !== 'closed') this.audioContext.close();
        this.initialized = false;
    }
}

// ─── Bezier Bar (Frank's Lab pattern) ───────────────────────────────────────

class Bar {
    constructor(x, y, width, height, index) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.index = index;
    }

    update(micInput) {
        const sound = micInput * 300;
        if (sound > this.height) this.height = sound;
        else this.height -= this.height * 0.03;
    }

    draw(ctx, hueOffset) {
        const t = (this.index * 1.2 + hueOffset) % 360;
        const hue = 180 + Math.sin(t * 0.017) * 40;
        const lightness = 50 + this.height * 0.1;
        ctx.strokeStyle = `hsla(${hue}, 85%, ${lightness}%, 0.55)`;
        ctx.lineWidth = this.width;
        ctx.save();
        ctx.rotate(this.index * 0.043);
        ctx.beginPath();
        ctx.bezierCurveTo(
            this.x / 2, this.y / 2,
            this.height * -0.5 - 150, this.height + 50,
            this.x, this.y
        );
        ctx.stroke();
        if (this.index > 170) {
            ctx.beginPath();
            ctx.arc(this.x, this.y + 10 + this.height / 2 + this.height * 0.1, this.height * 0.05, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 10);
            ctx.lineTo(this.x, this.y + 10 + this.height / 2);
            ctx.stroke();
        }
        ctx.restore();
    }
}

// ─── Main Engine ────────────────────────────────────────────────────────────

export class AudioReactiveEngine {
    constructor() {
        this.microphone = null;
        this.canvas = null;
        this.ctx = null;
        this.bars = [];
        this.isActive = false;
        this.animationId = null;
        this.fftSize = 512;
        this.hueOffset = 0;

        // Smoothed audio values
        this.vol = 0;
        this.peak = 0;
        this.bands = { subBass: 0, bass: 0, mid: 0, treble: 0 };
        this.prevBass = 0;
        this.pulse = 0; // bass-hit decay
        this.energy = 0; // overall energy accumulator

        // External Three.js engines
        this.heroEngine = null;
        this.connectedParticlesEngine = null;
        this.visualEngine = null;

        // Cached DOM elements
        this.el = {};
    }

    async init() {
        try {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'audio-reactive-canvas';
            this.canvas.style.cssText = `
                position: fixed; top: 0; left: 0;
                width: 100vw; height: 100vh;
                pointer-events: none; z-index: 9998;
                opacity: 0; transition: opacity 1.5s ease;
                mix-blend-mode: screen;
            `;
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
            this.createBars();
            return true;
        } catch (error) {
            log.error('Audio Reactive Engine init error:', error);
            return false;
        }
    }

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createBars() {
        this.bars = [];
        for (let i = 1; i < this.fftSize / 2; i++) {
            this.bars.push(new Bar(0, i * 0.9, 0.5, 0, i));
        }
    }

    /** Collect every reactive element on the page */
    collectElements() {
        const q = s => document.querySelector(s);
        const qa = s => document.querySelectorAll(s);

        this.el = {
            // Hero
            photoWrapper: q('.photo-wrapper'),
            photoGlow: q('.photo-glow'),
            photoRings: qa('.photo-ring'),
            photoPulse: q('.photo-pulse'),
            titleFirst: q('.title-line:not(.highlight)'),
            titleHighlight: q('.title-line.highlight'),
            techIcons: qa('.tech-icon'),
            gradientOrbs: qa('.gradient-orb'),
            heroStatNums: qa('.hero-stat .stat-number'),
            heroBtns: qa('.hero-actions .btn'),
            availBadge: q('.availability-badge'),
            locationBadge: q('.location-badge'),
            typingCursor: q('.typing-cursor'),
            heroSubtitle: q('.hero-subtitle'),
            heroBio: q('.hero-bio'),
            highlightWords: qa('.highlight-word'),
            statDividers: qa('.stat-divider'),

            // Header / Nav
            header: q('.header-desktop'),
            headerProgress: q('[data-header-progress]'),
            brandIcon: q('.brand-icon'),
            brandText: q('.brand-text'),
            navLinks: qa('.nav-link, .cosmic-link'),
            weatherBtn: q('.weather-btn'),
            timeDisplay: q('.time-display'),
            mobileNav: q('.mobile-bottom-nav'),
            mobileNavItems: qa('.mobile-nav-item'),

            // About
            aboutProfileWrapper: q('.profile-photo-wrapper'),
            aboutTitleHighlight: q('.title-highlight'),
            aboutTitleAccent: q('.title-accent'),
            ctaButtons: qa('.cta-button'),
            aboutDescriptions: qa('.content-description'),

            // Experience
            expCards: qa('.experience-content'),
            expMarkerDots: qa('.marker-dot'),
            expMarkerRings: qa('.marker-ring'),
            expTechTags: qa('.experience-tech .tech-tag'),
            expAchievements: qa('.achievement'),
            timelineProgress: q('.timeline-progress'),
            expParticles: qa('.exp-particle'),
            expDates: qa('.experience-date'),
            expTitles: qa('.experience-title'),

            // Skills
            bentoCards: qa('.bento-card'),
            pills: qa('.pill'),
            cardIcons: qa('.card-icon'),
            marqueeTrack: q('.marquee-track'),
            marqueeItems: qa('.marquee-item'),

            // Tech & Projects
            statCards: qa('.stat-card'),
            statIconCores: qa('.stat-icon-core'),
            statIconRings: qa('.stat-icon-ring'),
            statHolograms: qa('.stat-hologram'),
            statScanlines: qa('.stat-scanline'),
            statCorners: qa('.stat-corner'),
            statProgressBars: qa('.stat-progress-bar'),
            columnCards: qa('.column-card'),
            cardHolograms: qa('.card-hologram'),
            iconCubes: qa('.icon-cube'),
            iconOrbits: qa('.icon-orbit'),
            langItems: qa('.language-item'),
            langBarSegs: qa('.lang-bar-segment'),
            techCategoryPulses: qa('.category-pulse'),
            techCategoryIcons: qa('.category-icon'),
            techTagsAll: qa('.tech-section .tech-tag, .tech-tags .tech-tag'),
            projectCards: qa('.project-card'),
            projectIcons: qa('.project-preview-icon'),
            contributionDays: qa('.contribution-day'),
            streakBadge: q('.streak-badge'),
            streakFire: q('.streak-fire'),

            // Contact
            contactItems: qa('.contact-item'),
            contactIcons: qa('.contact-icon'),
            contactIconRings: qa('.contact-item .icon-ring'),
            contactArrows: qa('.contact-arrow'),
            socialLinks: qa('.social-link'),
            connectionPaths: qa('.connection-path'),

            // Footer
            footer: q('.footer'),
            footerQuote: q('.footer-quote'),
            quoteIcon: q('.quote-icon'),
            backToTop: q('.back-to-top'),

            // Scanline overlay
            scanlineOverlay: q('.scanline-overlay'),
            scanlines: q('.scanlines'),
            noiseLayer: q('.noise'),

            // Global
            allSections: qa('.section'),
            allGlassCards: qa('.glass-card'),
            sectionTitles: qa('.section-title'),
            sectionBadges: qa('.section-badge'),
            sectionSubtitles: qa('.section-subtitle'),
            gradientTexts: qa('.gradient-text-animated'),
        };
    }

    // ─── Engine References ──────────────────────────────────────────────────

    setHeroEngine(e) { this.heroEngine = e; }
    setConnectedParticlesEngine(e) { this.connectedParticlesEngine = e; }
    setVisualEngine(e) { this.visualEngine = e; }

    // ─── Start / Stop ───────────────────────────────────────────────────────

    async startListening() {
        if (this.isActive) return true;
        this.microphone = new Microphone(this.fftSize);
        const ok = await this.microphone.init();
        if (!ok) return false;

        this.isActive = true;
        this.collectElements();
        if (this.canvas) this.canvas.style.opacity = '1';
        document.body.classList.add('audio-active');
        this.animate();
        return true;
    }

    stopListening() {
        this.isActive = false;
        if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
        if (this.microphone) { this.microphone.dispose(); this.microphone = null; }
        if (this.canvas) this.canvas.style.opacity = '0';
        document.body.classList.remove('audio-active');
        this.resetAll();
    }

    // ─── Main Loop ──────────────────────────────────────────────────────────

    animate() {
        if (!this.isActive) return;

        if (this.microphone?.initialized) {
            const samples = this.microphone.getSamples();
            const rawVol = this.microphone.getVolume();
            const rawBands = this.microphone.getBands();

            // Smooth everything
            this.vol = this.vol * 0.8 + rawVol * 0.2;
            this.peak = Math.max(this.peak * 0.995, this.vol);
            this.bands.subBass = this.bands.subBass * 0.7 + rawBands.subBass * 0.3;
            this.bands.bass = this.bands.bass * 0.72 + rawBands.bass * 0.28;
            this.bands.mid = this.bands.mid * 0.76 + rawBands.mid * 0.24;
            this.bands.treble = this.bands.treble * 0.78 + rawBands.treble * 0.22;

            // Beat detection
            const bassHit = this.bands.bass > 0.18 && this.bands.bass > this.prevBass * 1.12;
            if (bassHit) this.pulse = 1;
            this.pulse *= 0.9;
            this.prevBass = this.bands.bass;

            // Energy accumulator (overall activity level)
            this.energy = this.energy * 0.95 + (this.bands.bass + this.bands.mid + this.bands.treble) * 0.05;

            // Push audio vars to CSS
            this.setCSSVars();

            // Canvas
            this.drawVisualizer(samples);

            // All reactions
            this.reactHero();
            this.reactHeader();
            this.reactAbout();
            this.reactExperience();
            this.reactSkills();
            this.reactTechProjects();
            this.reactContact();
            this.reactFooter();
            this.reactScanline();
            this.reactGlobal();

            // Three.js engines
            this.feedHeroEngine();
            this.feedConnectedParticles();

            this.hueOffset += 0.4;
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // ─── CSS Custom Properties on :root ─────────────────────────────────────

    setCSSVars() {
        const s = document.documentElement.style;
        s.setProperty('--audio-vol', this.vol.toFixed(3));
        s.setProperty('--audio-bass', this.bands.bass.toFixed(3));
        s.setProperty('--audio-mid', this.bands.mid.toFixed(3));
        s.setProperty('--audio-treble', this.bands.treble.toFixed(3));
        s.setProperty('--audio-pulse', this.pulse.toFixed(3));
        s.setProperty('--audio-energy', this.energy.toFixed(3));
    }

    // ─── Canvas Visualizer ──────────────────────────────────────────────────

    drawVisualizer(samples) {
        if (!this.ctx || !samples) return;
        const { width: w, height: h } = this.canvas;
        this.ctx.clearRect(0, 0, w, h);
        if (this.vol < 0.008) return;

        this.ctx.save();
        this.ctx.translate(w / 2, h / 2);
        this.ctx.globalAlpha = Math.min(0.45, this.vol * 2);
        this.bars.forEach((bar, i) => {
            if (samples[i] !== undefined) {
                bar.update(samples[i]);
                bar.draw(this.ctx, this.hueOffset);
            }
        });
        this.ctx.restore();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION-BY-SECTION REACTIONS
    // ═══════════════════════════════════════════════════════════════════════

    reactHero() {
        const { bass, mid, treble, subBass } = this.bands;
        const v = this.vol;
        const e = this.el;

        // Photo breathes with sub-bass
        if (e.photoWrapper) e.photoWrapper.style.transform = `scale(${1 + subBass * 0.15})`;

        // Photo glow blooms
        if (e.photoGlow) {
            e.photoGlow.style.filter = `blur(${25 + v * 120}px)`;
            e.photoGlow.style.inset = `-${30 + v * 70}px`;
            e.photoGlow.style.opacity = `${0.4 + v * 1.2}`;
        }

        // Photo pulse ring expands with beat
        if (e.photoPulse && this.pulse > 0.1) {
            e.photoPulse.style.transform = `scale(${1 + this.pulse * 0.6})`;
            e.photoPulse.style.borderColor = `rgba(0, 255, 255, ${this.pulse * 0.8})`;
        }

        // Rings speed up with mid
        if (e.photoRings?.length) {
            e.photoRings.forEach((r, i) => {
                const speed = 1 + mid * 12;
                r.style.animationDuration = `${(i === 0 ? 30 : 40) / speed}s`;
                r.style.borderColor = `rgba(${bass > 0.2 ? '0, 255, 255' : '100, 181, 246'}, ${0.25 + v * 0.75})`;
            });
        }

        // Title: first name text-shadow, highlight name drop-shadow + scale
        if (e.titleFirst) {
            e.titleFirst.style.textShadow = `0 0 ${10 + v * 40}px rgba(100, 181, 246, ${0.2 + v * 0.5})`;
        }
        if (e.titleHighlight) {
            const g = 15 + bass * 100;
            e.titleHighlight.style.filter = `drop-shadow(0 0 ${g}px rgba(0, 255, 255, ${0.3 + bass * 0.7}))`;
            e.titleHighlight.style.transform = `scale(${1 + bass * 0.04})`;
        }

        // Typing cursor blinks faster with treble
        if (e.typingCursor) e.typingCursor.style.animationDuration = `${Math.max(0.15, 1 - treble * 2.5)}s`;

        // Subtitle glow
        if (e.heroSubtitle) {
            e.heroSubtitle.style.textShadow = mid > 0.1 ? `0 0 ${mid * 20}px rgba(100, 181, 246, ${mid * 0.3})` : '';
        }

        // Bio highlight words underline animation
        if (e.highlightWords?.length) {
            e.highlightWords.forEach(w => {
                w.style.textShadow = v > 0.05 ? `0 0 ${v * 15}px rgba(100, 181, 246, ${v * 0.4})` : '';
            });
        }

        // Tech icons bounce + glow
        if (e.techIcons?.length) {
            e.techIcons.forEach((icon, i) => {
                const bounce = bass > 0.1 ? Math.sin(Date.now() * 0.013 + i * 1.8) * bass * 14 : 0;
                icon.style.transform = `translateY(${-bounce}px) scale(${1 + bass * 0.1})`;
                icon.style.boxShadow = bass > 0.12 ? `0 0 ${bass * 30}px currentColor` : '';
            });
        }

        // Gradient orbs per-band
        if (e.gradientOrbs?.length) {
            [subBass, mid, treble].forEach((b, i) => {
                if (e.gradientOrbs[i]) {
                    e.gradientOrbs[i].style.transform = `scale(${1 + b * 0.6})`;
                    e.gradientOrbs[i].style.opacity = `${0.25 + b * 0.55}`;
                }
            });
        }

        // Stats glow on beat
        if (e.heroStatNums?.length) {
            e.heroStatNums.forEach(s => {
                s.style.textShadow = this.pulse > 0.1 ? `0 0 ${this.pulse * 25}px rgba(0, 255, 255, ${this.pulse * 0.9})` : '';
            });
        }

        // Stat dividers glow
        if (e.statDividers?.length) {
            e.statDividers.forEach(d => {
                d.style.boxShadow = v > 0.05 ? `0 0 ${v * 15}px rgba(100, 181, 246, ${v * 0.4})` : '';
            });
        }

        // CTA buttons
        if (e.heroBtns?.length) {
            e.heroBtns.forEach((btn, i) => {
                const glow = 12 + v * 40;
                const c = i === 0 ? '100, 181, 246' : '0, 255, 255';
                btn.style.boxShadow = `0 4px ${glow}px rgba(${c}, ${0.15 + v * 0.5})`;
            });
        }

        // Availability badge pulse glow on beat
        if (e.availBadge && this.pulse > 0.15) {
            e.availBadge.style.boxShadow = `0 0 ${this.pulse * 20}px rgba(34, 197, 94, ${this.pulse * 0.5})`;
        } else if (e.availBadge) {
            e.availBadge.style.boxShadow = '';
        }

        // Location badge
        if (e.locationBadge) {
            e.locationBadge.style.borderColor = `rgba(100, 181, 246, ${0.15 + v * 0.4})`;
        }
    }

    reactHeader() {
        const { bass, mid } = this.bands;
        const v = this.vol;
        const e = this.el;

        if (e.header) e.header.style.boxShadow = v > 0.03 ? `0 1px ${v * 18}px rgba(0, 255, 255, ${v * 0.25})` : '';
        if (e.brandIcon && bass > 0.12) e.brandIcon.style.filter = `drop-shadow(0 0 ${bass * 25}px rgba(0, 255, 255, 0.7))`;
        else if (e.brandIcon) e.brandIcon.style.filter = '';
        if (e.brandText) e.brandText.style.textShadow = v > 0.05 ? `0 0 ${v * 12}px rgba(0, 255, 255, ${v * 0.4})` : '';

        if (e.navLinks?.length) {
            e.navLinks.forEach(l => {
                l.style.textShadow = v > 0.04 ? `0 0 ${v * 12}px rgba(100, 181, 246, ${v * 0.4})` : '';
            });
        }

        if (e.headerProgress) e.headerProgress.style.boxShadow = v > 0.05 ? `0 0 ${v * 10}px rgba(0, 255, 255, ${v * 0.5})` : '';

        // Weather & time buttons
        if (e.weatherBtn) e.weatherBtn.style.boxShadow = mid > 0.1 ? `0 0 ${mid * 15}px rgba(100, 181, 246, ${mid * 0.3})` : '';
        if (e.timeDisplay) e.timeDisplay.style.boxShadow = mid > 0.1 ? `0 0 ${mid * 12}px rgba(100, 181, 246, ${mid * 0.2})` : '';

        // Mobile nav
        if (e.mobileNav) e.mobileNav.style.boxShadow = v > 0.03 ? `0 -1px ${v * 20}px rgba(0, 255, 255, ${v * 0.2})` : '';
        if (e.mobileNavItems?.length) {
            e.mobileNavItems.forEach(item => {
                item.style.textShadow = v > 0.05 ? `0 0 ${v * 8}px rgba(100, 181, 246, ${v * 0.3})` : '';
            });
        }
    }

    reactAbout() {
        const { bass, mid, treble } = this.bands;
        const v = this.vol;
        const e = this.el;

        // Profile photo wrapper glow
        if (e.aboutProfileWrapper) {
            e.aboutProfileWrapper.style.boxShadow = v > 0.05
                ? `0 0 ${30 + v * 50}px rgba(0, 255, 255, ${0.2 + v * 0.4})`
                : '';
        }

        // Title accents glow
        if (e.aboutTitleHighlight) {
            e.aboutTitleHighlight.style.textShadow = mid > 0.08 ? `0 0 ${mid * 25}px rgba(100, 181, 246, ${mid * 0.5})` : '';
        }
        if (e.aboutTitleAccent) {
            e.aboutTitleAccent.style.textShadow = treble > 0.08 ? `0 0 ${treble * 25}px rgba(0, 255, 255, ${treble * 0.5})` : '';
        }

        // CTA buttons
        if (e.ctaButtons?.length) {
            e.ctaButtons.forEach((btn, i) => {
                const b = i === 0 ? bass : mid;
                btn.style.boxShadow = b > 0.1 ? `0 4px ${b * 25}px rgba(0, 255, 255, ${b * 0.3})` : '';
            });
        }
    }

    reactExperience() {
        const { bass, mid, treble } = this.bands;
        const v = this.vol;
        const e = this.el;

        // Cards border + inner glow per band
        if (e.expCards?.length) {
            e.expCards.forEach((card, i) => {
                const b = [bass, mid, treble][i % 3];
                card.style.borderColor = `rgba(100, 181, 246, ${0.08 + b * 0.5})`;
                card.style.boxShadow = b > 0.08
                    ? `0 0 ${b * 35}px rgba(100, 181, 246, ${b * 0.2}), inset 0 0 ${b * 20}px rgba(100, 181, 246, ${b * 0.05})`
                    : '';
            });
        }

        // Marker dots pulse on beat
        if (e.expMarkerDots?.length) {
            e.expMarkerDots.forEach(dot => {
                dot.style.transform = this.pulse > 0.08 ? `scale(${1 + this.pulse * 0.6})` : '';
                dot.style.boxShadow = this.pulse > 0.08 ? `0 0 ${this.pulse * 25}px rgba(0, 255, 255, ${this.pulse * 0.7})` : '';
            });
        }

        // Marker rings glow
        if (e.expMarkerRings?.length) {
            e.expMarkerRings.forEach(ring => {
                ring.style.borderColor = v > 0.05 ? `rgba(0, 255, 255, ${0.2 + v * 0.5})` : '';
            });
        }

        // Tech tags shimmer
        if (e.expTechTags?.length) {
            e.expTechTags.forEach((tag, i) => {
                const wave = Math.sin(Date.now() * 0.003 + i * 0.8) * mid;
                tag.style.borderColor = `rgba(100, 181, 246, ${0.15 + wave * 0.4})`;
                tag.style.boxShadow = mid > 0.12 ? `0 0 ${mid * 12}px rgba(100, 181, 246, ${mid * 0.15})` : '';
            });
        }

        // Achievement icons glow
        if (e.expAchievements?.length) {
            e.expAchievements.forEach(a => {
                a.style.textShadow = v > 0.06 ? `0 0 ${v * 10}px rgba(0, 255, 255, ${v * 0.3})` : '';
            });
        }

        // Timeline progress line glow
        if (e.timelineProgress) {
            e.timelineProgress.style.boxShadow = `0 0 ${v * 30}px rgba(0, 255, 255, ${v * 0.5})`;
        }

        // Floating particles movement boost
        if (e.expParticles?.length) {
            e.expParticles.forEach(p => {
                p.style.animationDuration = `${Math.max(2, 6 - bass * 8)}s`;
                p.style.opacity = `${0.3 + v * 0.7}`;
            });
        }

        // Experience titles glow
        if (e.expTitles?.length) {
            e.expTitles.forEach(t => {
                t.style.textShadow = this.pulse > 0.15 ? `0 0 ${this.pulse * 15}px rgba(100, 181, 246, ${this.pulse * 0.4})` : '';
            });
        }

        // Date badges
        if (e.expDates?.length) {
            e.expDates.forEach(d => {
                d.style.textShadow = treble > 0.1 ? `0 0 ${treble * 10}px rgba(0, 255, 255, ${treble * 0.3})` : '';
            });
        }
    }

    reactSkills() {
        const { bass, mid, treble } = this.bands;
        const v = this.vol;
        const e = this.el;

        // Bento cards border glow
        if (e.bentoCards?.length) {
            e.bentoCards.forEach((card, i) => {
                const b = [bass, mid, treble][i % 3];
                card.style.borderColor = `rgba(100, 181, 246, ${0.05 + b * 0.4})`;
                card.style.boxShadow = b > 0.1 ? `0 0 ${b * 25}px rgba(100, 181, 246, ${b * 0.12})` : '';
            });
        }

        // Pills bounce with mid
        if (e.pills?.length) {
            e.pills.forEach((pill, i) => {
                const wave = Math.sin(Date.now() * 0.008 + i * 0.6) * mid;
                pill.style.transform = mid > 0.08 ? `translateY(${-wave * 4}px)` : '';
                pill.style.boxShadow = mid > 0.12 ? `0 0 ${mid * 12}px rgba(100, 181, 246, ${mid * 0.2})` : '';
            });
        }

        // Card icons scale
        if (e.cardIcons?.length) {
            e.cardIcons.forEach(icon => {
                icon.style.transform = bass > 0.1 ? `scale(${1 + bass * 0.2})` : '';
                icon.style.filter = bass > 0.15 ? `drop-shadow(0 0 ${bass * 15}px currentColor)` : '';
            });
        }

        // Marquee speed react to energy
        if (e.marqueeTrack) {
            const speed = Math.max(8, 25 - this.energy * 40);
            e.marqueeTrack.style.animationDuration = `${speed}s`;
        }

        // Marquee items glow
        if (e.marqueeItems?.length) {
            e.marqueeItems.forEach(item => {
                item.style.filter = v > 0.05 ? `drop-shadow(0 0 ${v * 10}px rgba(0, 255, 255, ${v * 0.3}))` : '';
            });
        }
    }

    reactTechProjects() {
        const { bass, mid, treble } = this.bands;
        const v = this.vol;
        const e = this.el;

        // Stat cards
        if (e.statCards?.length) {
            e.statCards.forEach((card, i) => {
                const b = [bass, mid, treble, v][i % 4];
                card.style.borderColor = `rgba(0, 255, 255, ${0.03 + b * 0.4})`;
                card.style.boxShadow = `0 0 ${b * 30}px rgba(0, 255, 255, ${b * 0.15})`;
            });
        }

        // Stat icon cores scale with bass
        if (e.statIconCores?.length) {
            e.statIconCores.forEach(ic => {
                ic.style.transform = `scale(${1 + bass * 0.35})`;
                ic.style.filter = bass > 0.15 ? `drop-shadow(0 0 ${bass * 15}px currentColor)` : '';
            });
        }

        // Stat icon rings glow on beat
        if (e.statIconRings?.length) {
            e.statIconRings.forEach(r => {
                r.style.boxShadow = this.pulse > 0.08 ? `0 0 ${this.pulse * 20}px rgba(0, 255, 255, ${this.pulse * 0.5})` : '';
            });
        }

        // Stat holograms opacity
        if (e.statHolograms?.length) {
            e.statHolograms.forEach(h => { h.style.opacity = `${0.03 + v * 0.15}`; });
        }

        // Stat scanlines speed up
        if (e.statScanlines?.length) {
            e.statScanlines.forEach(s => {
                s.style.animationDuration = `${Math.max(0.5, 2 - bass * 3)}s`;
            });
        }

        // Stat progress bars brightness
        if (e.statProgressBars?.length) {
            e.statProgressBars.forEach(bar => {
                bar.style.filter = `brightness(${1 + v * 0.8})`;
            });
        }

        // Column cards breathing
        if (e.columnCards?.length) {
            e.columnCards.forEach((card, i) => {
                const b = i === 0 ? mid : treble;
                card.style.boxShadow = b > 0.08 ? `0 0 ${b * 30}px rgba(100, 181, 246, ${b * 0.15})` : '';
            });
        }

        // Icon cubes rotate faster with mid
        if (e.iconCubes?.length) {
            e.iconCubes.forEach(cube => {
                cube.style.animationDuration = `${Math.max(2, 8 - mid * 12)}s`;
            });
        }

        // Icon orbits
        if (e.iconOrbits?.length) {
            e.iconOrbits.forEach(orbit => {
                orbit.style.animationDuration = `${Math.max(3, 10 - bass * 14)}s`;
            });
        }

        // Category pulses
        if (e.techCategoryPulses?.length) {
            e.techCategoryPulses.forEach(p => {
                p.style.transform = `scale(${1 + bass * 1})`;
                p.style.opacity = `${0.2 + bass * 0.8}`;
            });
        }

        // Category icons
        if (e.techCategoryIcons?.length) {
            e.techCategoryIcons.forEach(ic => {
                ic.style.filter = v > 0.06 ? `drop-shadow(0 0 ${v * 10}px currentColor)` : '';
            });
        }

        // Tech tags wave
        if (e.techTagsAll?.length) {
            e.techTagsAll.forEach((tag, i) => {
                const wave = Math.sin(Date.now() * 0.004 + i * 0.5) * mid;
                tag.style.borderColor = `rgba(100, 181, 246, ${0.1 + wave * 0.3 + v * 0.2})`;
            });
        }

        // Language items
        if (e.langItems?.length) {
            e.langItems.forEach((item, i) => {
                const wave = Math.sin(Date.now() * 0.005 + i) * treble;
                item.style.transform = treble > 0.08 ? `translateX(${wave * 5}px)` : '';
            });
        }

        // Language bar brightness
        if (e.langBarSegs?.length) {
            e.langBarSegs.forEach(seg => {
                seg.style.filter = bass > 0.12 ? `brightness(${1 + bass * 0.7})` : '';
            });
        }

        // Project cards shimmer border
        if (e.projectCards?.length) {
            e.projectCards.forEach((card, i) => {
                const wave = Math.sin(Date.now() * 0.002 + i * 0.7);
                const b = [bass, mid, treble][i % 3];
                card.style.borderColor = `rgba(100, 181, 246, ${0.04 + b * 0.3 + wave * 0.04})`;
                card.style.boxShadow = b > 0.1 ? `0 0 ${b * 20}px rgba(0, 255, 255, ${b * 0.1})` : '';
            });
        }

        // Project preview icons scale
        if (e.projectIcons?.length) {
            e.projectIcons.forEach(ic => {
                ic.style.filter = v > 0.06 ? `drop-shadow(0 0 ${v * 12}px rgba(0, 255, 255, ${v * 0.4}))` : '';
            });
        }

        // Contribution days light up
        if (e.contributionDays?.length && treble > 0.08) {
            const now = Date.now();
            e.contributionDays.forEach((day, i) => {
                if (Math.sin(now * 0.01 + i * 0.3) > (1 - treble * 2)) {
                    day.style.filter = `brightness(${1 + treble * 2})`;
                } else {
                    day.style.filter = '';
                }
            });
        }

        // Streak fire animation speed
        if (e.streakFire) {
            e.streakFire.style.animationDuration = `${Math.max(0.15, 0.5 - bass * 0.7)}s`;
        }

        // Streak badge glow
        if (e.streakBadge) {
            e.streakBadge.style.boxShadow = bass > 0.15 ? `0 0 ${bass * 20}px rgba(255, 107, 53, ${bass * 0.4})` : '';
        }
    }

    reactContact() {
        const { bass, mid, treble } = this.bands;
        const v = this.vol;
        const e = this.el;

        // Contact cards per band
        if (e.contactItems?.length) {
            e.contactItems.forEach((item, i) => {
                const b = [bass, mid, treble][i % 3];
                item.style.borderColor = `rgba(100, 181, 246, ${0.08 + b * 0.45})`;
                item.style.boxShadow = b > 0.08
                    ? `0 0 ${b * 30}px rgba(100, 181, 246, ${b * 0.18}), inset 0 0 ${b * 15}px rgba(100, 181, 246, ${b * 0.04})`
                    : '';
            });
        }

        // Contact icons pulse
        if (e.contactIcons?.length) {
            e.contactIcons.forEach((ic, i) => {
                const b = [bass, mid, treble][i % 3];
                ic.style.transform = `scale(${1 + b * 0.25})`;
                ic.style.filter = b > 0.12 ? `drop-shadow(0 0 ${b * 15}px currentColor)` : '';
            });
        }

        // Icon rings glow on beat
        if (e.contactIconRings?.length) {
            e.contactIconRings.forEach(r => {
                r.style.boxShadow = this.pulse > 0.08 ? `0 0 ${this.pulse * 18}px rgba(0, 255, 255, ${this.pulse * 0.5})` : '';
            });
        }

        // Contact arrows bounce
        if (e.contactArrows?.length) {
            e.contactArrows.forEach((a, i) => {
                const wave = Math.sin(Date.now() * 0.008 + i * 2) * mid;
                a.style.transform = mid > 0.08 ? `translateX(${wave * 5}px)` : '';
            });
        }

        // Social links bounce + glow
        if (e.socialLinks?.length) {
            e.socialLinks.forEach((link, i) => {
                const bounce = mid > 0.08 ? Math.sin(Date.now() * 0.01 + i * 2.2) * mid * 8 : 0;
                link.style.transform = `translateY(${-bounce}px)`;
                link.style.boxShadow = mid > 0.12 ? `0 0 ${mid * 22}px rgba(100, 181, 246, ${mid * 0.35})` : '';
            });
        }

        // SVG connection paths glow
        if (e.connectionPaths?.length) {
            e.connectionPaths.forEach(p => {
                p.style.filter = v > 0.04 ? `drop-shadow(0 0 ${v * 12}px rgba(0, 255, 255, ${v * 0.5}))` : '';
                p.style.strokeWidth = `${1 + v * 2}`;
            });
        }
    }

    reactFooter() {
        const { bass } = this.bands;
        const v = this.vol;
        const e = this.el;

        if (e.footer) e.footer.style.borderTopColor = v > 0.03 ? `rgba(100, 181, 246, ${0.04 + v * 0.3})` : '';
        if (e.footerQuote) e.footerQuote.style.borderColor = v > 0.04 ? `rgba(100, 181, 246, ${0.1 + v * 0.25})` : '';
        if (e.quoteIcon) e.quoteIcon.style.filter = bass > 0.12 ? `drop-shadow(0 0 ${bass * 15}px rgba(0, 255, 255, ${bass * 0.4}))` : '';
        if (e.backToTop) e.backToTop.style.boxShadow = bass > 0.12 ? `0 0 ${bass * 22}px rgba(0, 255, 255, ${bass * 0.45})` : '';
    }

    reactScanline() {
        const { bass, treble } = this.bands;
        const v = this.vol;
        const e = this.el;

        // Scanline overlay opacity responds to volume
        if (e.scanlineOverlay) e.scanlineOverlay.style.opacity = `${Math.min(1, 0.7 + v * 0.6)}`;

        // Scanlines intensity
        if (e.scanlines) e.scanlines.style.opacity = `${0.4 + bass * 0.4}`;

        // Noise intensity responds to treble
        if (e.noiseLayer) e.noiseLayer.style.opacity = `${0.015 + treble * 0.04}`;
    }

    reactGlobal() {
        const v = this.vol;
        const e = this.el;

        // Section titles glow on beat
        if (e.sectionTitles?.length) {
            e.sectionTitles.forEach(t => {
                t.style.textShadow = this.pulse > 0.12 ? `0 0 ${this.pulse * 30}px rgba(0, 255, 255, ${this.pulse * 0.45})` : '';
            });
        }

        // Section badges border
        if (e.sectionBadges?.length) {
            e.sectionBadges.forEach(b => {
                b.style.borderColor = `rgba(100, 181, 246, ${0.12 + v * 0.4})`;
                b.style.boxShadow = v > 0.06 ? `0 0 ${v * 10}px rgba(100, 181, 246, ${v * 0.12})` : '';
            });
        }

        // Section subtitles
        if (e.sectionSubtitles?.length) {
            e.sectionSubtitles.forEach(s => {
                s.style.opacity = `${0.7 + v * 0.3}`;
            });
        }

        // Gradient animated texts - speed up gradient flow with energy
        if (e.gradientTexts?.length) {
            e.gradientTexts.forEach(t => {
                t.style.animationDuration = `${Math.max(1, 3 - this.energy * 4)}s`;
            });
        }

        // All glass cards breathing border
        if (e.allGlassCards?.length) {
            e.allGlassCards.forEach((card, i) => {
                const wave = Math.sin(Date.now() * 0.001 + i * 0.4) * 0.5 + 0.5;
                const intensity = v * wave;
                card.style.borderColor = intensity > 0.015 ? `rgba(100, 181, 246, ${0.06 + intensity * 0.2})` : '';
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // THREE.JS ENGINE FEEDS
    // ═══════════════════════════════════════════════════════════════════════

    feedHeroEngine() {
        const h = this.heroEngine;
        if (!h?.isInitialized) return;
        const { bass, mid, treble } = this.bands;

        // Particles: velocity boost
        if (h.flowingParticles && h.particleVelocities) {
            const vel = h.particleVelocities;
            for (let i = 0; i < vel.length / 3; i++) {
                vel[i * 3 + 1] = (0.008 + Math.random() * 0.02) * (1 + bass * 7);
                vel[i * 3] = (Math.random() - 0.5) * 0.015 * (1 + mid * 5);
                vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008 * (1 + treble * 4);
            }
        }

        // Orbs scale per band
        if (h.floatingOrbs?.length) {
            h.floatingOrbs.forEach((orb, i) => {
                const b = [bass, mid, treble][i % 3];
                orb.scale.setScalar(1 + b * 0.7);
            });
        }

        // Stars brightness with treble
        if (h.ambientStars?.material?.uniforms?.pixelRatio) {
            h.ambientStars.material.uniforms.pixelRatio.value = h.renderer.getPixelRatio() * (1 + treble * 0.7);
        }
    }

    feedConnectedParticles() {
        const cp = this.connectedParticlesEngine;
        if (!cp?.particles?.length) return;
        const { bass, mid } = this.bands;

        // Push particles outward with bass, add velocity with mid
        cp.particles.forEach((p, i) => {
            if (bass > 0.1) {
                const angle = Math.atan2(p.y - cp.height / 2, p.x - cp.width / 2);
                p.vx += Math.cos(angle) * bass * 0.5;
                p.vy += Math.sin(angle) * bass * 0.5;
            }
            if (mid > 0.08) {
                p.vx += (Math.random() - 0.5) * mid * 0.3;
                p.vy += (Math.random() - 0.5) * mid * 0.3;
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // RESET
    // ═══════════════════════════════════════════════════════════════════════

    resetAll() {
        const clear = (el, props) => {
            if (!el) return;
            const list = el.length !== undefined ? [...el] : [el];
            list.forEach(e => { if (e?.style) props.forEach(p => { e.style[p] = ''; }); });
        };

        const e = this.el;

        // Hero
        clear(e.photoWrapper, ['transform']);
        clear(e.photoGlow, ['filter', 'inset', 'opacity']);
        clear(e.photoPulse, ['transform', 'borderColor']);
        clear(e.photoRings, ['animationDuration', 'borderColor']);
        clear(e.titleFirst, ['textShadow']);
        clear(e.titleHighlight, ['filter', 'transform']);
        clear(e.typingCursor, ['animationDuration']);
        clear(e.heroSubtitle, ['textShadow']);
        clear(e.highlightWords, ['textShadow']);
        clear(e.techIcons, ['transform', 'boxShadow']);
        clear(e.gradientOrbs, ['transform', 'opacity']);
        clear(e.heroStatNums, ['textShadow']);
        clear(e.statDividers, ['boxShadow']);
        clear(e.heroBtns, ['boxShadow']);
        clear(e.availBadge, ['boxShadow']);
        clear(e.locationBadge, ['borderColor']);

        // Header
        clear(e.header, ['boxShadow']);
        clear(e.brandIcon, ['filter']);
        clear(e.brandText, ['textShadow']);
        clear(e.navLinks, ['textShadow']);
        clear(e.headerProgress, ['boxShadow']);
        clear(e.weatherBtn, ['boxShadow']);
        clear(e.timeDisplay, ['boxShadow']);
        clear(e.mobileNav, ['boxShadow']);
        clear(e.mobileNavItems, ['textShadow']);

        // About
        clear(e.aboutProfileWrapper, ['boxShadow']);
        clear(e.aboutTitleHighlight, ['textShadow']);
        clear(e.aboutTitleAccent, ['textShadow']);
        clear(e.ctaButtons, ['boxShadow']);

        // Experience
        clear(e.expCards, ['borderColor', 'boxShadow']);
        clear(e.expMarkerDots, ['transform', 'boxShadow']);
        clear(e.expMarkerRings, ['borderColor']);
        clear(e.expTechTags, ['borderColor', 'boxShadow']);
        clear(e.expAchievements, ['textShadow']);
        clear(e.timelineProgress, ['boxShadow']);
        clear(e.expParticles, ['animationDuration', 'opacity']);
        clear(e.expTitles, ['textShadow']);
        clear(e.expDates, ['textShadow']);

        // Skills
        clear(e.bentoCards, ['borderColor', 'boxShadow']);
        clear(e.pills, ['transform', 'boxShadow']);
        clear(e.cardIcons, ['transform', 'filter']);
        clear(e.marqueeTrack, ['animationDuration']);
        clear(e.marqueeItems, ['filter']);

        // Tech
        clear(e.statCards, ['borderColor', 'boxShadow']);
        clear(e.statIconCores, ['transform', 'filter']);
        clear(e.statIconRings, ['boxShadow']);
        clear(e.statHolograms, ['opacity']);
        clear(e.statScanlines, ['animationDuration']);
        clear(e.statProgressBars, ['filter']);
        clear(e.columnCards, ['boxShadow']);
        clear(e.iconCubes, ['animationDuration']);
        clear(e.iconOrbits, ['animationDuration']);
        clear(e.techCategoryPulses, ['transform', 'opacity']);
        clear(e.techCategoryIcons, ['filter']);
        clear(e.techTagsAll, ['borderColor']);
        clear(e.langItems, ['transform']);
        clear(e.langBarSegs, ['filter']);
        clear(e.projectCards, ['borderColor', 'boxShadow']);
        clear(e.projectIcons, ['filter']);
        clear(e.contributionDays, ['filter']);
        clear(e.streakFire, ['animationDuration']);
        clear(e.streakBadge, ['boxShadow']);

        // Contact
        clear(e.contactItems, ['borderColor', 'boxShadow']);
        clear(e.contactIcons, ['transform', 'filter']);
        clear(e.contactIconRings, ['boxShadow']);
        clear(e.contactArrows, ['transform']);
        clear(e.socialLinks, ['transform', 'boxShadow']);
        clear(e.connectionPaths, ['filter', 'strokeWidth']);

        // Footer
        clear(e.footer, ['borderTopColor']);
        clear(e.footerQuote, ['borderColor']);
        clear(e.quoteIcon, ['filter']);
        clear(e.backToTop, ['boxShadow']);

        // Scanline
        clear(e.scanlineOverlay, ['opacity']);
        clear(e.scanlines, ['opacity']);
        clear(e.noiseLayer, ['opacity']);

        // Global
        clear(e.sectionTitles, ['textShadow']);
        clear(e.sectionBadges, ['borderColor', 'boxShadow']);
        clear(e.sectionSubtitles, ['opacity']);
        clear(e.gradientTexts, ['animationDuration']);
        clear(e.allGlassCards, ['borderColor']);

        // CSS vars
        const s = document.documentElement.style;
        ['--audio-vol', '--audio-bass', '--audio-mid', '--audio-treble', '--audio-pulse', '--audio-energy']
            .forEach(v => s.removeProperty(v));

        // Three.js
        if (this.heroEngine?.floatingOrbs?.length) {
            this.heroEngine.floatingOrbs.forEach(o => o.scale.setScalar(1));
        }
    }

    dispose() {
        this.stopListening();
        if (this.canvas?.parentNode) this.canvas.parentNode.removeChild(this.canvas);
        this.canvas = null;
        this.ctx = null;
        this.bars = [];
    }
}
