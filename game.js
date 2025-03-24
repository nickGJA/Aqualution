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
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        switch (this.type) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'square':
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'star':
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    const x = Math.cos(angle) * this.size / 2;
                    const y = Math.sin(angle) * this.size / 2;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(this.size / 2, 0);
                ctx.lineTo(0, this.size / 2);
                ctx.lineTo(-this.size / 2, 0);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'hexagon':
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i * 2 * Math.PI) / 6;
                    const x = Math.cos(angle) * this.size / 2;
                    const y = Math.sin(angle) * this.size / 2;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'cross':
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 6, -this.size / 2, this.size / 3, this.size);
                ctx.fillRect(-this.size / 2, -this.size / 6, this.size, this.size / 3);
                break;
            case 'heart':
                ctx.beginPath();
                ctx.moveTo(0, this.size / 4);
                ctx.bezierCurveTo(
                    -this.size / 4, -this.size / 4,
                    -this.size / 2, -this.size / 4,
                    0, -this.size / 2
                );
                ctx.bezierCurveTo(
                    this.size / 2, -this.size / 4,
                    this.size / 4, -this.size / 4,
                    0, this.size / 4
                );
                ctx.fillStyle = this.color;
                ctx.fill();
                break;
            case 'moon':
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.size / 4, 0, this.size / 3, 0, Math.PI * 2);
                ctx.fillStyle = '#1a1a2e';
                ctx.fill();
                break;
            case 'spiral':
                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = i * Math.PI / 4;
                    const radius = this.size / 2 * (1 - i / 8);
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
        
        ctx.restore();
    }

    update() {
        if (this.isMatched) {
            // Animate matching effect
            this.matchScale = Math.min(1.2, this.matchScale + 0.1);
            this.matchRotation += 0.1;
            this.rotation = this.matchRotation;
        } else {
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
        this.radius = Math.min(window.innerWidth, window.innerHeight) * 0.3; // Doubled the size
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
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw wheel body with gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        gradient.addColorStop(0, '#4a4a4a');
        gradient.addColorStop(1, '#2a2a2a');

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw wheel border
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw holes
        this.holes.forEach((hole, index) => {
            if (!this.filledHoles.has(index)) {
                ctx.save();
                ctx.rotate(hole.angle);
                ctx.translate(0, -this.radius * 0.7);
                ctx.rotate(-hole.angle - this.rotation);

                // Draw hole outline
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 2;
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
                ctx.stroke();
                ctx.restore();
            }
        });

        ctx.restore();
    }

    rotate(direction) {
        this.rotation += direction * 0.1;
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
                    const holeX = Math.cos(holeAngle) * this.radius * 0.7;
                    const holeY = Math.sin(holeAngle) * this.radius * 0.7;
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

        // Touch controls
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.gameOver) {
                this.isSpeedBoosted = true;
                if (this.currentShape) {
                    this.currentShape.setSpeed(true);
                }
            }
            this.touchStartX = e.touches[0].clientX;
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
            }
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.startGame();
        });
    }

    startGame() {
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
                // Add matched shape to shapes array
                this.shapes.push(this.currentShape);
                this.currentShape = null;
                this.lastSpawnTime = currentTime;
            }

            // Check if shape is below the screen
            if (this.currentShape.y > this.canvas.height) {
                this.currentShape = null;
                this.lastSpawnTime = currentTime;
            }
        }

        // Update matched shapes
        this.shapes.forEach(shape => {
            if (shape.isMatched) {
                shape.update();
            }
        });

        // Spawn new shape after interval
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

        // Draw matched shapes
        this.shapes.forEach(shape => {
            if (shape.isMatched) {
                this.ctx.save();
                this.ctx.translate(this.wheel.x, this.wheel.y);
                this.ctx.rotate(shape.matchAngle);
                this.ctx.translate(shape.matchX, shape.matchY);
                this.ctx.rotate(shape.matchRotation);
                this.ctx.scale(shape.matchScale, shape.matchScale);
                shape.draw(this.ctx);
                this.ctx.restore();
            }
        });

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