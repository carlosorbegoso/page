/**
 * Connected Particles Engine - Interactive particle network
 * Inspired by Frank's Laboratory particle systems
 * Particles connect when nearby and react to mouse/touch interaction
 * Built with Three.js for GPU-accelerated performance
 */

import * as THREE from 'three';
import { log } from '../utils/logger.js';

export class ConnectedParticlesEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.linesMesh = null;
        this.pointsMesh = null;
        this.animationId = null;
        this.isInitialized = false;
        this.container = null;
        this.time = 0;

        // Mouse/touch state
        this.mouse = { x: 0, y: 0, pressed: false, radius: 150 };
        this.mouseWorld = new THREE.Vector2(9999, 9999);

        // Device detection
        this.isMobile = window.innerWidth <= 768;
        this.isLowPower = window.innerWidth <= 480 ||
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

        const quality = this.isLowPower ? 0.3 : (this.isMobile ? 0.5 : 1);

        this.config = {
            particleCount: Math.floor(200 * quality),
            maxConnectionDistance: 100,
            mouseRadius: this.isMobile ? 120 : 180,
            friction: 0.95,
            baseSpeed: 0.3,
            connectionOpacity: 0.6,
            particleMinRadius: 1.5,
            particleMaxRadius: 5,
        };

        // Neural color palette matching the portfolio theme
        this.colors = {
            gradientStart: new THREE.Color(0xffffff),
            gradientMid: new THREE.Color(0x64B5F6),    // neural-primary
            gradientEnd: new THREE.Color(0x00ffff),     // neural-cyan
            line: new THREE.Color(0x64B5F6),
        };
    }

    async init(containerId = 'hero-particles') {
        try {
            this.setupScene();
            this.setupCamera();
            this.setupRenderer(containerId);

            if (!this.renderer) return false;

            this.createParticles();
            this.createConnectionLines();
            this.setupEventListeners();
            this.animate();

            this.isInitialized = true;
            return true;
        } catch (error) {
            log.error('ConnectedParticlesEngine init error:', error);
            return false;
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupCamera() {
        // Use orthographic camera for a 2D-like feel matching the canvas approach
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera = new THREE.OrthographicCamera(0, w, 0, h, -100, 100);
        this.camera.position.z = 50;
    }

    setupRenderer(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            log.warn(`ConnectedParticles: container #${containerId} not found`);
            return;
        }

        this.renderer = new THREE.WebGLRenderer({
            antialias: !this.isMobile,
            alpha: true,
            powerPreference: this.isMobile ? 'low-power' : 'high-performance'
        });

        const width = container.offsetWidth || window.innerWidth;
        const height = container.offsetHeight || window.innerHeight;

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
        this.renderer.setClearColor(0x000000, 0);

        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '2';
        this.renderer.domElement.style.pointerEvents = 'none';

        container.appendChild(this.renderer.domElement);
        this.container = container;
        this.width = width;
        this.height = height;
    }

    createParticles() {
        const count = this.config.particleCount;

        for (let i = 0; i < count; i++) {
            const radius = this.config.particleMinRadius +
                Math.random() * (this.config.particleMaxRadius - this.config.particleMinRadius);

            this.particles.push({
                x: radius + Math.random() * (this.width - radius * 2),
                y: radius + Math.random() * (this.height - radius * 2),
                vx: (Math.random() - 0.5) * this.config.baseSpeed,
                vy: (Math.random() - 0.5) * this.config.baseSpeed,
                pushX: 0,
                pushY: 0,
                radius: radius,
            });
        }

        // Create point geometry for particles
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const colorAttrib = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const p = this.particles[i];
            positions[i * 3] = p.x;
            positions[i * 3 + 1] = p.y;
            positions[i * 3 + 2] = 0;
            sizes[i] = p.radius * 2;

            // Gradient color based on position (matching portfolio neural theme)
            const t = i / count;
            const color = new THREE.Color();
            if (t < 0.5) {
                color.copy(this.colors.gradientStart).lerp(this.colors.gradientMid, t * 2);
            } else {
                color.copy(this.colors.gradientMid).lerp(this.colors.gradientEnd, (t - 0.5) * 2);
            }
            colorAttrib[i * 3] = color.r;
            colorAttrib[i * 3 + 1] = color.g;
            colorAttrib[i * 3 + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colorAttrib, 3));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                pixelRatio: { value: this.renderer.getPixelRatio() },
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                uniform float pixelRatio;
                varying vec3 vColor;

                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pixelRatio;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Soft circular gradient
                    float alpha = smoothstep(0.5, 0.15, dist) * 0.85;
                    // Subtle glow
                    vec3 finalColor = vColor + vec3(0.15) * smoothstep(0.5, 0.0, dist);

                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.pointsMesh = new THREE.Points(geometry, material);
        this.scene.add(this.pointsMesh);
    }

    createConnectionLines() {
        // Pre-allocate maximum possible lines (every pair) - but we'll only use a fraction
        const maxLines = this.config.particleCount * 6; // avg ~6 connections per particle
        const positions = new Float32Array(maxLines * 6); // 2 vertices * 3 components
        const colors = new Float32Array(maxLines * 6);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setDrawRange(0, 0);

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: this.config.connectionOpacity,
        });

        this.linesMesh = new THREE.LineSegments(geometry, material);
        this.scene.add(this.linesMesh);
    }

    setupEventListeners() {
        // Pointer events for unified mouse/touch handling
        const onPointerMove = (x, y) => {
            this.mouse.x = x;
            this.mouse.y = y;
            this.mouseWorld.set(x, y);
        };

        window.addEventListener('mousemove', (e) => {
            if (this.mouse.pressed) {
                onPointerMove(e.clientX, e.clientY);
            }
        });

        window.addEventListener('mousedown', (e) => {
            this.mouse.pressed = true;
            onPointerMove(e.clientX, e.clientY);
        });

        window.addEventListener('mouseup', () => {
            this.mouse.pressed = false;
        });

        // Touch support
        window.addEventListener('touchstart', (e) => {
            this.mouse.pressed = true;
            if (e.touches.length > 0) {
                onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            this.mouse.pressed = false;
        });

        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        if (!this.renderer || !this.container) return;

        const width = this.container.offsetWidth || window.innerWidth;
        const height = this.container.offsetHeight || window.innerHeight;

        this.camera.right = width;
        this.camera.bottom = height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);

        // Reset particles to new bounds
        this.width = width;
        this.height = height;
        this.particles.forEach(p => {
            p.x = p.radius + Math.random() * (width - p.radius * 2);
            p.y = p.radius + Math.random() * (height - p.radius * 2);
        });
    }

    updateParticles() {
        const friction = this.config.friction;
        const mouseRadius = this.config.mouseRadius;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Mouse repulsion (only when pressed)
            if (this.mouse.pressed) {
                const dx = p.x - this.mouseWorld.x;
                const dy = p.y - this.mouseWorld.y;
                const distance = Math.hypot(dx, dy);

                if (distance < mouseRadius) {
                    const force = mouseRadius / distance;
                    const angle = Math.atan2(dy, dx);
                    p.pushX += Math.cos(angle) * force;
                    p.pushY += Math.sin(angle) * force;
                }
            }

            // Apply push with friction + constant velocity
            p.x += (p.pushX *= friction) + p.vx;
            p.y += (p.pushY *= friction) + p.vy;

            // Bounce off edges
            if (p.x < p.radius) { p.x = p.radius; p.vx *= -1; }
            else if (p.x > this.width - p.radius) { p.x = this.width - p.radius; p.vx *= -1; }
            if (p.y < p.radius) { p.y = p.radius; p.vy *= -1; }
            else if (p.y > this.height - p.radius) { p.y = this.height - p.radius; p.vy *= -1; }
        }

        // Update point positions
        const posAttr = this.pointsMesh.geometry.attributes.position;
        for (let i = 0; i < this.particles.length; i++) {
            posAttr.array[i * 3] = this.particles[i].x;
            posAttr.array[i * 3 + 1] = this.particles[i].y;
        }
        posAttr.needsUpdate = true;
    }

    updateConnections() {
        const maxDist = this.config.maxConnectionDistance;
        const positions = this.linesMesh.geometry.attributes.position.array;
        const colors = this.linesMesh.geometry.attributes.color.array;
        let lineIndex = 0;
        const maxLines = positions.length / 6;

        const lineColor = this.colors.line;

        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a + 1; b < this.particles.length; b++) {
                if (lineIndex >= maxLines) break;

                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);

                if (distance < maxDist) {
                    const opacity = 1 - (distance / maxDist);
                    const idx = lineIndex * 6;

                    // Vertex A
                    positions[idx] = this.particles[a].x;
                    positions[idx + 1] = this.particles[a].y;
                    positions[idx + 2] = 0;
                    // Vertex B
                    positions[idx + 3] = this.particles[b].x;
                    positions[idx + 4] = this.particles[b].y;
                    positions[idx + 5] = 0;

                    // Colors with opacity baked in
                    colors[idx] = lineColor.r * opacity;
                    colors[idx + 1] = lineColor.g * opacity;
                    colors[idx + 2] = lineColor.b * opacity;
                    colors[idx + 3] = lineColor.r * opacity;
                    colors[idx + 4] = lineColor.g * opacity;
                    colors[idx + 5] = lineColor.b * opacity;

                    lineIndex++;
                }
            }
            if (lineIndex >= maxLines) break;
        }

        this.linesMesh.geometry.setDrawRange(0, lineIndex * 2);
        this.linesMesh.geometry.attributes.position.needsUpdate = true;
        this.linesMesh.geometry.attributes.color.needsUpdate = true;
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        if (!this.isInitialized) return;

        this.time += 0.016;
        this.updateParticles();
        this.updateConnections();
        this.renderer.render(this.scene, this.camera);
    }

    updateTheme(theme) {
        if (theme === 'light') {
            this.colors.gradientStart.set(0x333333);
            this.colors.gradientMid.set(0x1565C0);
            this.colors.gradientEnd.set(0x0097A7);
            this.colors.line.set(0x1565C0);
        } else {
            this.colors.gradientStart.set(0xffffff);
            this.colors.gradientMid.set(0x64B5F6);
            this.colors.gradientEnd.set(0x00ffff);
            this.colors.line.set(0x64B5F6);
        }

        // Update particle colors
        if (this.pointsMesh) {
            const colorAttr = this.pointsMesh.geometry.attributes.color;
            for (let i = 0; i < this.particles.length; i++) {
                const t = i / this.particles.length;
                const color = new THREE.Color();
                if (t < 0.5) {
                    color.copy(this.colors.gradientStart).lerp(this.colors.gradientMid, t * 2);
                } else {
                    color.copy(this.colors.gradientMid).lerp(this.colors.gradientEnd, (t - 0.5) * 2);
                }
                colorAttr.array[i * 3] = color.r;
                colorAttr.array[i * 3 + 1] = color.g;
                colorAttr.array[i * 3 + 2] = color.b;
            }
            colorAttr.needsUpdate = true;
        }
    }

    dispose() {
        if (this.animationId) cancelAnimationFrame(this.animationId);

        if (this.pointsMesh) {
            this.pointsMesh.geometry.dispose();
            this.pointsMesh.material.dispose();
        }

        if (this.linesMesh) {
            this.linesMesh.geometry.dispose();
            this.linesMesh.material.dispose();
        }

        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement?.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.isInitialized = false;
    }
}
