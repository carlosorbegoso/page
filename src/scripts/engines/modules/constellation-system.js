// ===== SISTEMA DE CONSTELACIONES MODULAR =====

const THREE = window.THREE;

export class ConstellationSystem {
    constructor(scene) {
        this.scene = scene;
        this.constellations = [];
        this.currentTheme = 'light';
        this.performanceMode = 'high';
        
        this.createConstellations();
    }

    createConstellations() {
        const sectionCount = this.performanceMode === 'high' ? 8 : 6;
        
        for (let i = 0; i < sectionCount; i++) {
            const constellation = {
                stars: [],
                connections: [],
                center: new THREE.Vector3(
                    (Math.random() - 0.5) * 1600,
                    (Math.random() - 0.5) * 1000,
                    (Math.random() - 0.5) * 800
                ),
                section: i,
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            // Crear estrellas para cada sección con patrones más naturales
            const starCount = Math.floor(Math.random() * 6) + 4; // 4-9 estrellas
            const starPositions = [];
            
            for (let j = 0; j < starCount; j++) {
                const star = new THREE.Mesh(
                    new THREE.SphereGeometry(2 + Math.random() * 2, 8, 8),
                    new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.7, 0.6 + Math.random() * 0.3),
                        transparent: true,
                        opacity: 0.6 + Math.random() * 0.3
                    })
                );
                
                // Posición más natural y agrupada
                let position;
                if (j === 0) {
                    // Primera estrella en el centro
                    position = constellation.center.clone();
                } else {
                    // Otras estrellas alrededor del centro
                    const angle = (j / starCount) * Math.PI * 2;
                    const radius = 80 + Math.random() * 120;
                    position = constellation.center.clone().add(
                        new THREE.Vector3(
                            Math.cos(angle) * radius,
                            Math.sin(angle) * radius * 0.5,
                            (Math.random() - 0.5) * 100
                        )
                    );
                }
                
                star.position.copy(position);
                starPositions.push(position);
                constellation.stars.push(star);
                this.scene.add(star);
            }
            
            // Crear conexiones más inteligentes entre estrellas cercanas
            for (let j = 0; j < starPositions.length; j++) {
                for (let k = j + 1; k < starPositions.length; k++) {
                    const distance = starPositions[j].distanceTo(starPositions[k]);
                    
                    // Solo conectar estrellas que estén a una distancia razonable
                    if (distance < 150) {
                        const connection = this.createConnection(
                            starPositions[j],
                            starPositions[k]
                        );
                        constellation.connections.push(connection);
                        this.scene.add(connection);
                    }
                }
            }
            
            this.constellations.push(constellation);
        }
    }

    createConnection(start, end) {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({
            color: 0x64B5F6,
            transparent: true,
            opacity: 0.4
        });
        
        return new THREE.Line(geometry, material);
    }

    animate(time) {
        this.constellations.forEach((constellation, index) => {
            const sectionOffset = constellation.section * 0.4;
            
            constellation.stars.forEach((star, starIndex) => {
                const starOffset = starIndex * 0.3;
                const totalOffset = sectionOffset + starOffset;
                
                // Movimiento vertical más natural
                star.position.y += Math.sin(time + totalOffset) * 0.3;
                
                // Rotación individual
                star.rotation.x += 0.008;
                star.rotation.y += 0.006;
                star.rotation.z += 0.004;
                
                // Efecto de respiración más natural
                const breath = Math.sin(time * 0.8 + totalOffset) * 0.08;
                star.scale.setScalar(1 + breath);
                
                // Efecto de twinkle mejorado
                const twinkle = Math.sin(time * 3 + starIndex * 0.4) * 0.3 + 0.7;
                star.material.opacity = 0.6 + twinkle * 0.3;
                
                // Efecto de color sutil
                const starHue = (time * 0.03 + starIndex * 0.1) % 1;
                const starColor = new THREE.Color().setHSL(starHue, 0.6, 0.7);
                star.material.color.lerp(starColor, 0.003);
            });
            
            // Animar conexiones con flujo de energía
            constellation.connections.forEach((connection, connIndex) => {
                const connectionOffset = connIndex * 0.2;
                const flow = Math.sin(time * 2 + connectionOffset) * 0.3 + 0.7;
                connection.material.opacity = 0.3 + flow * 0.3;
                
                // Efecto de pulso en las conexiones
                const connectionPulse = Math.sin(time * 1.5 + connIndex * 0.2) * 0.15 + 1;
                connection.scale.setScalar(connectionPulse);
            });
        });
    }

    updateTheme(theme) {
        this.currentTheme = theme;
        const isDark = theme === 'dark';
        
        this.constellations.forEach(constellation => {
            constellation.stars.forEach(star => {
                const hue = isDark ? 0.6 : 0.5;
                star.material.color.setHSL(hue, 0.8, 0.7);
            });
        });
    }

    updateScroll(scrollPercent) {
        this.constellations.forEach((constellation, index) => {
            const section = document.querySelectorAll('section')[index];
            if (section) {
                const rect = section.getBoundingClientRect();
                const sectionCenter = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const distance = Math.abs(sectionCenter - viewportCenter);
                const maxDistance = window.innerHeight / 2;
                
                // Calcular visibilidad basada en la distancia al centro
                const visibility = Math.max(0, 1 - distance / maxDistance);
                
                constellation.stars.forEach(star => {
                    // Opacidad suave basada en visibilidad
                    star.material.opacity = 0.3 + (visibility * 0.5);
                    
                    // Escala sutil
                    const scale = 1 + (visibility * 0.1);
                    star.scale.setScalar(scale);
                    
                    // Movimiento de parallax muy sutil
                    star.position.x += (scrollPercent * 0.5) * (Math.random() - 0.5);
                    star.position.y += (scrollPercent * 0.3) * (Math.random() - 0.5);
                });
                
                // Líneas de conexión también se animan
                constellation.connections.forEach(connection => {
                    connection.material.opacity = 0.2 + (visibility * 0.2);
                });
            }
        });
    }

    setPerformanceMode(mode) {
        this.performanceMode = mode;
        
        if (mode === 'low') {
            this.constellations.forEach(constellation => {
                constellation.stars.forEach(star => {
                    star.visible = false;
                });
            });
        } else {
            this.constellations.forEach(constellation => {
                constellation.stars.forEach(star => {
                    star.visible = true;
                });
            });
        }
    }

    dispose() {
        this.constellations.forEach(constellation => {
            constellation.stars.forEach(star => {
                if (star.geometry) {
                    star.geometry.dispose();
                }
                if (star.material) {
                    star.material.dispose();
                }
                this.scene.remove(star);
            });
            
            constellation.connections.forEach(connection => {
                if (connection.geometry) {
                    connection.geometry.dispose();
                }
                if (connection.material) {
                    connection.material.dispose();
                }
                this.scene.remove(connection);
            });
        });
        
        this.constellations = [];
    }
}
