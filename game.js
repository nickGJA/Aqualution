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

        // Debug logging for collision detection
        console.log(`Checking collision for shape: ${shape.type}`);
        console.log(`Distance from wheel center: ${distance}`);
        console.log(`Collision zone: ${this.radius - shape.size} to ${this.radius + shape.size}`);

        // Check if shape is near the wheel's edge
        if (distance < this.radius + shape.size && distance > this.radius - shape.size) {
            console.log(`Shape is near wheel edge`);
            
            // Fix type once for comparison
            const fallingShapeType = String(shape.type).trim();
            
            // Check each hole for a match - ONLY THE SAME TYPE
            for (let i = 0; i < this.holes.length; i++) {
                // Examine hole type for debugging
                const holeType = String(this.holes[i].type).trim();
                console.log(`Examining hole ${i}: type=${holeType}, falling shape type=${fallingShapeType}`);
                
                // Only check unfilled holes WITH MATCHING TYPE
                if (!this.filledHoles.has(i) && fallingShapeType === holeType) {
                    // Calculate the hole's position on the wheel, accounting for rotation
                    const holeX = this.x + Math.cos(this.holes[i].angle + this.rotation) * this.radius * 0.85;
                    const holeY = this.y + Math.sin(this.holes[i].angle + this.rotation) * this.radius * 0.85;
                    
                    // Calculate distance between falling shape and hole
                    const holeDistance = Math.sqrt(
                        Math.pow(shape.x - holeX, 2) + 
                        Math.pow(shape.y - holeY, 2)
                    );
                    
                    console.log(`MATCHING Hole ${i}: type=${holeType}, shape type=${fallingShapeType}, distance=${holeDistance}`);
                    
                    // If shapes are close enough - type match already confirmed
                    if (holeDistance < shape.size * 1.5) {
                        console.log(`MATCH FOUND! Shape: ${fallingShapeType}, Hole: ${holeType}`);
                        
                        // Mark the hole as filled
                        this.filledHoles.add(i);
                        
                        // Start the matching animation
                        shape.startMatch(holeX, holeY, this.holes[i].angle + this.rotation);
                        
                        // Return true to indicate a successful match
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
            return;
        }
        
        // Select a random hole type from the available unfilled holes
        const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        const type = String(randomHole.type).trim();
        
        // Log for debugging
        console.log(`Spawning shape of type: ${type}`);
        
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
                        // Calculate distance
                        const dist = Math.sqrt(
                            Math.pow(this.currentShape.x - holeX, 2) + 
                            Math.pow(this.currentShape.y - holeY, 2)
                        );
                        
                        // Draw line
                        this.ctx.save();
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.currentShape.x, this.currentShape.y);
                        this.ctx.lineTo(holeX, holeY);
                        
                        // Color based on distance only (type match already confirmed)
                        const isCloseEnough = dist < this.currentShape.size * 1.5;
                        
                        if (isCloseEnough) {
                            this.ctx.strokeStyle = 'lime';
                            this.ctx.lineWidth = 3;
                        } else {
                            this.ctx.strokeStyle = 'yellow';
                            this.ctx.lineWidth = 1;
                        }
                        
                        this.ctx.stroke();
                        
                        // Add text for debugging
                        const midX = (this.currentShape.x + holeX) / 2;
                        const midY = (this.currentShape.y + holeY) / 2;
                        
                        this.ctx.font = '12px Arial';
                        this.ctx.textAlign = 'center';
                        this.ctx.textBaseline = 'middle';
                        this.ctx.fillStyle = 'white';
                        this.ctx.strokeStyle = 'black';
                        this.ctx.lineWidth = 2;
                        
                        const text = `${Math.round(dist)}px | ${holeType}`;
                        this.ctx.strokeText(text, midX, midY);
                        this.ctx.fillText(text, midX, midY);
                        
                        this.ctx.restore();
                    }
                }
            });
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