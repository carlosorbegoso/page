// ===== SISTEMA DE PARTÍCULAS DE ESTRELLAS PROFESIONAL =====

class StarParticles {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.starfield = [];
        this.shootingStars = [];
        
        this.init();
        this.animate();
    }

    init() {
        this.resize();
        this.createStarfield();
        this.createShootingStars();
        this.addEventListeners();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStarfield() {
        const starCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < starCount; i++) {
            this.starfield.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01
            });
        }
    }

    createShootingStars() {
        for (let i = 0; i < 3; i++) {
            this.shootingStars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: Math.random() * 3 + 2,
                opacity: 1,
                trail: []
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateStarfield();
        this.updateShootingStars();
        this.createMouseParticles();
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }

    updateStarfield() {
        this.starfield.forEach(star => {
            // Twinkle effect
            star.twinkle += star.speed;
            star.opacity = Math.sin(star.twinkle) * 0.3 + 0.5;
            
            // Draw star
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            this.ctx.shadowBlur = star.size * 2;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    updateShootingStars() {
        this.shootingStars.forEach((star, index) => {
            // Update position
            star.x += star.vx;
            star.y += star.vy;
            
            // Add to trail
            star.trail.push({ x: star.x, y: star.y, opacity: 1 });
            if (star.trail.length > 20) star.trail.shift();
            
            // Draw trail
            star.trail.forEach((point, i) => {
                const opacity = (i / star.trail.length) * star.opacity;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, star.size * (i / star.trail.length), 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                this.ctx.fill();
            });
            
            // Reset if out of bounds
            if (star.x < 0 || star.x > this.canvas.width || 
                star.y < 0 || star.y > this.canvas.height) {
                star.x = Math.random() * this.canvas.width;
                star.y = Math.random() * this.canvas.height;
                star.trail = [];
            }
        });
    }

    createMouseParticles() {
        if (this.mouse.x && this.mouse.y) {
            // Create particles around mouse
            for (let i = 0; i < 2; i++) {
                this.particles.push({
                    x: this.mouse.x + (Math.random() - 0.5) * 50,
                    y: this.mouse.y + (Math.random() - 0.5) * 50,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 3 + 1,
                    opacity: 1,
                    life: 1
                });
            }
        }
        
        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.opacity -= 0.02;
            particle.life -= 0.02;
            
            if (particle.life > 0) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(100, 181, 246, ${particle.opacity})`;
                this.ctx.fill();
                return true;
            }
            return false;
        });
    }

    drawConnections() {
        const maxDistance = 150;
        
        for (let i = 0; i < this.starfield.length; i++) {
            for (let j = i + 1; j < this.starfield.length; j++) {
                const dx = this.starfield[i].x - this.starfield[j].x;
                const dy = this.starfield[i].y - this.starfield[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.starfield[i].x, this.starfield[i].y);
                    this.ctx.lineTo(this.starfield[j].x, this.starfield[j].y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }

    // Efectos especiales
    createExplosion(x, y) {
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 2,
                opacity: 1,
                life: 1
            });
        }
    }

    // Limpiar recursos
    dispose() {
        this.particles = [];
        this.starfield = [];
        this.shootingStars = [];
    }
}

export default StarParticles;
