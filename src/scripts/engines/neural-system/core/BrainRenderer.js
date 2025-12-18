/**
 * BrainRenderer - Maneja el renderizado Three.js del cerebro
 * Responsable de: Scene, Camera, Renderer, Resize
 * Máximo 250 líneas
 */

import * as THREE from 'three';

export class BrainRenderer {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.animationId = null;

        // Callbacks para el loop de animación
        this.animationCallbacks = [];
    }

    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Container #${this.containerId} not found`);
            return false;
        }

        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupResizeHandler();

        return true;
    }

    setupScene() {
        this.scene = new THREE.Scene();

        // Luz ambiente suave
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        // FOV más amplio para ver el cerebro a los lados
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 30);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        // Estilo del canvas - ocupa toda la pantalla
        const canvas = this.renderer.domElement;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';

        this.container.appendChild(canvas);
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => this.onResize(), { passive: true });
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    // Añadir objeto a la escena
    add(object) {
        this.scene.add(object);
    }

    // Remover objeto de la escena
    remove(object) {
        this.scene.remove(object);
    }

    // Registrar callback de animación
    onAnimate(callback) {
        this.animationCallbacks.push(callback);
    }

    // Iniciar loop de animación
    startAnimation() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);

            const time = performance.now() * 0.001;

            // Ejecutar todos los callbacks registrados
            this.animationCallbacks.forEach(cb => cb(time));

            // Renderizar
            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }

    // Detener animación
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    // Limpiar recursos
    dispose() {
        this.stopAnimation();

        if (this.renderer) {
            this.renderer.dispose();
            this.container?.removeChild(this.renderer.domElement);
        }

        this.scene?.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => m.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }

    // Getters
    getScene() { return this.scene; }
    getCamera() { return this.camera; }
    getRenderer() { return this.renderer; }
}
