// ===== SISTEMA DE PARTÍCULAS DE TEXTO 3D =====

import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';

class TextParticles {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.particles = [];
        this.texts = [];
        this.currentTextIndex = 0;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.createTexts();
        this.createParticleSystem();
        this.animate();
    }

    createTexts() {
        this.texts = [
            "JAVA",
            "SPRING",
            "QUARKUS",
            "BACKEND",
            "DEVELOPER",
            "MICROSERVICES",
            "CLOUD",
            "DEVOPS"
        ];
    }

    createParticleSystem() {
        // Crear geometría para partículas de texto
        this.textGeometry = new THREE.BufferGeometry();
        this.textMaterial = new THREE.PointsMaterial({
            size: 0.3,
            color: 0x2C5AA0,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.textParticles = new THREE.Points(this.textGeometry, this.textMaterial);
        this.scene.add(this.textParticles);

        // Crear partículas iniciales
        this.createTextParticles(this.texts[0]);
    }

    createTextParticles(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;

        // Configurar contexto
        context.fillStyle = 'white';
        context.font = 'bold 80px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Dibujar texto
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        // Obtener datos de píxeles
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Crear partículas donde hay píxeles
        const positions = [];
        const colors = [];
        const sizes = [];

        for (let y = 0; y < canvas.height; y += 4) {
            for (let x = 0; x < canvas.width; x += 4) {
                const index = (y * canvas.width + x) * 4;
                const alpha = data[index + 3];

                if (alpha > 128) {
                    // Posición 3D
                    const posX = (x - canvas.width / 2) * 0.05;
                    const posY = (canvas.height / 2 - y) * 0.05;
                    const posZ = (Math.random() - 0.5) * 2;

                    positions.push(posX, posY, posZ);

                    // Color basado en la posición
                    const hue = (x / canvas.width) * 0.3 + 0.6; // Azul a verde
                    const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
                    colors.push(color.r, color.g, color.b);

                    // Tamaño aleatorio
                    sizes.push(Math.random() * 0.5 + 0.2);
                }
            }
        }

        // Actualizar geometría
        this.textGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.textGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        this.textGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        // Guardar posiciones objetivo
        this.targetPositions = new Float32Array(positions);
        this.initialPositions = new Float32Array(positions);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.isAnimating) {
            this.animateTextTransition();
        } else {
            this.animateIdle();
        }
    }

    animateIdle() {
        const time = Date.now() * 0.001;
        const positions = this.textGeometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            // Movimiento suave de flotación
            positions[i + 1] += Math.sin(time + i * 0.1) * 0.001;
            positions[i + 2] += Math.cos(time + i * 0.1) * 0.001;
        }

        this.textGeometry.attributes.position.needsUpdate = true;

        // Rotación suave
        this.textParticles.rotation.y += 0.001;
    }

    animateTextTransition() {
        const positions = this.textGeometry.attributes.position.array;
        const targetPositions = this.targetPositions;
        let allInPlace = true;

        for (let i = 0; i < positions.length; i += 3) {
            const targetX = targetPositions[i];
            const targetY = targetPositions[i + 1];
            const targetZ = targetPositions[i + 2];

            // Mover hacia la posición objetivo
            positions[i] += (targetX - positions[i]) * 0.05;
            positions[i + 1] += (targetY - positions[i + 1]) * 0.05;
            positions[i + 2] += (targetZ - positions[i + 2]) * 0.05;

            // Verificar si está cerca del objetivo
            const distance = Math.sqrt(
                Math.pow(targetX - positions[i], 2) +
                Math.pow(targetY - positions[i + 1], 2) +
                Math.pow(targetZ - positions[i + 2], 2)
            );

            if (distance > 0.01) {
                allInPlace = false;
            }
        }

        this.textGeometry.attributes.position.needsUpdate = true;

        if (allInPlace) {
            this.isAnimating = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            
            // Cambiar al siguiente texto después de un delay
            setTimeout(() => {
                this.changeText(this.texts[this.currentTextIndex]);
            }, 2000);
        }
    }

    changeText(newText) {
        this.isAnimating = true;
        
        // Crear nuevas partículas para el nuevo texto
        this.createTextParticles(newText);
        
        // Animar transición
        this.animateTextTransition();
    }

    // Efecto de explosión
    explode() {
        const positions = this.textGeometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 10 + 5;
            
            this.targetPositions[i] = Math.cos(angle) * radius;
            this.targetPositions[i + 1] = Math.sin(angle) * radius;
            this.targetPositions[i + 2] = (Math.random() - 0.5) * 10;
        }
        
        this.isAnimating = true;
    }

    // Efecto de implosión
    implode() {
        const positions = this.textGeometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            this.targetPositions[i] = 0;
            this.targetPositions[i + 1] = 0;
            this.targetPositions[i + 2] = 0;
        }
        
        this.isAnimating = true;
    }

    // Cambiar color del texto
    changeColor(color) {
        this.textMaterial.color.setHex(color);
    }

    // Cambiar tamaño de partículas
    changeSize(size) {
        this.textMaterial.size = size;
    }

    // Efecto de ondas
    createWaveEffect() {
        const time = Date.now() * 0.001;
        const positions = this.textGeometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const wave = Math.sin(time + positions[i] * 0.5) * 0.5;
            positions[i + 1] += wave * 0.01;
        }
        
        this.textGeometry.attributes.position.needsUpdate = true;
    }

    // Efecto de espiral
    createSpiralEffect() {
        const time = Date.now() * 0.001;
        const positions = this.textGeometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const angle = time + i * 0.1;
            const radius = 2 + Math.sin(time + i * 0.05) * 0.5;
            
            positions[i] = Math.cos(angle) * radius;
            positions[i + 2] = Math.sin(angle) * radius;
        }
        
        this.textGeometry.attributes.position.needsUpdate = true;
    }

    // Limpiar recursos
    dispose() {
        if (this.textGeometry) {
            this.textGeometry.dispose();
        }
        if (this.textMaterial) {
            this.textMaterial.dispose();
        }
        if (this.textParticles) {
            this.scene.remove(this.textParticles);
        }
    }
}

export default TextParticles;
