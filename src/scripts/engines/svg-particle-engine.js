/**
 * SVG Particle Engine
 * Converts SVG paths into interactive particles on Canvas
 * Particles react to audio (microphone) and mouse interaction
 * Inspired by Frank's Laboratory - adapted for Neural Mindscape
 */

import { log } from '../utils/logger.js';

class Particle {
    constructor(x, y, color) {
        this.originX = x;
        this.originY = y;
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.color = color;
        this.size = Math.random() * 2.5 + 0.5;
        this.baseSize = this.size;
        this.vx = 0;
        this.vy = 0;
        this.ease = Math.random() * 0.05 + 0.02;
        this.friction = 0.92;
        this.dx = 0;
        this.dy = 0;
        this.distance = 0;
        this.force = 0;
        this.angle = 0;
    }

    update(mouse, audioData) {
        // Mouse repulsion
        this.dx = mouse.x - this.x;
        this.dy = mouse.y - this.y;
        this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

        if (this.distance < mouse.radius) {
            this.force = (mouse.radius - this.distance) / mouse.radius;
            this.angle = Math.atan2(this.dy, this.dx);
            this.vx -= Math.cos(this.angle) * this.force * 6;
            this.vy -= Math.sin(this.angle) * this.force * 6;
        }

        // Audio reaction - particles vibrate based on frequency
        if (audioData) {
            const audioForce = audioData.volume * 8;
            const bassForce = audioData.bass * 15;
            const randomAngle = Math.random() * Math.PI * 2;
            this.vx += Math.cos(randomAngle) * audioForce * 0.3;
            this.vy += Math.sin(randomAngle) * audioForce * 0.3;

            // Bass makes particles expand outward from center
            const centerDx = this.x - this.originX;
            const centerDy = this.y - this.originY;
            const centerDist = Math.sqrt(centerDx * centerDx + centerDy * centerDy) || 1;
            this.vx += (centerDx / centerDist) * bassForce * 0.2;
            this.vy += (centerDy / centerDist) * bassForce * 0.2;

            // Size pulses with treble
            this.size = this.baseSize + audioData.treble * 3;
        } else {
            this.size = this.baseSize;
        }

        // Spring back to origin
        this.vx += (this.originX - this.x) * this.ease;
        this.vy += (this.originY - this.y) * this.ease;

        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Update position
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx, globalAlpha) {
        ctx.globalAlpha = globalAlpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

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
            this.analyser.smoothingTimeConstant = 0.85;
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            this.frequencyData = new Uint8Array(bufferLength);
            source.connect(this.analyser);
            this.initialized = true;
            return true;
        } catch (err) {
            log.warn('Microphone not available:', err.message);
            return false;
        }
    }

    getData() {
        if (!this.initialized) return null;

        this.analyser.getByteTimeDomainData(this.dataArray);
        this.analyser.getByteFrequencyData(this.frequencyData);

        // Volume
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            const val = this.dataArray[i] / 128 - 1;
            sum += val * val;
        }
        const volume = Math.sqrt(sum / this.dataArray.length);

        // Frequency bands
        const len = this.frequencyData.length;
        const third = Math.floor(len / 3);
        let bass = 0, mid = 0, treble = 0;
        for (let i = 0; i < third; i++) bass += this.frequencyData[i];
        for (let i = third; i < third * 2; i++) mid += this.frequencyData[i];
        for (let i = third * 2; i < len; i++) treble += this.frequencyData[i];

        return {
            volume,
            bass: bass / (third * 255),
            mid: mid / (third * 255),
            treble: treble / ((len - third * 2) * 255)
        };
    }

    dispose() {
        if (this.stream) this.stream.getTracks().forEach(t => t.stop());
        if (this.audioContext && this.audioContext.state !== 'closed') this.audioContext.close();
        this.initialized = false;
    }
}

