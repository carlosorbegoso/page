/**
 * SVG Particle Engine - Frank's Laboratory style
 * Multiple bezier bar shapes per animal on layered canvases
 * Each shape has its own center, rotation, and bezier params
 */

import { log } from '../utils/logger.js';

// Each animal has multiple "shapes" - each shape is a set of rotating bezier bars
// that form a specific part of the animal (tail, ears, shell, wings, etc.)
const ANIMAL_SHAPES = {
    snail: [
        { // Shell spiral
            cx: -70, cy: 50, count: 255, spacing: 0.9,
            rotate: 0.043, bx: -0.5, bOff: -150, bEnd: 50,
            dotThreshold: 170, hueStart: 180, hueStep: 1.4,
            layer: 'bars'
        },
        { // Antenna rays
            cx: 40, cy: -60, count: 80, spacing: 0.6,
            rotate: 0.08, bx: -0.3, bOff: -80, bEnd: 30,
            dotThreshold: 60, hueStart: 120, hueStep: 2,
            layer: 'lines'
        }
    ],
    fox: [
        { // Big fluffy tail - huge, fills right side behind the body
            cx: 80, cy: 50, count: 255, spacing: 0.9,
            rotate: 0.043, bx: -0.5, bOff: -150, bEnd: 50,
            dotThreshold: 170, hueStart: 300, hueStep: 1.4,
            layer: 'bars'
        },
        { // Left ear - pointed, goes up-left
            cx: -30, cy: -100, count: 120, spacing: 0.7,
            rotate: 0.055, bx: -0.4, bOff: -100, bEnd: 35,
            dotThreshold: 90, hueStart: 30, hueStep: 2.0,
            layer: 'bars'
        },
        { // Right ear - pointed, goes up-right
            cx: 50, cy: -100, count: 120, spacing: 0.7,
            rotate: -0.055, bx: -0.4, bOff: -100, bEnd: 35,
            dotThreshold: 90, hueStart: 60, hueStep: 2.0,
            layer: 'lines'
        }
    ],
    owl: [
        { // Left wing - large fan spread
            cx: -100, cy: 30, count: 255, spacing: 0.9,
            rotate: 0.030, bx: -0.6, bOff: -170, bEnd: 45,
            dotThreshold: 170, hueStart: 120, hueStep: 1.2,
            layer: 'bars'
        },
        { // Right wing
            cx: 100, cy: 30, count: 255, spacing: 0.9,
            rotate: -0.030, bx: -0.6, bOff: -170, bEnd: 45,
            dotThreshold: 170, hueStart: 200, hueStep: 1.2,
            layer: 'bars'
        },
        { // Head plumes / horns
            cx: 0, cy: -110, count: 100, spacing: 0.6,
            rotate: 0.06, bx: -0.3, bOff: -80, bEnd: 25,
            dotThreshold: 70, hueStart: 60, hueStep: 2.5,
            layer: 'lines'
        }
    ],
    deer: [
        { // Left antler - tall and branching
            cx: -50, cy: -100, count: 200, spacing: 0.9,
            rotate: 0.038, bx: -0.45, bOff: -150, bEnd: 35,
            dotThreshold: 140, hueStart: 160, hueStep: 1.5,
            layer: 'bars'
        },
        { // Right antler
            cx: 50, cy: -100, count: 200, spacing: 0.9,
            rotate: -0.038, bx: -0.45, bOff: -150, bEnd: 35,
            dotThreshold: 140, hueStart: 200, hueStep: 1.5,
            layer: 'bars'
        },
        { // Body shimmer
            cx: 0, cy: 60, count: 80, spacing: 0.6,
            rotate: 0.065, bx: -0.3, bOff: -70, bEnd: 25,
            dotThreshold: 60, hueStart: 40, hueStep: 2.5,
            layer: 'lines'
        }
    ],
    moth: [
        { // Left wing - big butterfly spread
            cx: -90, cy: 0, count: 255, spacing: 0.8,
            rotate: 0.030, bx: -0.6, bOff: -170, bEnd: 45,
            dotThreshold: 170, hueStart: 30, hueStep: 1.3,
            layer: 'bars'
        },
        { // Right wing
            cx: 90, cy: 0, count: 255, spacing: 0.8,
            rotate: -0.030, bx: -0.6, bOff: -170, bEnd: 45,
            dotThreshold: 170, hueStart: 280, hueStep: 1.3,
            layer: 'bars'
        },
        { // Antenna feathers
            cx: 0, cy: -90, count: 80, spacing: 0.5,
            rotate: 0.08, bx: -0.25, bOff: -60, bEnd: 20,
            dotThreshold: 60, hueStart: 50, hueStep: 3,
            layer: 'lines'
        }
    ],
    seahorse: [
        { // Big curled tail spiral
            cx: -60, cy: 60, count: 255, spacing: 0.9,
            rotate: 0.043, bx: -0.55, bOff: -150, bEnd: 50,
            dotThreshold: 170, hueStart: 140, hueStep: 1.5,
            layer: 'bars'
        },
        { // Crown/dorsal fin
            cx: 20, cy: -80, count: 100, spacing: 0.6,
            rotate: 0.055, bx: -0.35, bOff: -90, bEnd: 30,
            dotThreshold: 75, hueStart: 180, hueStep: 2.0,
            layer: 'lines'
        }
    ],
    bat: [
        { // Left wing - wide membrane
            cx: -120, cy: 10, count: 255, spacing: 0.9,
            rotate: 0.025, bx: -0.7, bOff: -200, bEnd: 40,
            dotThreshold: 170, hueStart: 260, hueStep: 1.1,
            layer: 'bars'
        },
        { // Right wing
            cx: 120, cy: 10, count: 255, spacing: 0.9,
            rotate: -0.025, bx: -0.7, bOff: -200, bEnd: 40,
            dotThreshold: 170, hueStart: 300, hueStep: 1.1,
            layer: 'bars'
        }
    ],
    chameleon: [
        { // Big curled tail
            cx: -70, cy: 50, count: 255, spacing: 0.9,
            rotate: 0.043, bx: -0.5, bOff: -140, bEnd: 50,
            dotThreshold: 170, hueStart: 80, hueStep: 1.5,
            layer: 'bars'
        },
        { // Head crest fan
            cx: 50, cy: -80, count: 120, spacing: 0.6,
            rotate: 0.06, bx: -0.35, bOff: -90, bEnd: 30,
            dotThreshold: 85, hueStart: 30, hueStep: 2.2,
            layer: 'lines'
        }
    ],
    dinosaur: [
        { // Back spines - tall ridge
            cx: -30, cy: -70, count: 255, spacing: 0.9,
            rotate: 0.035, bx: -0.5, bOff: -160, bEnd: 45,
            dotThreshold: 170, hueStart: 200, hueStep: 1.3,
            layer: 'bars'
        },
        { // Tail sweep
            cx: -80, cy: 60, count: 150, spacing: 0.8,
            rotate: 0.045, bx: -0.4, bOff: -110, bEnd: 35,
            dotThreshold: 110, hueStart: 100, hueStep: 1.6,
            layer: 'lines'
        }
    ],
    anglerfish: [
        { // Light lure - radiating glow
            cx: 50, cy: -70, count: 200, spacing: 0.8,
            rotate: 0.038, bx: -0.5, bOff: -140, bEnd: 40,
            dotThreshold: 150, hueStart: 20, hueStep: 1.8,
            layer: 'bars'
        },
        { // Body/fin rays
            cx: -50, cy: 40, count: 180, spacing: 0.9,
            rotate: 0.040, bx: -0.45, bOff: -120, bEnd: 40,
            dotThreshold: 130, hueStart: 180, hueStep: 1.4,
            layer: 'lines'
        }
    ],
};

