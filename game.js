class Shape {
    constructor(type, x, y) {
        this.type = type; // 'circle', 'square', or 'triangle'
        this.x = x;
        this.y = y;
        this.size = 30;
        this.normalSpeed = 2;
        this.fastSpeed = 8;
        this.rotation = 0;
        this.rotationSpeed = 0.02;
        this.isMatched = false;
        this.matchScale = 1;
        this.matchRotation = 0;
        this.matchX = 0;
        this.matchY = 0;
        this.matchAngle = 0;
        // Store the color based on type
        this.color = this.getColorForType(type);
        this.trail = [];
        this.maxTrailLength = 30;
    }

    getColorForType(type) {
        switch (type) {
            case 'circle': return '#4CAF50';
            case 'square': return '#FF6B6B';
            case 'triangle': return '#4ECDC4';
            case 'star': return '#FFD700';
            case 'diamond': return '#9C27B0';
            case 'hexagon': return '#FF9800';
            case 'cross': return '#E91E63';
            case 'heart': return '#F44336';
            case 'moon': return '#2196F3';
            case 'spiral': return '#00BCD4';
            default: return '#4CAF50';
        }
    }

    draw(ctx) {
        // Draw trail with increased transparency
        this.trail.forEach((pos, index) => {
            const alpha = (index / this.trail.length) * 0.3; // Reduced from 0.5 to 0.3
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.rotate(pos.rotation);
            ctx.globalAlpha = alpha;
            
            // Add glow effect for trail
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // Draw trail shape
            this.drawShape(ctx, this.size * 0.9);
            ctx.restore();
        });

        // Draw main shape with outline
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw outline first
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        this.drawShapeOutline(ctx, this.size);
        
        // Draw filled shape
        this.drawShape(ctx, this.size);
        ctx.restore();
    }

    drawShapeOutline(ctx, size) {
        switch (this.type) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 'square':
                ctx.strokeRect(-size / 2, -size / 2, size, size);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -size / 2);
                ctx.lineTo(size / 2, size / 2);
                ctx.lineTo(-size / 2, size / 2);
                ctx.closePath();
                ctx.stroke();
                break;
            case 'star':
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    const x = Math.cos(angle) * size / 2;
                    const y = Math.sin(angle) * size / 2;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -size / 2);
                ctx.lineTo(size / 2, 0);
                ctx.lineTo(0, size / 2);
                ctx.lineTo(-size / 2, 0);
                ctx.closePath();
                ctx.stroke();
                break;
            case 'hexagon':
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i * 2 * Math.PI) / 6;
                    const x = Math.cos(angle) * size / 2;
                    const y = Math.sin(angle) * size / 2;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
                break;
            case 'cross':
                ctx.strokeRect(-size / 6, -size / 2, size / 3, size);
                ctx.strokeRect(-size / 2, -size / 6, size, size / 3);
                break;
            case 'heart':
                ctx.beginPath();
                ctx.moveTo(0, size / 4);
                ctx.bezierCurveTo(
                    -size / 4, -size / 4,
                    -size / 2, -size / 4,
                    0, -size / 2
                );
                ctx.bezierCurveTo(
                    size / 2, -size / 4,
                    size / 4, -size / 4,
                    0, size / 4
                );
                ctx.stroke();
                break;
            case 'moon':
                ctx.beginPath();
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(size / 4, 0, size / 3, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 'spiral':
                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = i * Math.PI / 4;
                    const radius = size / 2 * (1 - i / 8);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                break;
        }
    }

    drawShape(ctx, size) {
        switch (this.type) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'square':
                ctx.fillStyle = this.color;
                ctx.fillRect(-size / 2, -size / 2, size, size);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -size / 2);
                ctx.lineTo(size / 2, size / 2);
                ctx.lineTo(-size / 2, size / 2);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'star':
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    const x = Math.cos(angle) * size / 2;
                    const y = Math.sin(angle) * size / 2;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -size / 2);
                ctx.lineTo(size / 2, 0);
                ctx.lineTo(0, size / 2);
                ctx.lineTo(-size / 2, 0);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'hexagon':
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i * 2 * Math.PI) / 6;
                    const x = Math.cos(angle) * size / 2;
                    const y = Math.sin(angle) * size / 2;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'cross':
                ctx.fillStyle = this.color;
                ctx.fillRect(-size / 6, -size / 2, size / 3, size);
                ctx.fillRect(-size / 2, -size / 6, size, size / 3);
                break;
            case 'heart':
                ctx.beginPath();
                ctx.moveTo(0, size / 4);
                ctx.bezierCurveTo(
                    -size / 4, -size / 4,
                    -size / 2, -size / 4,
                    0, -size / 2
                );
                ctx.bezierCurveTo(
                    size / 2, -size / 4,
                    size / 4, -size / 4,
                    0, size / 4
                );
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'moon':
                ctx.beginPath();
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(size / 4, 0, size / 3, 0, Math.PI * 2);
                ctx.fillStyle = '#1a1a2e';
                ctx.fill();
                break;
            case 'spiral':
                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = i * Math.PI / 4;
                    const radius = size / 2 * (1 - i / 8);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 3;
                ctx.stroke();
                break;
        }
    }

    update() {
        if (this.isMatched) {
            // Animate matching effect
            this.matchScale = Math.min(1.2, this.matchScale + 0.1);
            this.matchRotation += 0.1;
            this.rotation = this.matchRotation;
        } else {
            // Update trail
            this.trail.push({ x: this.x, y: this.y, rotation: this.rotation });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }

            this.y += this.speed;
            this.rotation += this.rotationSpeed;
        }
    }

    setSpeed(fast) {
        this.speed = fast ? this.fastSpeed : this.normalSpeed;
    }

    startMatch(x, y, angle) {
        this.isMatched = true;
        this.matchX = x;
        this.matchY = y;
        this.matchAngle = angle;
        this.matchScale = 0.8;
    }
}

