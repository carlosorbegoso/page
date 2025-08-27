// ===== EFECTOS AVANZADOS DE THREE.JS =====

import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';

class AdvancedThreeEffects {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.objects = [];
        this.clock = new THREE.Clock();
        
        this.init();
    }

    init() {
        this.createFloatingGeometries();
        this.createAdvancedParticles();
        this.createDistortionEffects();
        this.createPostProcessing();
        this.createInteractiveElements();
        this.createScrollEffects();
    }

    // ===== GEOMETRÍAS 3D FLOTANTES =====
    createFloatingGeometries() {
        const geometries = [
            new THREE.TorusGeometry(2, 0.5, 16, 100),
            new THREE.OctahedronGeometry(1.5),
            new THREE.DodecahedronGeometry(1.2),
            new THREE.TetrahedronGeometry(1.8)
        ];

        const materials = [
            new THREE.MeshPhongMaterial({ 
                color: 0x2C5AA0, 
                transparent: true, 
                opacity: 0.3,
                wireframe: true 
            }),
            new THREE.MeshPhongMaterial({ 
                color: 0xFF6B35, 
                transparent: true, 
                opacity: 0.3,
                wireframe: true 
            }),
            new THREE.MeshPhongMaterial({ 
                color: 0x4285F4, 
                transparent: true, 
                opacity: 0.3,
                wireframe: true 
            }),
            new THREE.MeshPhongMaterial({ 
                color: 0x6DB33F, 
                transparent: true, 
                opacity: 0.3,
                wireframe: true 
            })
        ];

        geometries.forEach((geometry, index) => {
            const mesh = new THREE.Mesh(geometry, materials[index]);
            
            // Posicionar aleatoriamente
            mesh.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            
            // Rotación inicial aleatoria
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            // Agregar a la escena
            this.scene.add(mesh);
            this.objects.push({
                mesh: mesh,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.01 + 0.005,
                floatOffset: Math.random() * Math.PI * 2
            });
        });
    }

    // ===== SISTEMA DE PARTÍCULAS AVANZADO =====
    createAdvancedParticles() {
        // Partículas de conexión (network effect)
        const networkGeometry = new THREE.BufferGeometry();
        const networkCount = 200;
        const positions = new Float32Array(networkCount * 3);
        const colors = new Float32Array(networkCount * 3);
        const sizes = new Float32Array(networkCount);

        for (let i = 0; i < networkCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

            // Colores del tema
            const themeColors = [0x2C5AA0, 0xFF6B35, 0x4285F4, 0x6DB33F];
            const color = new THREE.Color(themeColors[Math.floor(Math.random() * themeColors.length)]);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 3 + 1;
        }

        networkGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        networkGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        networkGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const networkMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.networkParticles = new THREE.Points(networkGeometry, networkMaterial);
        this.scene.add(this.networkParticles);

        // Crear líneas de conexión
        this.createConnectionLines();
    }

    createConnectionLines() {
        const lineGeometry = new THREE.BufferGeometry();
        const lineCount = 50;
        const linePositions = [];

        for (let i = 0; i < lineCount; i++) {
            const start = new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            
            const end = new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );

            linePositions.push(start.x, start.y, start.z);
            linePositions.push(end.x, end.y, end.z);
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x2C5AA0,
            transparent: true,
            opacity: 0.2
        });

        this.connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.connectionLines);
    }

    // ===== EFECTOS DE DISTORSIÓN =====
    createDistortionEffects() {
        // Crear plano de distorsión
        const distortionGeometry = new THREE.PlaneGeometry(30, 30, 32, 32);
        const distortionMaterial = new THREE.MeshPhongMaterial({
            color: 0x2C5AA0,
            transparent: true,
            opacity: 0.1,
            wireframe: true,
            side: THREE.DoubleSide
        });

        this.distortionPlane = new THREE.Mesh(distortionGeometry, distortionMaterial);
        this.distortionPlane.rotation.x = -Math.PI / 2;
        this.distortionPlane.position.y = -8;
        this.scene.add(this.distortionPlane);
    }

    // ===== POST-PROCESSING AVANZADO =====
    createPostProcessing() {
        // Efecto de bloom
        this.createBloomEffect();
        
        // Efecto de distorsión de lente
        this.createLensDistortion();
        
        // Efecto de aberración cromática
        this.createChromaticAberration();
    }

    createBloomEffect() {
        // Simular bloom con múltiples render passes
        this.bloomPasses = [];
        
        for (let i = 0; i < 3; i++) {
            const bloomMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.1 - (i * 0.03)
            });
            
            const bloomGeometry = new THREE.SphereGeometry(0.5 + (i * 0.2), 16, 16);
            const bloomMesh = new THREE.Mesh(bloomGeometry, bloomMaterial);
            
            bloomMesh.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            
            this.scene.add(bloomMesh);
            this.bloomPasses.push(bloomMesh);
        }
    }

    createLensDistortion() {
        // Efecto de distorsión de lente con shader personalizado
        const distortionShader = {
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec2 vUv;
                
                void main() {
                    vec2 uv = vUv - 0.5;
                    float dist = length(uv);
                    float distortion = sin(dist * 10.0 - time * 2.0) * 0.1;
                    uv += uv * distortion;
                    uv += 0.5;
                    
                    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
                        discard;
                    }
                    
                    gl_FragColor = vec4(0.1, 0.3, 0.6, 0.1);
                }
            `
        };

        const distortionMaterial = new THREE.ShaderMaterial({
            vertexShader: distortionShader.vertexShader,
            fragmentShader: distortionShader.fragmentShader,
            uniforms: {
                time: { value: 0 }
            },
            transparent: true,
            side: THREE.DoubleSide
        });

        const distortionGeometry = new THREE.PlaneGeometry(40, 40, 64, 64);
        this.lensDistortion = new THREE.Mesh(distortionGeometry, distortionMaterial);
        this.lensDistortion.rotation.x = -Math.PI / 2;
        this.lensDistortion.position.y = -12;
        this.scene.add(this.lensDistortion);
    }

    createChromaticAberration() {
        // Simular aberración cromática con múltiples planos
        const colors = [0xff0000, 0x00ff00, 0x0000ff];
        const offsets = [0.01, 0.005, 0.02];
        
        colors.forEach((color, index) => {
            const aberrationMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.05
            });
            
            const aberrationGeometry = new THREE.PlaneGeometry(35, 35, 16, 16);
            const aberrationMesh = new THREE.Mesh(aberrationGeometry, aberrationMaterial);
            
            aberrationMesh.rotation.x = -Math.PI / 2;
            aberrationMesh.position.y = -10 + (index * 0.1);
            aberrationMesh.position.x = offsets[index];
            
            this.scene.add(aberrationMesh);
        });
    }

    // ===== ELEMENTOS INTERACTIVOS =====
    createInteractiveElements() {
        // Esferas interactivas que siguen el mouse
        for (let i = 0; i < 5; i++) {
            const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const sphereMaterial = new THREE.MeshPhongMaterial({
                color: 0x2C5AA0,
                transparent: true,
                opacity: 0.6,
                emissive: 0x2C5AA0,
                emissiveIntensity: 0.2
            });
            
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            
            this.scene.add(sphere);
            this.objects.push({
                mesh: sphere,
                type: 'interactive',
                targetPosition: sphere.position.clone()
            });
        }
    }

    // ===== EFECTOS DE SCROLL =====
    createScrollEffects() {
        // Crear elementos que reaccionan al scroll
        this.scrollElements = [];
        
        for (let i = 0; i < 8; i++) {
            const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            const material = new THREE.MeshPhongMaterial({
                color: 0xFF6B35,
                transparent: true,
                opacity: 0.4
            });
            
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25
            );
            
            this.scene.add(cube);
            this.scrollElements.push({
                mesh: cube,
                basePosition: cube.position.clone(),
                scrollOffset: Math.random() * Math.PI * 2
            });
        }
    }

    // ===== ANIMACIONES AVANZADAS =====
    animate() {
        const time = this.clock.getElapsedTime();
        
        // Animar geometrías flotantes
        this.objects.forEach(obj => {
            if (obj.mesh && obj.type !== 'interactive') {
                // Rotación
                obj.mesh.rotation.x += obj.rotationSpeed.x;
                obj.mesh.rotation.y += obj.rotationSpeed.y;
                obj.mesh.rotation.z += obj.rotationSpeed.z;
                
                // Flotación
                obj.mesh.position.y += Math.sin(time * obj.floatSpeed + obj.floatOffset) * 0.01;
            }
        });

        // Animar partículas de red
        if (this.networkParticles) {
            this.networkParticles.rotation.y += 0.001;
            this.networkParticles.rotation.x += 0.0005;
        }

        // Animar líneas de conexión
        if (this.connectionLines) {
            this.connectionLines.rotation.y += 0.002;
        }

        // Animar plano de distorsión
        if (this.distortionPlane) {
            const vertices = this.distortionPlane.geometry.attributes.position.array;
            for (let i = 0; i < vertices.length; i += 3) {
                vertices[i + 2] = Math.sin(time + vertices[i] * 0.3) * 0.3;
            }
            this.distortionPlane.geometry.attributes.position.needsUpdate = true;
        }

        // Animar efectos de bloom
        this.bloomPasses.forEach((bloom, index) => {
            bloom.position.y += Math.sin(time + index) * 0.01;
            bloom.rotation.y += 0.01;
        });

        // Animar distorsión de lente
        if (this.lensDistortion && this.lensDistortion.material.uniforms) {
            this.lensDistortion.material.uniforms.time.value = time;
        }

        // Animar elementos interactivos
        this.objects.forEach(obj => {
            if (obj.type === 'interactive') {
                // Mover hacia la posición del mouse
                const mouseVector = new THREE.Vector3(
                    (this.mouseX || 0) * 10,
                    -(this.mouseY || 0) * 10,
                    0
                );
                
                obj.targetPosition.lerp(mouseVector, 0.02);
                obj.mesh.position.lerp(obj.targetPosition, 0.05);
                
                // Cambiar color según la distancia al mouse
                const distance = obj.mesh.position.distanceTo(mouseVector);
                const intensity = Math.max(0, 1 - distance / 10);
                obj.mesh.material.emissiveIntensity = intensity * 0.5;
            }
        });

        // Animar elementos de scroll
        this.scrollElements.forEach(element => {
            const scrollPercent = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
            const scrollOffset = scrollPercent * Math.PI * 2 + element.scrollOffset;
            
            element.mesh.position.y = element.basePosition.y + Math.sin(scrollOffset) * 2;
            element.mesh.rotation.y = scrollOffset * 2;
        });
    }

    // ===== INTERACCIÓN CON EL MOUSE =====
    updateMousePosition(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }

    // ===== LIMPIEZA =====
    dispose() {
        this.objects.forEach(obj => {
            if (obj.mesh) {
                obj.mesh.geometry.dispose();
                obj.mesh.material.dispose();
            }
        });
        
        if (this.networkParticles) {
            this.networkParticles.geometry.dispose();
            this.networkParticles.material.dispose();
        }
        
        if (this.connectionLines) {
            this.connectionLines.geometry.dispose();
            this.connectionLines.material.dispose();
        }
        
        if (this.distortionPlane) {
            this.distortionPlane.geometry.dispose();
            this.distortionPlane.material.dispose();
        }
        
        if (this.lensDistortion) {
            this.lensDistortion.geometry.dispose();
            this.lensDistortion.material.dispose();
        }
        
        this.bloomPasses.forEach(bloom => {
            bloom.geometry.dispose();
            bloom.material.dispose();
        });
        
        this.scrollElements.forEach(element => {
            element.mesh.geometry.dispose();
            element.mesh.material.dispose();
        });
    }
}

export default AdvancedThreeEffects;