class Bar {
    constructor(x, y, width, height, color, index, shape) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.index = index;
        this.shape = shape;
    }

    update(input) {
        const sound = input * 300;
        if (sound > this.height) {
            this.height = sound;
        } else {
            this.height -= this.height * 0.03;
        }
    }

    draw(ctx) {
        const s = this.shape;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.save();
        ctx.rotate(this.index * s.rotate);
        ctx.beginPath();
        ctx.bezierCurveTo(
            this.x / 2, this.y / 2,
            this.height * s.bx + s.bOff,
            this.height + s.bEnd,
            this.x, this.y
        );
        ctx.stroke();

        if (this.index > s.dotThreshold) {
            ctx.beginPath();
            ctx.arc(
                this.x,
                this.y + 10 + this.height / 2 + this.height * 0.1,
                this.height * 0.05,
                0, Math.PI * 2
            );
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 10);
            ctx.lineTo(this.x, this.y + 10 + this.height / 2);
            ctx.stroke();
        }
        ctx.restore();
    }
}

export class SvgParticleEngine {
    constructor() {
        this.canvasBars = null;
        this.canvasLines = null;
        this.ctxBars = null;
        this.ctxLines = null;
        this.svgElement = null;
        this.shapes = []; // Array of { bars: Bar[], shape: config }
        this.animationId = null;
        this.isRunning = false;
        this.time = 0;
        this.containerEl = null;
    }

