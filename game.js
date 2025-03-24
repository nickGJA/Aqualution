class Shape {
    constructor(type, x, y) {
        this.type = type; // 'circle', 'square', or 'triangle'
        this.x = x;
        this.y = y;
        this.size = 30;
        this.normalSpeed = 0.8;
        this.fastSpeed = 3.2;
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
        
        // Add physics properties
        this.velocityX = 0;
        this.velocityY = 0;
        this.gravity = 0.5;
        this.friction = 0.98;
        this.bounce = 0.7;
        this.isOnPlatform = false;
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
                // Draw 5-pointed star with inner and outer points
                for (let i = 0; i < 5; i++) {
                    const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                    const innerAngle = outerAngle + Math.PI / 5;
                    
                    // Outer point
                    const outerX = Math.cos(outerAngle) * (size / 2);
                    const outerY = Math.sin(outerAngle) * (size / 2);
                    
                    // Inner point
                    const innerX = Math.cos(innerAngle) * (size * 0.2);
                    const innerY = Math.sin(innerAngle) * (size * 0.2);
                    
                    if (i === 0) ctx.moveTo(outerX, outerY);
                    else ctx.lineTo(outerX, outerY);
                    
                    ctx.lineTo(innerX, innerY);
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
                ctx.beginPath();
                const armWidth = size * 0.2;
                ctx.moveTo(-armWidth, -size / 2);
                ctx.lineTo(armWidth, -size / 2);
                ctx.lineTo(armWidth, -armWidth);
                ctx.lineTo(size / 2, -armWidth);
                ctx.lineTo(size / 2, armWidth);
                ctx.lineTo(armWidth, armWidth);
                ctx.lineTo(armWidth, size / 2);
                ctx.lineTo(-armWidth, size / 2);
                ctx.lineTo(-armWidth, armWidth);
                ctx.lineTo(-size / 2, armWidth);
                ctx.lineTo(-size / 2, -armWidth);
                ctx.lineTo(-armWidth, -armWidth);
                ctx.closePath();
                ctx.stroke();
                break;
            case 'heart':
                ctx.beginPath();
                const topWidth = size * 0.25;
                const curveHeight = size * 0.4;
                ctx.moveTo(0, size * 0.35);
                ctx.bezierCurveTo(-size / 2, 0, -size / 2, -curveHeight, 0, -size / 2);
                ctx.bezierCurveTo(size / 2, -curveHeight, size / 2, 0, 0, size * 0.35);
                ctx.stroke();
                break;
            case 'moon':
                ctx.beginPath();
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(size / 5, 0, size / 3, 0, Math.PI * 2);
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
                // Draw 5-pointed star with inner and outer points
                for (let i = 0; i < 5; i++) {
                    const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                    const innerAngle = outerAngle + Math.PI / 5;
                    
                    // Outer point
                    const outerX = Math.cos(outerAngle) * (size / 2);
                    const outerY = Math.sin(outerAngle) * (size / 2);
                    
                    // Inner point
                    const innerX = Math.cos(innerAngle) * (size * 0.2);
                    const innerY = Math.sin(innerAngle) * (size * 0.2);
                    
                    if (i === 0) ctx.moveTo(outerX, outerY);
                    else ctx.lineTo(outerX, outerY);
                    
                    ctx.lineTo(innerX, innerY);
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
                ctx.beginPath();
                const armWidth = size * 0.2;
                ctx.moveTo(-armWidth, -size / 2);
                ctx.lineTo(armWidth, -size / 2);
                ctx.lineTo(armWidth, -armWidth);
                ctx.lineTo(size / 2, -armWidth);
                ctx.lineTo(size / 2, armWidth);
                ctx.lineTo(armWidth, armWidth);
                ctx.lineTo(armWidth, size / 2);
                ctx.lineTo(-armWidth, size / 2);
                ctx.lineTo(-armWidth, armWidth);
                ctx.lineTo(-size / 2, armWidth);
                ctx.lineTo(-size / 2, -armWidth);
                ctx.lineTo(-armWidth, -armWidth);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'heart':
                ctx.beginPath();
                const topWidth = size * 0.25;
                const curveHeight = size * 0.4;
                ctx.moveTo(0, size * 0.35);
                ctx.bezierCurveTo(-size / 2, 0, -size / 2, -curveHeight, 0, -size / 2);
                ctx.bezierCurveTo(size / 2, -curveHeight, size / 2, 0, 0, size * 0.35);
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'moon':
                ctx.beginPath();
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(size / 5, 0, size / 3, 0, Math.PI * 2);
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
            { type: 'triangle', angle: 0 },
            { type: 'hexagon', angle: Math.PI * 2 / 8 },
            { type: 'square', angle: Math.PI * 4 / 8 },
            { type: 'star', angle: Math.PI * 6 / 8 },
            { type: 'heart', angle: Math.PI * 8 / 8 },
            { type: 'cross', angle: Math.PI * 10 / 8 },
            { type: 'circle', angle: Math.PI * 12 / 8 },
            { type: 'moon', angle: Math.PI * 14 / 8 }
        ];
        this.filledHoles = new Set();
        this.rotationTrail = [];
        this.maxTrailLength = 5;
        this.splashParticles = [];
        this.maxSplashParticles = 20;
        
        // Map each hole type to its console logged name for debugging
        this.holeTypeMap = {};
        this.holes.forEach(hole => {
            this.holeTypeMap[hole.type] = hole.type;
        });
        
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

        // Check if shape is near the wheel's edge
        if (distance < this.radius + shape.size && distance > this.radius - shape.size) {
            const fallingShapeType = String(shape.type).trim();
            
            // Check each hole for a match
            for (let i = 0; i < this.holes.length; i++) {
                const holeType = String(this.holes[i].type).trim();
                
                // Only check unfilled holes WITH MATCHING TYPE
                if (!this.filledHoles.has(i) && fallingShapeType === holeType) {
                    const holeX = this.x + Math.cos(this.holes[i].angle + this.rotation) * this.radius * 0.85;
                    const holeY = this.y + Math.sin(this.holes[i].angle + this.rotation) * this.radius * 0.85;
                    
                    const holeDistance = Math.sqrt(
                        Math.pow(shape.x - holeX, 2) + 
                        Math.pow(shape.y - holeY, 2)
                    );
                    
                    // Reduce collision distance from 1.5 to 1.2 times shape size
                    if (holeDistance < shape.size * 1.2) {
                        this.filledHoles.add(i);
                        shape.startMatch(holeX, holeY, this.holes[i].angle + this.rotation);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isComplete() {
        return this.filledHoles.size === this.holes.length;
    }
}

class Platform {
    constructor(x, y, width, height, speed, direction = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = direction;
    }

    update() {
        this.x += this.speed * this.direction;

        // Change direction if platform reaches screen edges
        if (this.x <= 0 || this.x + this.width >= window.innerWidth) {
            this.direction *= -1;
        }
    }

    draw(ctx) {
        // Draw platform with gradient for better visibility
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#4a90e2');
        gradient.addColorStop(1, '#357abd');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw platform border
        ctx.strokeStyle = '#2c5a8a';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    checkCollision(shape) {
        // Check platform collision
        if (shape.y + shape.size/2 >= this.y && 
            shape.y - shape.size/2 <= this.y + this.height &&
            shape.x + shape.size/2 >= this.x && 
            shape.x - shape.size/2 <= this.x + this.width) {
            
            // Top collision
            if (shape.velocityY > 0) {
                shape.y = this.y - shape.size/2;
                shape.velocityY = -shape.velocityY * shape.bounce;
                shape.isOnPlatform = true;
                return true;
            }
        }
        return false;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.gameLoopId = null;
        
        // Load background image
        this.backgroundImage = new Image();
        this.backgroundImage.src = 'Background.png';
        this.backgroundOffset = 0;
        this.backgroundWaveAmplitude = 3;
        this.backgroundWaveSpeed = 0.02;
        
        // Initialize clouds
        this.clouds = [];
        this.initClouds();
        
        // Initialize fish
        this.fish = [];
        this.initFish();
        
        this.wheel = new Wheel(this.canvas.width / 2, this.canvas.height - 150);
        this.shapes = [];
        this.gameOver = false;
        this.score = 0;
        this.level = 1;
        this.touchStartX = 0;
        this.lastSpawnTime = 0;
        this.spawnInterval = 2000; // 2 seconds between shapes
        this.currentShape = null;
        this.isSpeedBoosted = false;
        this.platforms = [];
        this.initPlatforms();

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
                // Only boost speed if touching in top half of screen
                if (touchY < this.canvas.height / 2) {
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

        // Cancel the previous game loop if it exists
        if (this.gameLoopId !== null) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }

        // Reset game state
        this.shapes = [];
        this.wheel = new Wheel(this.canvas.width / 2, this.canvas.height - 150);
        this.gameOver = false;
        this.score = 0;
        this.level = 1;
        this.lastSpawnTime = 0;
        this.currentShape = null;
        this.isSpeedBoosted = false;
        
        // Reset platform speeds and positions
        this.platforms = [];
        this.initPlatforms();
        
        // Reset background wave
        this.backgroundOffset = 0;
        
        // Reset clouds and fish
        this.clouds = [];
        this.fish = [];
        this.initClouds();
        this.initFish();
        
        // Reset UI
        document.getElementById('gameOverlay').style.display = 'none';
        document.getElementById('gameMessage').textContent = '';
        
        // Spawn new shape and start game loop
        this.spawnShape();
        this.gameLoop();
    }

    spawnShape() {
        if (this.gameOver) return;
        
        // Get the actual types from the wheel holes for strict matching
        const availableHoles = [];
        
        // Only consider unfilled holes
        this.wheel.holes.forEach((hole, index) => {
            if (!this.wheel.filledHoles.has(index)) {
                availableHoles.push(hole);
            }
        });
        
        // If all holes are filled, game is over
        if (availableHoles.length === 0) {
            this.gameOver = true;
            document.getElementById('gameMessage').textContent = 'You Win!';
            document.getElementById('gameOverlay').style.display = 'flex';
            return;
        }
        
        // Select a random hole type from the available unfilled holes
        const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        const type = String(randomHole.type).trim();
        
        const x = this.canvas.width / 2;
        const y = 0;
        
        this.currentShape = new Shape(type, x, y);
        // Apply 35% faster speed
        this.currentShape.normalSpeed = 1.35;
        this.currentShape.fastSpeed = 5.4;
        this.currentShape.setSpeed(this.isSpeedBoosted);
    }

    initClouds() {
        const numClouds = 5;
        for (let i = 0; i < numClouds; i++) {
            this.createCloud();
        }
    }

    createCloud() {
        const direction = Math.random() < 0.5 ? -1 : 1;
        const cloud = {
            x: direction === 1 ? -200 : this.canvas.width + 200,
            y: Math.random() * 100,
            width: 100 + Math.random() * 100,
            height: 50 + Math.random() * 30,
            speed: (1 + Math.random()) * direction,
            opacity: 0.4 + Math.random() * 0.3
        };
        this.clouds.push(cloud);
    }

    initFish() {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every second
                this.createFish();
            }
        }, 1000);
    }

    createFish() {
        const direction = Math.random() < 0.5 ? -1 : 1;
        const fish = {
            x: direction === 1 ? -50 : this.canvas.width + 50,
            y: this.canvas.height - 100 - Math.random() * 200,
            size: 20 + Math.random() * 30,
            speed: (2 + Math.random() * 2) * direction,
            jumpHeight: 50 + Math.random() * 50,
            jumpProgress: 0,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        };
        this.fish.push(fish);
        this.createSplash(fish.x, fish.y);
    }

    createSplash(x, y) {
        const numParticles = 10;
        for (let i = 0; i < numParticles; i++) {
            const angle = (Math.PI / 4) + (Math.random() * Math.PI / 2);
            const speed = 2 + Math.random() * 3;
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: -Math.sin(angle) * speed,
                life: 1,
                size: 2 + Math.random() * 3
            };
            this.splashParticles.push(particle);
        }
    }

    drawCloud(cloud) {
        this.ctx.save();
        this.ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
        this.ctx.beginPath();
        
        // Draw multiple circles for fluffy appearance
        const numCircles = 5;
        const baseRadius = cloud.height / 2;
        for (let i = 0; i < numCircles; i++) {
            const x = cloud.x + (i * (cloud.width / 4));
            const y = cloud.y + Math.sin(i * 0.5) * 10;
            const radius = baseRadius + Math.sin(i * 0.7) * 10;
            this.ctx.moveTo(x + radius, y);
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
        
        this.ctx.fill();
        this.ctx.restore();
    }

    drawFish(fish) {
        this.ctx.save();
        this.ctx.translate(fish.x, fish.y - Math.sin(fish.jumpProgress * Math.PI) * fish.jumpHeight);
        this.ctx.scale(fish.speed < 0 ? -1 : 1, 1);
        
        // Draw fish body
        this.ctx.fillStyle = fish.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.quadraticCurveTo(fish.size/2, -fish.size/4, fish.size, 0);
        this.ctx.quadraticCurveTo(fish.size/2, fish.size/4, 0, 0);
        this.ctx.fill();
        
        // Draw tail
        this.ctx.beginPath();
        this.ctx.moveTo(-fish.size/4, 0);
        this.ctx.lineTo(-fish.size/2, -fish.size/3);
        this.ctx.lineTo(-fish.size/2, fish.size/3);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw eye
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(fish.size/2, -fish.size/6, fish.size/8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(fish.size/2, -fish.size/6, fish.size/16, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawScreenFade() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width/2, this.canvas.height/2, Math.min(this.canvas.width, this.canvas.height)/3,
            this.canvas.width/2, this.canvas.height/2, Math.max(this.canvas.width, this.canvas.height)/1.5
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    initPlatforms() {
        // Add exactly 2 platforms in the top half of the screen
        const screenHeight = this.canvas.height;
        const topHalfHeight = screenHeight / 2;
        
        // Calculate valid height range (30% to 80% of top half)
        const minHeight = topHalfHeight * 0.3;
        const maxHeight = topHalfHeight * 0.8;
        
        for (let i = 0; i < 2; i++) {
            // Position platforms at different heights within the valid range
            const y = minHeight + (i * (maxHeight - minHeight));
            const width = 30 + Math.random() * 20; // Narrower platforms (30-50px)
            const x = Math.random() * (this.canvas.width - width);
            const speed = 1.5 + Math.random() * 1; // Slightly slower speed
            const direction = Math.random() < 0.5 ? -1 : 1;
            
            // Create platform with thinner height (8px)
            this.platforms.push(new Platform(x, y, width, 8, speed, direction));
        }
    }

    update() {
        if (this.gameOver) return;

        const currentTime = Date.now();

        // Update platforms
        this.platforms.forEach(platform => platform.update());

        // Update current shape with physics
        if (this.currentShape) {
            // Apply gravity
            this.currentShape.velocityY += this.currentShape.gravity;
            
            // Apply friction
            this.currentShape.velocityX *= this.currentShape.friction;
            
            // Update position
            this.currentShape.x += this.currentShape.velocityX;
            this.currentShape.y += this.currentShape.velocityY;
            
            // Check platform collisions
            this.currentShape.isOnPlatform = false;
            for (const platform of this.platforms) {
                if (platform.checkCollision(this.currentShape)) {
                    break;
                }
            }

            // Update rotation and trail
            this.currentShape.rotation += this.currentShape.rotationSpeed;
            this.currentShape.trail.push({ x: this.currentShape.x, y: this.currentShape.y, rotation: this.currentShape.rotation });
            if (this.currentShape.trail.length > this.currentShape.maxTrailLength) {
                this.currentShape.trail.shift();
            }
            
            // Update background wave
            this.backgroundOffset += this.backgroundWaveSpeed;

            // Update clouds
            this.clouds.forEach((cloud, index) => {
                cloud.x += cloud.speed;
                if ((cloud.speed > 0 && cloud.x > this.canvas.width + 300) || 
                    (cloud.speed < 0 && cloud.x < -300)) {
                    this.clouds.splice(index, 1);
                    this.createCloud();
                }
            });

            // Update fish
            this.fish.forEach((fish, index) => {
                fish.x += fish.speed;
                fish.jumpProgress += 0.02;
                if (fish.jumpProgress >= 1) {
                    this.fish.splice(index, 1);
                }
            });

            // Update current shape
            this.currentShape.update();
            
            // Store collision data for debugging
            this.collisionDebug = {
                checking: true,
                shapeType: this.currentShape.type,
                nearWheel: false,
                closestHole: null,
                closestType: null,
                closestDist: Infinity,
                matched: false
            };
            
            // Check collision with wheel
            if (this.wheel.checkCollision(this.currentShape)) {
                // Update debug data
                this.collisionDebug.matched = true;
                
                // Play match sound
                this.sounds.shapeMatch.play();
                
                // Increment score
                this.score++;
                
                // Remove the current shape
                this.currentShape = null;
                this.lastSpawnTime = currentTime;
                
                // Spawn new shape immediately
                this.spawnShape();
            }

            // Check if shape is below the screen
            if (this.currentShape && this.currentShape.y > this.canvas.height) {
                this.gameOver = true;
                document.getElementById('gameMessage').textContent = 'Game Over!';
                document.getElementById('gameOverlay').style.display = 'flex';
                return;
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
            document.getElementById('gameOverlay').style.display = 'flex';
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background with wave effect
        if (this.backgroundImage.complete) {
            const waveOffset = Math.sin(this.backgroundOffset) * this.backgroundWaveAmplitude;
            const scale = 1.05; // Scale up by 5% to prevent black edges
            const scaledWidth = this.canvas.width * scale;
            const scaledHeight = this.canvas.height * scale;
            const offsetX = (scaledWidth - this.canvas.width) / 2;
            const offsetY = (scaledHeight - this.canvas.height) / 2;
            
            this.ctx.drawImage(
                this.backgroundImage,
                -offsetX + waveOffset, -offsetY + waveOffset,
                scaledWidth, scaledHeight
            );
        }

        // Draw clouds
        this.clouds.forEach(cloud => this.drawCloud(cloud));

        // Draw wheel
        this.wheel.draw(this.ctx);

        // Draw fish
        this.fish.forEach(fish => this.drawFish(fish));

        // Draw platforms
        this.platforms.forEach(platform => platform.draw(this.ctx));

        // Draw current shape
        if (this.currentShape) {
            this.currentShape.draw(this.ctx);
            
            // Draw connection lines ONLY to matching holes
            this.wheel.holes.forEach((hole, i) => {
                if (!this.wheel.filledHoles.has(i)) {
                    const holeType = String(hole.type).trim();
                    const currentShapeType = String(this.currentShape.type).trim();
                    
                    // Calculate hole position
                    const holeX = this.wheel.x + Math.cos(hole.angle + this.wheel.rotation) * this.wheel.radius * 0.85;
                    const holeY = this.wheel.y + Math.sin(hole.angle + this.wheel.rotation) * this.wheel.radius * 0.85;
                    
                    this.ctx.save();
                    
                    // Draw the actual shape
                    const shapeSize = 20;
                    this.ctx.translate(holeX, holeY + 5);
                    
                    // Use the same colors as falling shapes
                    let shapeColor;
                    switch (holeType) {
                        case 'circle': shapeColor = '#4CAF50'; break;
                        case 'square': shapeColor = '#FF6B6B'; break;
                        case 'triangle': shapeColor = '#4ECDC4'; break;
                        case 'star': shapeColor = '#FFD700'; break;
                        case 'hexagon': shapeColor = '#FF9800'; break;
                        case 'cross': shapeColor = '#E91E63'; break;
                        case 'heart': shapeColor = '#F44336'; break;
                        case 'moon': shapeColor = '#2196F3'; break;
                        default: shapeColor = '#4CAF50';
                    }
                    
                    // Draw shape based on type
                    switch (holeType) {
                        case 'circle':
                            if (!this.wheel.filledHoles.has(i)) {
                                this.ctx.beginPath();
                                this.ctx.arc(0, 0, shapeSize/2, 0, Math.PI * 2);
                                this.ctx.fillStyle = shapeColor;
                                this.ctx.fill();
                                this.ctx.strokeStyle = 'black';
                                this.ctx.stroke();
                            }
                            break;
                        case 'square':
                            if (!this.wheel.filledHoles.has(i)) {
                                this.ctx.fillStyle = shapeColor;
                                this.ctx.fillRect(-shapeSize/2, -shapeSize/2, shapeSize, shapeSize);
                                this.ctx.strokeStyle = 'black';
                                this.ctx.strokeRect(-shapeSize/2, -shapeSize/2, shapeSize, shapeSize);
                            }
                            break;
                        case 'triangle':
                            if (!this.wheel.filledHoles.has(i)) {
                                this.ctx.beginPath();
                                this.ctx.moveTo(0, -shapeSize/2);
                                this.ctx.lineTo(shapeSize/2, shapeSize/2);
                                this.ctx.lineTo(-shapeSize/2, shapeSize/2);
                                this.ctx.closePath();
                                this.ctx.fillStyle = shapeColor;
                                this.ctx.fill();
                                this.ctx.strokeStyle = 'black';
                                this.ctx.stroke();
                            }
                            break;
                        case 'star':
                            if (!this.wheel.filledHoles.has(i)) {
                                this.ctx.beginPath();
                                for (let i = 0; i < 5; i++) {
                                    const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                                    const innerAngle = outerAngle + Math.PI / 5;
                                    
                                    const outerX = Math.cos(outerAngle) * (shapeSize/2);
                                    const outerY = Math.sin(outerAngle) * (shapeSize/2);
                                    
                                    const innerX = Math.cos(innerAngle) * (shapeSize * 0.2);
                                    const innerY = Math.sin(innerAngle) * (shapeSize * 0.2);
                                    
                                    if (i === 0) this.ctx.moveTo(outerX, outerY);
                                    else this.ctx.lineTo(outerX, outerY);
                                    
                                    this.ctx.lineTo(innerX, innerY);
                                }
                                this.ctx.closePath();
                                this.ctx.fillStyle = shapeColor;
                                this.ctx.fill();
                                this.ctx.strokeStyle = 'black';
                                this.ctx.stroke();
                            }
                            break;
                        case 'hexagon':
                            if (!this.wheel.filledHoles.has(i)) {
                                this.ctx.beginPath();
                                for (let i = 0; i < 6; i++) {
                                    const angle = (i * 2 * Math.PI) / 6;
                                    const x = Math.cos(angle) * shapeSize/2;
                                    const y = Math.sin(angle) * shapeSize/2;
                                    if (i === 0) this.ctx.moveTo(x, y);
                                    else this.ctx.lineTo(x, y);
                                }
                                this.ctx.closePath();
                                this.ctx.fillStyle = shapeColor;
                                this.ctx.fill();
                                this.ctx.strokeStyle = 'black';
                                this.ctx.stroke();
                            }
                            break;
                        case 'cross':
                            if (!this.wheel.filledHoles.has(i)) {
                                this.ctx.beginPath();
                                const armWidth = shapeSize * 0.2;
                                this.ctx.moveTo(-armWidth, -shapeSize/2);
                                this.ctx.lineTo(armWidth, -shapeSize/2);
                                this.ctx.lineTo(armWidth, -armWidth);
                                this.ctx.lineTo(shapeSize/2, -armWidth);
                                this.ctx.lineTo(shapeSize/2, armWidth);
                                this.ctx.lineTo(armWidth, armWidth);
                                this.ctx.lineTo(armWidth, shapeSize/2);
                                this.ctx.lineTo(-armWidth, shapeSize/2);
                                this.ctx.lineTo(-armWidth, armWidth);
                                this.ctx.lineTo(-shapeSize/2, armWidth);
                                this.ctx.lineTo(-shapeSize/2, -armWidth);
                                this.ctx.lineTo(-armWidth, -armWidth);
                                this.ctx.closePath();
                                this.ctx.fillStyle = shapeColor;
                                this.ctx.fill();
                                this.ctx.strokeStyle = 'black';
                                this.ctx.stroke();
                            }
                            break;
                        case 'heart':
                            if (!this.wheel.filledHoles.has(i)) {
                                this.ctx.beginPath();
                                const topWidth = shapeSize * 0.25;
                                const curveHeight = shapeSize * 0.4;
                                this.ctx.moveTo(0, shapeSize * 0.35);
                                this.ctx.bezierCurveTo(-shapeSize/2, 0, -shapeSize/2, -curveHeight, 0, -shapeSize/2);
                                this.ctx.bezierCurveTo(shapeSize/2, -curveHeight, shapeSize/2, 0, 0, shapeSize * 0.35);
                                this.ctx.fillStyle = shapeColor;
                                this.ctx.fill();
                                this.ctx.strokeStyle = 'black';
                                this.ctx.stroke();
                            }
                            break;
                        case 'moon':
                            if (!this.wheel.filledHoles.has(i)) {
                                this.ctx.beginPath();
                                this.ctx.arc(0, 0, shapeSize/2, 0, Math.PI * 2);
                                this.ctx.fillStyle = shapeColor;
                                this.ctx.fill();
                                
                                this.ctx.beginPath();
                                this.ctx.arc(shapeSize/5, 0, shapeSize/3, 0, Math.PI * 2);
                                this.ctx.fillStyle = '#1a1a2e';
                                this.ctx.fill();
                                
                                this.ctx.strokeStyle = 'black';
                                this.ctx.beginPath();
                                this.ctx.arc(0, 0, shapeSize/2, 0, Math.PI * 2);
                                this.ctx.stroke();
                            }
                            break;
                    }
                    
                    this.ctx.restore();
                    
                    // Only draw connection and distance for MATCHING types
                    if (currentShapeType === holeType) {
                        // Calculate distance for collision detection only
                        const dist = Math.sqrt(
                            Math.pow(this.currentShape.x - holeX, 2) + 
                            Math.pow(this.currentShape.y - holeY, 2)
                        );
                    }
                }
            });
        }

        // Draw score with better visibility
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.textAlign = 'left';
        this.ctx.strokeText(`Score: ${this.score}`, 20, 40);
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);

        // Draw level counter on the right side
        this.ctx.textAlign = 'right';
        this.ctx.strokeText(`Level ${this.level}`, this.canvas.width - 20, 40);
        this.ctx.fillText(`Level ${this.level}`, this.canvas.width - 20, 40);
        this.ctx.textAlign = 'left';

        // Draw screen fade
        this.drawScreenFade();

        if (this.gameOver) {
            document.getElementById('gameOverlay').style.display = 'flex';
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 