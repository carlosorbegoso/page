/**
 * BrainInteraction - Maneja la interactividad del cerebro
 * Sistema de layout alternado: cerebro izq/der según sección
 * Máximo 250 líneas
 */

import * as THREE from 'three';

export class BrainInteraction {
    constructor(neuralGroup, brainParts, config) {
        this.neuralGroup = neuralGroup;
        this.brainParts = brainParts;
        this.config = config;

        // Estado del mouse
        this.mouseX = 0;
        this.mouseY = 0;

        // Posición objetivo (para alternado izq/der)
        this.targetPositionX = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.targetScale = config.scale;

        // Sección activa
        this.activeSection = null;
        this.sectionIndex = 0;

        // Configuración de secciones con posiciones alternadas
        this.sectionConfig = {
            hero:       { side: 'left',  index: 0, parts: ['frontalLeft', 'frontalRight'] },
            about:      { side: 'right', index: 1, parts: ['parietalLeft', 'parietalRight'] },
            experience: { side: 'left',  index: 2, parts: ['temporalLeft', 'temporalRight'] },
            skills:     { side: 'right', index: 3, parts: ['occipitalLeft', 'occipitalRight'] },
            projects:   { side: 'left',  index: 4, parts: ['cerebellum'] },
            contact:    { side: 'right', index: 5, parts: ['brainstem'] }
        };

        // Posiciones X para cada lado - Ajustadas para fullscreen
        this.positions = {
            left: -20,   // Cerebro a la izquierda
            right: 20,   // Cerebro a la derecha
            center: 0
        };
    }

    init() {
        this.setupMouseInteraction();
        this.setupScrollBehavior();
        this.setupSectionInteraction();
    }

    setupMouseInteraction() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        }, { passive: true });
    }

    setupScrollBehavior() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Calcular qué sección está visible
            const sections = Object.keys(this.sectionConfig);

            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const sectionMiddle = rect.top + rect.height / 2;

                    // Si la sección está en el centro de la pantalla
                    if (sectionMiddle > 0 && sectionMiddle < windowHeight) {
                        this.activateSection(sectionId);
                    }
                }
            });

            // Paralaje vertical basado en scroll
            const maxScroll = document.documentElement.scrollHeight - windowHeight;
            const scrollProgress = Math.min(scrollY / maxScroll, 1);

            // Rotación gradual con scroll
            this.targetRotationY = scrollProgress * Math.PI * 0.5;

        }, { passive: true });
    }

    setupSectionInteraction() {
        const sections = Object.keys(this.sectionConfig);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
                    this.activateSection(entry.target.id);
                }
            });
        }, { threshold: [0.4, 0.6, 0.8] });

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                observer.observe(section);
            }
        });
    }

    activateSection(sectionId) {
        if (this.activeSection === sectionId) return;

        const sectionData = this.sectionConfig[sectionId];
        if (!sectionData) return;

        this.activeSection = sectionId;
        this.sectionIndex = sectionData.index;

        // Mover cerebro al lado correspondiente
        this.targetPositionX = this.positions[sectionData.side];

        // Actualizar highlights de partes del cerebro
        this.updateBrainHighlights(sectionData.parts);

        // Añadir clase CSS a la sección para posicionar contenido
        this.updateSectionClasses(sectionId, sectionData.side);
    }

    updateBrainHighlights(partsToHighlight) {
        // Reset todas las partes
        Object.entries(this.brainParts).forEach(([name, component]) => {
            if (component?.getMesh) {
                const mesh = component.getMesh();
                this.setPartOpacity(mesh, this.config.opacity * 0.4);
            }
        });

        // Destacar partes activas con brillo
        partsToHighlight.forEach(partName => {
            const component = this.brainParts[partName];
            if (component?.getMesh) {
                const mesh = component.getMesh();
                this.setPartOpacity(mesh, this.config.opacity * 2);
            }
        });
    }

    updateSectionClasses(activeSectionId, side) {
        const sections = Object.keys(this.sectionConfig);

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                // Remover clases anteriores
                section.classList.remove('brain-left', 'brain-right');

                // Añadir clase correspondiente
                if (sectionId === activeSectionId) {
                    section.classList.add(`brain-${side}`);
                }
            }
        });
    }

    setPartOpacity(mesh, opacity) {
        if (mesh.material) {
            mesh.material.opacity = Math.min(opacity, 1);
        }
        mesh.traverse(child => {
            if (child.material) {
                child.material.opacity = Math.min(opacity, 1);
            }
        });
    }

    // Llamado en cada frame
    update(time) {
        // Interpolar posición X (alternado izq/der)
        this.neuralGroup.position.x = THREE.MathUtils.lerp(
            this.neuralGroup.position.x,
            this.targetPositionX,
            0.04
        );

        // Rotación interactiva con mouse
        const mouseRotationX = this.mouseY * 0.12;
        const mouseRotationY = this.mouseX * 0.15;

        this.neuralGroup.rotation.x = THREE.MathUtils.lerp(
            this.neuralGroup.rotation.x,
            this.targetRotationX + mouseRotationX,
            0.04
        );

        this.neuralGroup.rotation.y = THREE.MathUtils.lerp(
            this.neuralGroup.rotation.y,
            this.targetRotationY + mouseRotationY,
            0.04
        );

        // Rotación automática sutil
        this.targetRotationY += 0.001;

        // Pulso de escala sutil
        const pulse = 1 + Math.sin(time * 0.8) * 0.02;
        this.neuralGroup.scale.setScalar(this.config.scale * pulse);
    }
}