    async init(containerId) {
        try {
            this.containerEl = document.getElementById(containerId);
            if (!this.containerEl) return false;

            // Canvas for connection lines (behind)
            this.canvasLines = document.createElement('canvas');
            this.canvasLines.classList.add('svg-particle-canvas');
            this.canvasLines.style.zIndex = '0';
            this.containerEl.appendChild(this.canvasLines);
            this.ctxLines = this.canvasLines.getContext('2d');

            // Canvas for bars (front, with goo filter)
            this.canvasBars = document.createElement('canvas');
            this.canvasBars.classList.add('svg-particle-canvas');
            this.canvasBars.style.zIndex = '1';
            this.containerEl.appendChild(this.canvasBars);
            this.ctxBars = this.canvasBars.getContext('2d');

            this.resize();
            window.addEventListener('resize', () => this.resize());
            return true;
        } catch (error) {
            log.error('SvgParticleEngine init error:', error);
            return false;
        }
    }

    resize() {
        if (!this.containerEl) return;
        const w = this.containerEl.offsetWidth;
        const h = this.containerEl.offsetHeight;
        if (this.canvasBars) { this.canvasBars.width = w; this.canvasBars.height = h; }
        if (this.canvasLines) { this.canvasLines.width = w; this.canvasLines.height = h; }
    }

    createBarsForShape(shapeCfg) {
        const bars = [];
        for (let i = 1; i < shapeCfg.count; i++) {
            const hue = shapeCfg.hueStart + i * shapeCfg.hueStep;
            const color = `hsl(${hue % 360}, 100%, 55%)`;
            bars.push(new Bar(0, i * shapeCfg.spacing, 0.5, 0, color, i, shapeCfg));
        }
        return bars;
    }

