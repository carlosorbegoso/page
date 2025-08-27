// ===== SISTEMA DE GRADIENTES ANIMADOS PROFESIONAL =====

class AnimatedGradients {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gradients = [];
        this.time = 0;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.animate();
    }

    init() {
        this.resize();
        this.createGradients();
        this.addEventListeners();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createGradients() {
        // Gradiente principal del hero
        this.gradients.push({
            type: 'radial',
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: Math.max(this.canvas.width, this.canvas.height) * 0.8,
            colors: [
                { r: 44, g: 90, b: 160, a: 0.8 },   // Azul principal
                { r: 255, g: 107, b: 53, a: 0.6 },  // Naranja
                { r: 66, g: 133, b: 244, a: 0.4 },  // Azul claro
                { r: 109, g: 179, b: 63, a: 0.2 }   // Verde
            ],
            animation: {
                speed: 0.001,
                rotation: 0,
                scale: 1
            }
        });

        // Gradientes flotantes
        for (let i = 0; i < 3; i++) {
            this.gradients.push({
                type: 'linear',
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                angle: Math.random() * Math.PI * 2,
                length: Math.random() * 200 + 100,
                colors: [
                    { r: 255, g: 255, b: 255, a: 0.1 },
                    { r: 255, g: 255, b: 255, a: 0.05 }
                ],
                animation: {
                    speed: Math.random() * 0.002 + 0.001,
                    rotation: Math.random() * Math.PI * 2,
                    scale: Math.random() * 0.5 + 0.5
                }
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        });
    }

    animate() {
        this.time += 0.01;
        this.updateGradients();
        this.drawGradients();
        
        requestAnimationFrame(() => this.animate());
    }

    updateGradients() {
        this.gradients.forEach((gradient, index) => {
            if (index === 0) {
                // Gradiente principal - sigue al mouse
                const targetX = this.mouse.x || this.canvas.width / 2;
                const targetY = this.mouse.y || this.canvas.height / 2;
                
                gradient.x += (targetX - gradient.x) * 0.02;
                gradient.y += (targetY - gradient.y) * 0.02;
                
                // Animación de escala
                gradient.animation.scale = 1 + Math.sin(this.time * 2) * 0.1;
            } else {
                // Gradientes flotantes
                gradient.animation.rotation += gradient.animation.speed;
                gradient.x += Math.cos(gradient.animation.rotation) * 0.5;
                gradient.y += Math.sin(gradient.animation.rotation) * 0.5;
                
                // Mantener en bounds
                if (gradient.x < 0) gradient.x = this.canvas.width;
                if (gradient.x > this.canvas.width) gradient.x = 0;
                if (gradient.y < 0) gradient.y = this.canvas.height;
                if (gradient.y > this.canvas.height) gradient.y = 0;
            }
        });
    }

    drawGradients() {
        // Limpiar canvas con transparencia
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.gradients.forEach((gradient, index) => {
            if (gradient.type === 'radial') {
                this.drawRadialGradient(gradient);
            } else {
                this.drawLinearGradient(gradient);
            }
        });
    }

    drawRadialGradient(gradient) {
        const radius = gradient.radius * gradient.animation.scale;
        
        const radialGradient = this.ctx.createRadialGradient(
            gradient.x, gradient.y, 0,
            gradient.x, gradient.y, radius
        );
        
        gradient.colors.forEach((color, i) => {
            const offset = i / (gradient.colors.length - 1);
            radialGradient.addColorStop(offset, 
                `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
            );
        });
        
        this.ctx.fillStyle = radialGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLinearGradient(gradient) {
        const x1 = gradient.x;
        const y1 = gradient.y;
        const x2 = x1 + Math.cos(gradient.animation.rotation) * gradient.length;
        const y2 = y1 + Math.sin(gradient.animation.rotation) * gradient.length;
        
        const linearGradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
        
        gradient.colors.forEach((color, i) => {
            const offset = i / (gradient.colors.length - 1);
            linearGradient.addColorStop(offset, 
                `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
            );
        });
        
        this.ctx.fillStyle = linearGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Efectos especiales
    createRipple(x, y) {
        const ripple = {
            x: x,
            y: y,
            radius: 0,
            maxRadius: 100,
            opacity: 1,
            speed: 2
        };
        
        const animateRipple = () => {
            if (ripple.radius < ripple.maxRadius) {
                ripple.radius += ripple.speed;
                ripple.opacity = 1 - (ripple.radius / ripple.maxRadius);
                
                this.ctx.beginPath();
                this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.5})`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                requestAnimationFrame(animateRipple);
            }
        };
        
        animateRipple();
    }

    // Cambiar tema
    updateTheme(theme) {
        if (theme === 'dark') {
            this.gradients[0].colors = [
                { r: 100, g: 181, b: 246, a: 0.8 },  // Azul claro
                { r: 255, g: 138, b: 101, a: 0.6 },  // Naranja claro
                { r: 129, g: 199, b: 132, a: 0.4 },  // Verde claro
                { r: 255, g: 255, b: 255, a: 0.2 }   // Blanco
            ];
        } else {
            this.gradients[0].colors = [
                { r: 44, g: 90, b: 160, a: 0.8 },   // Azul principal
                { r: 255, g: 107, b: 53, a: 0.6 },  // Naranja
                { r: 66, g: 133, b: 244, a: 0.4 },  // Azul claro
                { r: 109, g: 179, b: 63, a: 0.2 }   // Verde
            ];
        }
    }

    // Limpiar recursos
    dispose() {
        this.gradients = [];
    }
}

export default AnimatedGradients;