class Wheel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.min(window.innerWidth, window.innerHeight) * 0.255;
        this.rotation = 0;
        this.holes = [
            { type: 'circle', angle: 0 },
            { type: 'square', angle: Math.PI * 2 / 10 },
            { type: 'triangle', angle: Math.PI * 4 / 10 },
            { type: 'star', angle: Math.PI * 6 / 10 },
            { type: 'diamond', angle: Math.PI * 8 / 10 },
            { type: 'hexagon', angle: Math.PI * 10 / 10 },
            { type: 'cross', angle: Math.PI * 12 / 10 },
            { type: 'heart', angle: Math.PI * 14 / 10 },
            { type: 'moon', angle: Math.PI * 16 / 10 },
            { type: 'spiral', angle: Math.PI * 18 / 10 }
        ];
        this.filledHoles = new Set();
        this.rotationTrail = [];
        this.maxTrailLength = 5;
        this.splashParticles = [];
        this.maxSplashParticles = 20;
        
        // Load wheel image
        this.image = new Image();
        this.image.src = 'Wheel.png';
    }

    rotate(direction) {
        this.rotation += direction * 0.1;
        // Add current rotation to trail
        this.rotationTrail.push(this.rotation);
        if (this.rotationTrail.length > this.maxTrailLength) {
            this.rotationTrail.shift();
        }

        // Create splash particles
        const side = direction > 0 ? 1 : -1;
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI / 2 - Math.PI / 4;
            const speed = 2 + Math.random() * 2;
            this.splashParticles.push({
                x: this.x + Math.cos(this.rotation) * this.radius * side,
                y: this.y + Math.sin(this.rotation) * this.radius,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: 'rgba(255, 255, 255, 0.3)'
            });
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw rotation trail
        this.rotationTrail.forEach((rot, index) => {
            const alpha = (index / this.rotationTrail.length) * 0.2;
            ctx.save();
            ctx.rotate(rot);
            ctx.globalAlpha = alpha;
            
            if (this.image.complete) {
                ctx.drawImage(
                    this.image,
                    -this.radius,
                    -this.radius,
                    this.radius * 2,
                    this.radius * 2
                );
            }
            ctx.restore();
        });

        // Draw current wheel state
        ctx.rotate(this.rotation);
        if (this.image.complete) {
            ctx.drawImage(
                this.image,
                -this.radius,
                -this.radius,
                this.radius * 2,
                this.radius * 2
            );
        }

        // Draw splash particles
        this.splashParticles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;

            if (particle.life <= 0) {
                this.splashParticles.splice(index, 1);
            } else {
                ctx.save();
                ctx.translate(particle.x - this.x, particle.y - this.y);
                ctx.globalAlpha = particle.life * 0.3;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(0, 0, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });

        // Draw holes with depth effect
        this.holes.forEach((hole, index) => {
            if (!this.filledHoles.has(index)) {
                ctx.save();
                ctx.rotate(hole.angle);
                ctx.translate(0, -this.radius * 0.85);
                ctx.rotate(-hole.angle - this.rotation);

                // Draw hole shadow for depth
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                // Draw hole with gradient for depth
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
                gradient.addColorStop(0, '#2a2a2a');
                gradient.addColorStop(1, '#1a1a1a');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                switch (hole.type) {
                    case 'circle':
                        ctx.arc(0, 0, 20, 0, Math.PI * 2);
                        break;
                    case 'square':
                        ctx.rect(-20, -20, 40, 40);
                        break;
                    case 'triangle':
                        ctx.moveTo(0, -20);
                        ctx.lineTo(20, 20);
                        ctx.lineTo(-20, 20);
                        ctx.closePath();
                        break;
                    case 'star':
                        for (let i = 0; i < 5; i++) {
                            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                            const x = Math.cos(angle) * 20;
                            const y = Math.sin(angle) * 20;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                        break;
                    case 'diamond':
                        ctx.moveTo(0, -20);
                        ctx.lineTo(20, 0);
                        ctx.lineTo(0, 20);
                        ctx.lineTo(-20, 0);
                        ctx.closePath();
                        break;
                    case 'hexagon':
                        for (let i = 0; i < 6; i++) {
                            const angle = (i * 2 * Math.PI) / 6;
                            const x = Math.cos(angle) * 20;
                            const y = Math.sin(angle) * 20;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                        break;
                    case 'cross':
                        ctx.rect(-7, -20, 14, 40);
                        ctx.rect(-20, -7, 40, 14);
                        break;
                    case 'heart':
                        ctx.moveTo(0, 5);
                        ctx.bezierCurveTo(-10, -10, -20, -10, 0, -20);
                        ctx.bezierCurveTo(20, -10, 10, -10, 0, 5);
                        break;
                    case 'moon':
                        ctx.arc(0, 0, 20, 0, Math.PI * 2);
                        ctx.arc(5, 0, 15, 0, Math.PI * 2);
                        break;
                    case 'spiral':
                        for (let i = 0; i < 8; i++) {
                            const angle = i * Math.PI / 4;
                            const radius = 20 * (1 - i / 8);
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        break;
                }
                ctx.fill();

                // Draw hole edge highlight
                ctx.strokeStyle = '#3a3a3a';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.restore();
            }
        });

        ctx.restore();
    }

    checkCollision(shape) {
        const wheelCenter = { x: this.x, y: this.y };
        const distance = Math.sqrt(
            Math.pow(shape.x - wheelCenter.x, 2) + 
            Math.pow(shape.y - wheelCenter.y, 2)
        );

        // Only check for matching if the shape is near the wheel's edge
        if (distance < this.radius + shape.size / 2 && distance > this.radius - shape.size / 2) {
            const angle = Math.atan2(shape.y - wheelCenter.y, shape.x - wheelCenter.x);
            const normalizedAngle = (angle - this.rotation + Math.PI * 2) % (Math.PI * 2);

            for (let i = 0; i < this.holes.length; i++) {
                const holeAngle = this.holes[i].angle;
                const angleDiff = Math.abs(normalizedAngle - holeAngle);

                if (angleDiff < 0.3 && shape.type === this.holes[i].type && !this.filledHoles.has(i)) {
                    // Calculate the position where the shape should snap to
                    const holeX = Math.cos(holeAngle) * this.radius * 0.85; // Changed from 0.7 to 0.85
                    const holeY = Math.sin(holeAngle) * this.radius * 0.85; // Changed from 0.7 to 0.85
                    shape.startMatch(holeX, holeY, holeAngle);
                    this.filledHoles.add(i);
                    return true;
                }
            }
        }
        return false;
    }

    isComplete() {
        return this.filledHoles.size === this.holes.length;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Load background image
        this.backgroundImage = new Image();
        this.backgroundImage.src = 'Background.png';
        
        this.wheel = new Wheel(this.canvas.width / 2, this.canvas.height - 150);
        this.shapes = [];
        this.gameOver = false;
        this.score = 0;
        this.touchStartX = 0;
        this.lastSpawnTime = 0;
        this.spawnInterval = 2000; // 2 seconds between shapes
        this.currentShape = null;
        this.shapeSpeed = 2; // Constant speed
        this.isSpeedBoosted = false;

        // Load sound effects
        this.sounds = {
            wheelRotate: new Audio('wheel-rotate.mp3'),
            shapeFall: new Audio('shape-fall.mp3'),
            shapeMatch: new Audio('shape-match.mp3')
        };

        // Set up sound properties
        this.sounds.wheelRotate.volume = 0.3;
        this.sounds.shapeFall.volume = 0.2;
        this.sounds.shapeMatch.volume = 0.4;

        // Add sound loop for wheel rotation
        this.sounds.wheelRotate.loop = true;

        this.setupEventListeners();
        this.lockOrientation();
        this.startGame();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    lockOrientation() {
        // Try to lock to portrait mode
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('portrait').catch(() => {
                // If orientation lock fails, show a message
                console.log('Orientation lock not supported');
            });
        }

        // Add orientation change listener
        window.addEventListener('orientationchange', () => {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('portrait').catch(() => {
                    console.log('Orientation lock not supported');
                });
            }
        });
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.wheel.rotate(-1);
            } else if (e.key === 'ArrowRight') {
                this.wheel.rotate(1);
            } else if (e.key === ' ' && !this.gameOver) { // Space bar
                this.isSpeedBoosted = true;
                if (this.currentShape) {
                    this.currentShape.setSpeed(true);
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === ' ') {
                this.isSpeedBoosted = false;
                if (this.currentShape) {
                    this.currentShape.setSpeed(false);
                }
            }
        });

        // Touch controls with improved speed boost
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.gameOver) {
                const touchY = e.touches[0].clientY;
                // Only boost speed if touching above the wheel
                if (touchY < this.wheel.y - this.wheel.radius) {
                    this.isSpeedBoosted = true;
                    if (this.currentShape) {
                        this.currentShape.setSpeed(true);
                        this.sounds.shapeFall.play();
                    }
                }
                this.touchStartX = e.touches[0].clientX;
            }
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isSpeedBoosted = false;
            if (this.currentShape) {
                this.currentShape.setSpeed(false);
            }
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchX = e.touches[0].clientX;
            const diff = touchX - this.touchStartX;
            
            if (Math.abs(diff) > 10) {
                this.wheel.rotate(diff > 0 ? 1 : -1);
                this.touchStartX = touchX;
                this.sounds.wheelRotate.play();
            }
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.startGame();
        });
    }

    startGame() {
        // Stop any playing sounds
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });

        this.shapes = [];
        this.wheel = new Wheel(this.canvas.width / 2, this.canvas.height - 150);
        this.gameOver = false;
        this.score = 0;
        this.lastSpawnTime = 0;
        this.currentShape = null;
        document.getElementById('gameOverlay').style.display = 'none';
        this.spawnShape();
        this.gameLoop();
    }

    spawnShape() {
        if (this.gameOver) return;
        
        const types = ['circle', 'square', 'triangle', 'star', 'diamond', 
                      'hexagon', 'cross', 'heart', 'moon', 'spiral'];
        const type = types[Math.floor(Math.random() * types.length)];
        const x = this.canvas.width / 2;
        const y = 0;
        this.currentShape = new Shape(type, x, y);
        this.currentShape.setSpeed(this.isSpeedBoosted);
    }

    update() {
        if (this.gameOver) return;

        const currentTime = Date.now();

        // Update current shape
        if (this.currentShape) {
            this.currentShape.update();
            
            // Check collision with wheel
            if (this.wheel.checkCollision(this.currentShape)) {
                this.score++;
                this.sounds.shapeMatch.play();
                // Instead of adding to shapes array, just remove the current shape
                this.currentShape = null;
                this.lastSpawnTime = currentTime;
                // Spawn new shape immediately
                this.spawnShape();
            }

            // Check if shape is below the screen
            if (this.currentShape.y > this.canvas.height) {
                this.currentShape = null;
                this.lastSpawnTime = currentTime;
                // Spawn new shape immediately
                this.spawnShape();
            }
        }

        // Spawn new shape after interval if no shape exists
        if (!this.currentShape && currentTime - this.lastSpawnTime >= this.spawnInterval) {
            this.spawnShape();
        }

        // Check win condition
        if (this.wheel.isComplete()) {
            this.gameOver = true;
            document.getElementById('gameMessage').textContent = 'You Win!';
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background image
        if (this.backgroundImage.complete) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        }

        // Draw wheel first (behind shapes)
        this.wheel.draw(this.ctx);

        // Draw current shape
        if (this.currentShape) {
            this.currentShape.draw(this.ctx);
        }

        // Draw score with better visibility
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(`Score: ${this.score}`, 20, 40);
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);

        if (this.gameOver) {
            document.getElementById('gameOverlay').style.display = 'flex';
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 