    async loadSvg(svgUrl) {
        try {
            // Clean up previous
            if (this.svgElement) { this.svgElement.remove(); this.svgElement = null; }

            // Get animal name and config
            const name = svgUrl.split('/').pop().replace('.svg', '');
            const shapeConfigs = ANIMAL_SHAPES[name] || ANIMAL_SHAPES.snail;

            // Create bars for each shape
            this.shapes = shapeConfigs.map(cfg => ({
                config: cfg,
                bars: this.createBarsForShape(cfg),
            }));

            // Load and display SVG
            const response = await fetch(svgUrl);
            if (!response.ok) return false;
            const svgText = await response.text();

            const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
            const svg = doc.querySelector('svg');
            if (!svg) return false;

            svg.style.cssText = `
                position: absolute;
                top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                width: min(280px, 50%);
                height: auto;
                z-index: 2;
                pointer-events: none;
            `;

            // Unique neon gradient per animal
            const SVG_COLORS = {
                snail:      ['#00ffff', '#00bbff', '#0066ff', '#4400ff'],
                fox:        ['#ff44aa', '#ff6b35', '#ffaa00', '#ff4466'],
                owl:        ['#00ffaa', '#00ddff', '#4488ff', '#8844ff'],
                deer:       ['#00bbff', '#00ffdd', '#44ffaa', '#00ff88'],
                moth:       ['#ff88cc', '#ff44aa', '#cc44ff', '#8844ff'],
                seahorse:   ['#00ff88', '#00ffcc', '#00ddff', '#0088ff'],
                bat:        ['#8844ff', '#aa44ff', '#ff44ff', '#ff44aa'],
                chameleon:  ['#44ff44', '#aaff00', '#ffff00', '#ff8800'],
                dinosaur:   ['#00ffaa', '#00aaff', '#4444ff', '#8800ff'],
                anglerfish: ['#ff6600', '#ff4400', '#ff0066', '#aa00ff'],
            };
            const colors = SVG_COLORS[name] || SVG_COLORS.snail;

            const defs = svg.querySelector('defs');
            if (defs) {
                defs.querySelectorAll('linearGradient, radialGradient').forEach(grad => {
                    grad.innerHTML = `
                        <stop offset="0%" stop-color="${colors[0]}"/>
                        <stop offset="30%" stop-color="${colors[1]}"/>
                        <stop offset="60%" stop-color="${colors[2]}"/>
                        <stop offset="100%" stop-color="${colors[3]}"/>
                    `;
                });
            }

            // Stroke-dash animation
            svg.querySelectorAll('path').forEach(p => {
                p.style.strokeDasharray = '1500';
                p.style.strokeDashoffset = '1500';
                p.style.animation = 'svgArtDraw 5s ease-in-out infinite';
            });

            if (!document.getElementById('svg-art-draw-kf')) {
                const style = document.createElement('style');
                style.id = 'svg-art-draw-kf';
                style.textContent = `
                    @keyframes svgArtDraw {
                        0% { stroke-dashoffset: 1500; }
                        50% { stroke-dashoffset: 0; }
                        100% { stroke-dashoffset: -1500; }
                    }
                `;
                document.head.appendChild(style);
            }

            this.containerEl.appendChild(document.importNode(svg, true));
            this.svgElement = this.containerEl.querySelector('svg');
            return true;
        } catch (error) {
            log.error('Error loading SVG:', error);
            return false;
        }
    }

    generateAudio(count) {
        const samples = [];
        for (let i = 0; i < count; i++) {
            const t = i / count;
            const f1 = Math.sin(this.time * 2.0 + t * 12) * 0.35;
            const f2 = Math.sin(this.time * 3.5 + t * 8) * 0.25;
            const f3 = Math.cos(this.time * 1.3 + t * 15) * 0.15;
            const noise = (Math.random() - 0.5) * 0.04;
            const beat1 = Math.pow(Math.max(0, Math.sin(this.time * 1.8)), 10) * 0.5;
            const beat2 = Math.pow(Math.max(0, Math.sin(this.time * 0.7 + 1.2)), 14) * 0.35;

            let value = Math.abs(f1 + f2 + f3 + noise + beat1 + beat2);
            if (i < count * 0.1) value *= 1.6;
            else if (i < count * 0.2) value *= 1.3;

            samples.push(Math.min(value, 1));
        }
        return samples;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate() {
        if (!this.isRunning) return;
        this.animationId = requestAnimationFrame(() => this.animate());

        this.time += 0.018;
        const w = this.canvasBars.width;
        const h = this.canvasBars.height;

        this.ctxBars.clearRect(0, 0, w, h);
        this.ctxLines.clearRect(0, 0, w, h);

        // Draw each shape
        for (const { config, bars } of this.shapes) {
            const ctx = config.layer === 'lines' ? this.ctxLines : this.ctxBars;
            const samples = this.generateAudio(config.count);

            ctx.save();
            ctx.translate(w / 2 + config.cx, h / 2 + config.cy);

            bars.forEach((bar, i) => {
                bar.update(samples[i] || 0);
                bar.draw(ctx);
            });

            ctx.restore();
        }

        // Pulse SVG
        if (this.svgElement) {
            const mainSamples = this.generateAudio(50);
            const avg = mainSamples.reduce((a, b) => a + b, 0) / 50;
            const scale = 1 + avg * 0.4;
            this.svgElement.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
    }

    dispose() {
        this.stop();
        this.svgElement?.remove();
        this.canvasBars?.remove();
        this.canvasLines?.remove();
        this.shapes = [];
    }
}