export class SvgParticleEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: -1000, y: -1000, radius: 120 };
        this.microphone = null;
        this.audioActive = false;
        this.animationId = null;
        this.isRunning = false;
        this.currentSvg = null;
        this.hueRotation = 0;
        this.smoothAudio = { volume: 0, bass: 0, mid: 0, treble: 0 };
        this.containerEl = null;
        this.scanCanvas = null;
        this.scanCtx = null;
        this.gap = 3; // pixel gap for scanning - lower = more particles
    }

    async init(containerId) {
        this.containerEl = document.getElementById(containerId);
        if (!this.containerEl) {
            log.warn(`SVG Particle container #${containerId} not found`);
            return false;
        }

        // Main canvas
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('svg-particle-canvas');
        this.containerEl.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: false });

        // Hidden canvas for scanning SVG
        this.scanCanvas = document.createElement('canvas');
        this.scanCtx = this.scanCanvas.getContext('2d', { willReadFrequently: true });

        this.resize();
        this._onResize = () => this.resize();
        this._onMouseMove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        };
        this._onMouseLeave = () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        };
        this._onTouchMove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.touches[0].clientX - rect.left;
            this.mouse.y = e.touches[0].clientY - rect.top;
        };
        this._onTouchEnd = () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        };

        window.addEventListener('resize', this._onResize);
        this.canvas.addEventListener('mousemove', this._onMouseMove);
        this.canvas.addEventListener('mouseleave', this._onMouseLeave);
        this.canvas.addEventListener('touchmove', this._onTouchMove, { passive: true });
        this.canvas.addEventListener('touchend', this._onTouchEnd);

        return true;
    }

    resize() {
        if (!this.canvas || !this.containerEl) return;
        this.canvas.width = this.containerEl.offsetWidth;
        this.canvas.height = this.containerEl.offsetHeight;

        // Rebuild particles if we have a loaded SVG
        if (this.currentSvg) {
            this._buildParticles();
        }
    }

    async loadSvg(svgUrl) {
        try {
            const response = await fetch(svgUrl);
            const svgText = await response.text();

            // Parse SVG and render to hidden canvas
            const img = new Image();
            const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            return new Promise((resolve) => {
                img.onload = () => {
                    this.currentSvg = img;
                    URL.revokeObjectURL(url);
                    this._buildParticles();
                    resolve(true);
                };
                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    log.error('Failed to load SVG');
                    resolve(false);
                };
                img.src = url;
            });
        } catch (err) {
            log.error('Error loading SVG:', err);
            return false;
        }
    }

    _buildParticles() {
        if (!this.currentSvg || !this.scanCanvas) return;

        const cw = this.canvas.width;
        const ch = this.canvas.height;

        // Scale SVG to fit canvas with padding
        const padding = 0.15;
        const maxW = cw * (1 - padding * 2);
        const maxH = ch * (1 - padding * 2);
        const scale = Math.min(maxW / this.currentSvg.width, maxH / this.currentSvg.height);
        const sw = this.currentSvg.width * scale;
        const sh = this.currentSvg.height * scale;
        const offsetX = (cw - sw) / 2;
        const offsetY = (ch - sh) / 2;

        // Draw SVG to scan canvas
        this.scanCanvas.width = cw;
        this.scanCanvas.height = ch;
        this.scanCtx.clearRect(0, 0, cw, ch);
        this.scanCtx.drawImage(this.currentSvg, offsetX, offsetY, sw, sh);

        // Scan pixels to create particles
        const imageData = this.scanCtx.getImageData(0, 0, cw, ch);
        const data = imageData.data;
        this.particles = [];

        const gap = this.gap;
        for (let y = 0; y < ch; y += gap) {
            for (let x = 0; x < cw; x += gap) {
                const idx = (y * cw + x) * 4;
                const alpha = data[idx + 3];
                if (alpha > 128) {
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    const color = `rgb(${r},${g},${b})`;
                    this.particles.push(new Particle(x, y, color));
                }
            }
        }

        log.info(`SVG Particle Engine: ${this.particles.length} particles created`);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    async toggleAudio() {
        if (this.audioActive) {
            this.audioActive = false;
            if (this.microphone) {
                this.microphone.dispose();
                this.microphone = null;
            }
            return false;
        }

        this.microphone = new Microphone(512);
        const success = await this.microphone.init();
        if (success) {
            this.audioActive = true;
            return true;
        }
        return false;
    }

    _animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Get audio data
        let audioData = null;
        if (this.audioActive && this.microphone) {
            const raw = this.microphone.getData();
            if (raw) {
                // Smooth
                this.smoothAudio.volume = this.smoothAudio.volume * 0.8 + raw.volume * 0.2;
                this.smoothAudio.bass = this.smoothAudio.bass * 0.75 + raw.bass * 0.25;
                this.smoothAudio.mid = this.smoothAudio.mid * 0.8 + raw.mid * 0.2;
                this.smoothAudio.treble = this.smoothAudio.treble * 0.8 + raw.treble * 0.2;
                audioData = this.smoothAudio;
            }
        }

        // Dynamic glow based on audio
        if (audioData && audioData.volume > 0.02) {
            const glowIntensity = Math.min(audioData.volume * 40, 20);
            this.ctx.shadowBlur = glowIntensity;
            this.ctx.shadowColor = `hsla(${180 + this.hueRotation}, 80%, 60%, 0.5)`;
            this.hueRotation = (this.hueRotation + audioData.mid * 3) % 360;
        } else {
            this.ctx.shadowBlur = 0;
        }

        // Update and draw particles
        const globalAlpha = 0.9;
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.mouse, audioData);
            this.particles[i].draw(this.ctx, globalAlpha);
        }

        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;

        this.animationId = requestAnimationFrame(() => this._animate());
    }

    dispose() {
        this.stop();
        if (this.microphone) {
            this.microphone.dispose();
            this.microphone = null;
        }
        window.removeEventListener('resize', this._onResize);
        if (this.canvas) {
            this.canvas.removeEventListener('mousemove', this._onMouseMove);
            this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
            this.canvas.removeEventListener('touchmove', this._onTouchMove);
            this.canvas.removeEventListener('touchend', this._onTouchEnd);
            this.canvas.remove();
        }
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
    }
}
