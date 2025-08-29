// ===== SISTEMA DE FONDO MODULAR =====

// Importar Three.js como módulo ES6 con Vite
import * as THREE from 'three';

export class BackgroundSystem {
    constructor(scene) {
        this.scene = scene;
        this.background = null;
        this.currentTheme = 'light';
        this.performanceMode = 'high';
        
        this.createBackground();
    }

    createBackground() {
        // Crear estrellas de fondo
        const starGeometry = new THREE.BufferGeometry();
        const starCount = this.performanceMode === 'high' ? 1000 : 500;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        
        for (let i = 0; i < starCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
            
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.1 + 0.6, 0.8, Math.random() * 0.3 + 0.7);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = Math.random() * 3 + 1;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.3
        });
        
        this.background = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.background);
    }

    updateTheme(theme) {
        this.currentTheme = theme;
        
        if (this.background) {
            const isDark = theme === 'dark';
            const baseHue = isDark ? 0.6 : 0.5;
            
            // Actualizar colores de las estrellas
            const colors = this.background.geometry.attributes.color;
            for (let i = 0; i < colors.count; i++) {
                const color = new THREE.Color();
                color.setHSL(
                    baseHue + Math.random() * 0.1,
                    0.8,
                    Math.random() * 0.3 + 0.7
                );
                colors.setXYZ(i, color.r, color.g, color.b);
            }
            colors.needsUpdate = true;
        }
    }

    updateScroll(scrollPercent) {
        if (this.background) {
            // Rotación muy sutil para no distraer
            this.background.rotation.y = scrollPercent * Math.PI * 0.1;
            
            // Movimiento vertical suave
            this.background.position.y = scrollPercent * 50;
        }
    }

    setPerformanceMode(mode) {
        this.performanceMode = mode;
        
        if (mode === 'low') {
            if (this.background) {
                this.background.visible = false;
            }
        } else {
            if (this.background) {
                this.background.visible = true;
            }
        }
    }

    dispose() {
        if (this.background) {
            if (this.background.geometry) {
                this.background.geometry.dispose();
            }
            if (this.background.material) {
                this.background.material.dispose();
            }
            this.scene.remove(this.background);
        }
        
        this.background = null;
    }
}
