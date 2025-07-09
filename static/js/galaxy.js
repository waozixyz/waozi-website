// Galaxy Background Animation
class GalaxyBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.stars = [];
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createStars();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.background = 'transparent';
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Insert after the galaxy-background div
        const galaxyBg = document.querySelector('.galaxy-background');
        if (galaxyBg) {
            galaxyBg.appendChild(this.canvas);
        } else {
            document.body.appendChild(this.canvas);
        }
    }
    
    createStars() {
        const starCount = window.innerWidth > 768 ? 200 : 100;
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }
    
    createParticles() {
        const particleCount = window.innerWidth > 768 ? 50 : 25;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: this.getRandomColor(),
                opacity: Math.random() * 0.6 + 0.4,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    }
    
    getRandomColor() {
        const colors = ['#4a90e2', '#7b68ee', '#ff6b6b', '#50e3c2', '#f5a623'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Pause animation when not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                }
            } else {
                this.animate();
            }
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Redistribute stars and particles
        this.stars.forEach(star => {
            star.x = Math.random() * this.canvas.width;
            star.y = Math.random() * this.canvas.height;
        });
        
        this.particles.forEach(particle => {
            particle.x = Math.random() * this.canvas.width;
            particle.y = Math.random() * this.canvas.height;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateAndDrawStars();
        this.updateAndDrawParticles();
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateAndDrawStars() {
        this.stars.forEach((star, index) => {
            // Twinkle effect
            star.opacity = 0.3 + Math.sin(Date.now() * star.twinkleSpeed + star.twinkleOffset) * 0.4;
            
            // Mouse interaction
            const dx = this.mouseX - star.x;
            const dy = this.mouseY - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                star.x -= dx * force * 0.01;
                star.y -= dy * force * 0.01;
            }
            
            // Draw star
            this.ctx.save();
            this.ctx.globalAlpha = star.opacity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            // Add glow effect for larger stars
            if (star.size > 1.5) {
                this.ctx.save();
                this.ctx.globalAlpha = star.opacity * 0.3;
                this.ctx.fillStyle = '#4a90e2';
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        });
    }
    
    updateAndDrawParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Pulse effect
            const pulse = Math.sin(Date.now() * particle.pulseSpeed + particle.pulseOffset);
            const currentSize = particle.size + pulse * 0.5;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.x -= dx * force * 0.005;
                particle.y -= dy * force * 0.005;
            }
            
            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            // Add glow effect
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity * 0.2;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, currentSize * 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    drawConnections() {
        // Draw connections between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.2;
                    
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity;
                    this.ctx.strokeStyle = '#4a90e2';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }
}

// Shooting Stars
class ShootingStars {
    constructor() {
        this.stars = [];
        this.lastCreation = 0;
        this.canvas = null;
        this.ctx = null;
        this.init();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.background = 'transparent';
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        const galaxyBg = document.querySelector('.galaxy-background');
        if (galaxyBg) {
            galaxyBg.appendChild(this.canvas);
        }
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createShootingStar() {
        const startX = Math.random() * this.canvas.width;
        const startY = -50;
        const endX = startX + (Math.random() - 0.5) * 400;
        const endY = this.canvas.height + 50;
        
        this.stars.push({
            x: startX,
            y: startY,
            endX: endX,
            endY: endY,
            speed: Math.random() * 3 + 2,
            opacity: 1,
            trail: [],
            life: 100
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create new shooting star occasionally
        if (Date.now() - this.lastCreation > 3000 + Math.random() * 5000) {
            this.createShootingStar();
            this.lastCreation = Date.now();
        }
        
        // Update and draw shooting stars
        this.stars.forEach((star, index) => {
            // Update position
            const dx = star.endX - star.x;
            const dy = star.endY - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                star.x += (dx / distance) * star.speed;
                star.y += (dy / distance) * star.speed;
            }
            
            // Add to trail
            star.trail.push({ x: star.x, y: star.y });
            if (star.trail.length > 20) {
                star.trail.shift();
            }
            
            // Update life
            star.life--;
            star.opacity = star.life / 100;
            
            // Draw trail
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'lighter';
            
            star.trail.forEach((point, i) => {
                const alpha = (i / star.trail.length) * star.opacity;
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
                this.ctx.fill();
            });
            
            this.ctx.restore();
            
            // Remove dead stars
            if (star.life <= 0 || star.y > this.canvas.height) {
                this.stars.splice(index, 1);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on a device that can handle it
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        new GalaxyBackground();
        new ShootingStars();
    }
});