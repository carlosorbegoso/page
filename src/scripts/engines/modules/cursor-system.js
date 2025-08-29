// ===== SISTEMA DE CURSOR MODULAR =====

// Importar Three.js como módulo ES6 con Vite
import * as THREE from 'three';

export class CursorSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.cursor = null;
        this.cursorTrail = [];
        this.currentTheme = 'light';
        this.performanceMode = 'high';
        
        this.createCursor();
    }

    createCursor() {
        const cursorGeometry = new THREE.SphereGeometry(8, 16, 16);
        const cursorMaterial = new THREE.MeshBasicMaterial({
            color: 0x64B5F6,
            transparent: true,
            opacity: 0.8
        });
        
        this.cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
        this.scene.add(this.cursor);
        
        // Trail de partículas
        this.cursorTrail = [];
        for (let i = 0; i < 10; i++) {
            const trailParticle = new THREE.Mesh(
                new THREE.SphereGeometry(4, 8, 8),
                new THREE.MeshBasicMaterial({
                    color: 0x64B5F6,
                    transparent: true,
                    opacity: 0.3
                })
            );
            this.cursorTrail.push(trailParticle);
            this.scene.add(trailParticle);
        }
    }

    updatePosition(clientX, clientY) {
        if (!this.cursor || !this.camera) return;
        
        try {
            const mouse = new THREE.Vector2();
            mouse.x = (clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(clientY / window.innerHeight) * 2 + 1;
            
            const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject(this.camera);
            const dir = vector.sub(this.camera.position).normalize();
            const distance = -this.camera.position.z / dir.z;
            const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
            
            this.cursor.position.copy(pos);
            
            // Actualizar trail
            this.updateCursorTrail(pos);
        } catch (error) {
            console.warn('⚠️ Error actualizando posición del cursor:', error);
        }
    }

    updateCursorTrail(cursorPos) {
        this.cursorTrail.forEach((particle, index) => {
            const delay = index * 0.1;
            const targetPos = cursorPos.clone();
            targetPos.add(new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                0
            ));
            
            particle.position.lerp(targetPos, 0.1);
            particle.material.opacity = 0.3 * (1 - index / this.cursorTrail.length);
        });
    }

    createClickEffect(x, y) {
        if (!this.camera) return;
        
        try {
            const mouse = new THREE.Vector2();
            mouse.x = (x / window.innerWidth) * 2 - 1;
            mouse.y = -(y / window.innerHeight) * 2 + 1;
            
            const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject(this.camera);
            const dir = vector.sub(this.camera.position).normalize();
            const distance = -this.camera.position.z / dir.z;
            const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
            
            // Crear explosión de partículas
            for (let i = 0; i < 20; i++) {
                const particle = new THREE.Mesh(
                    new THREE.SphereGeometry(2, 8, 8),
                    new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.6, 0.8, 0.7),
                        transparent: true,
                        opacity: 0.8
                    })
                );
                
                particle.position.copy(pos);
                particle.velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10
                );
                particle.life = 60;
                
                this.scene.add(particle);
                
                // Remover después de un tiempo
                setTimeout(() => {
                    this.scene.remove(particle);
                }, 1000);
            }
        } catch (error) {
            console.warn('⚠️ Error creando efecto de click:', error);
        }
    }

    animate(time) {
        if (this.cursor) {
            this.cursor.rotation.y += 0.03;
            this.cursor.rotation.x += 0.01;
            this.cursor.material.opacity = 0.7 + Math.sin(time * 4) * 0.2;
            
            // Efecto de color dinámico en el cursor
            const cursorHue = (time * 0.2) % 1;
            const cursorColor = new THREE.Color().setHSL(cursorHue, 0.8, 0.7);
            this.cursor.material.color.lerp(cursorColor, 0.01);
        }
    }

    updateTheme(theme) {
        this.currentTheme = theme;
        const isDark = theme === 'dark';
        
        if (this.cursor) {
            this.cursor.material.color.setHex(isDark ? 0x64B5F6 : 0x1976D2);
        }
        
        this.cursorTrail.forEach(particle => {
            particle.material.color.setHex(isDark ? 0x64B5F6 : 0x1976D2);
        });
    }

    setPerformanceMode(mode) {
        this.performanceMode = mode;
        
        if (mode === 'low') {
            if (this.cursor) {
                this.cursor.visible = false;
            }
            this.cursorTrail.forEach(particle => {
                particle.visible = false;
            });
        } else {
            if (this.cursor) {
                this.cursor.visible = true;
            }
            this.cursorTrail.forEach(particle => {
                particle.visible = true;
            });
        }
    }

    dispose() {
        if (this.cursor) {
            if (this.cursor.geometry) {
                this.cursor.geometry.dispose();
            }
            if (this.cursor.material) {
                this.cursor.material.dispose();
            }
            this.scene.remove(this.cursor);
        }
        
        this.cursorTrail.forEach(particle => {
            if (particle.geometry) {
                particle.geometry.dispose();
            }
            if (particle.material) {
                particle.material.dispose();
            }
            this.scene.remove(particle);
        });
        
        this.cursor = null;
        this.cursorTrail = [];
    }
}
