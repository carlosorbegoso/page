// ===== SISTEMA DE PARTÍCULAS MODULAR =====
import * as THREE from 'three';

export class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.currentTheme = 'light';
        this.performanceMode = 'high';
        
        this.createParticles();
    }

    createParticles() {
        const particleCount = this.performanceMode === 'high' ? 80 : 40;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                mesh: new THREE.Mesh(
                    new THREE.SphereGeometry(1 + Math.random() * 2, 8, 8),
                    new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.6, 0.8, 0.7 + Math.random() * 0.3),
                        transparent: true,
                        opacity: 0.3 + Math.random() * 0.4
                    })
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 1.5,
                    (Math.random() - 0.5) * 2
                ),
                life: Math.random() * 120 + 60,
                maxLife: Math.random() * 120 + 60,
                originalPosition: new THREE.Vector3(),
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                pulseSpeed: Math.random() * 0.05 + 0.02
            };
            
            // Posición inicial en forma de espiral
            const angle = (i / particleCount) * Math.PI * 4;
            const radius = 200 + Math.random() * 600;
            const height = (Math.random() - 0.5) * 800;
            
            particle.mesh.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            particle.originalPosition.copy(particle.mesh.position);
            this.particles.push(particle);
            this.scene.add(particle.mesh);
        }
    }

    animate(time) {
        this.particles.forEach((particle, index) => {
            // Movimiento más suave con física mejorada
            particle.mesh.position.add(particle.velocity);
            particle.life--;
            
            // Resetear partícula cuando se acaba su vida
            if (particle.life <= 0) {
                particle.life = particle.maxLife;
                particle.mesh.position.copy(particle.originalPosition);
                
                // Añadir variación sutil a la posición original
                particle.mesh.position.add(new THREE.Vector3(
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 100
                ));
            }
            
            // Efecto de respiración mejorado
            const breath = Math.sin(time * particle.pulseSpeed + index * 0.1) * 0.1;
            const scale = 1 + breath;
            particle.mesh.scale.setScalar(scale);
            
            // Variar opacidad con transición suave
            particle.mesh.material.opacity = 0.5 + Math.sin(time + particle.life * 0.05) * 0.2;
            
            // Efecto de color dinámico sutil
            const hue = (time * 0.05 + index * 0.01) % 1;
            const color = new THREE.Color().setHSL(hue, 0.7, 0.6);
            particle.mesh.material.color.lerp(color, 0.005);
        });
    }

    updateTheme(theme) {
        this.currentTheme = theme;
        const isDark = theme === 'dark';
        
        this.particles.forEach(particle => {
            const hue = isDark ? 0.6 : 0.5;
            particle.mesh.material.color.setHSL(hue, 0.8, 0.7);
        });
    }

    updateScroll(scrollPercent) {
        this.particles.forEach(particle => {
            const depth = scrollPercent * 100;
            particle.mesh.position.z = particle.mesh.position.z + (depth * 0.01);
            
            // Resetear posición cuando se sale del rango
            if (particle.mesh.position.z > 1000) {
                particle.mesh.position.z = -1000;
            }
        });
    }

    setPerformanceMode(mode) {
        this.performanceMode = mode;
        
        if (mode === 'low') {
            this.particles.forEach(particle => {
                particle.mesh.visible = false;
            });
        } else {
            this.particles.forEach(particle => {
                particle.mesh.visible = true;
            });
        }
    }

    dispose() {
        this.particles.forEach(particle => {
            if (particle.mesh.geometry) {
                particle.mesh.geometry.dispose();
            }
            if (particle.mesh.material) {
                particle.mesh.material.dispose();
            }
            this.scene.remove(particle.mesh);
        });
        
        this.particles = [];
    }
}
