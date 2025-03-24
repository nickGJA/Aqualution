class Shape {
    constructor(type, x, y) {
        this.type = type; // 'circle', 'square', or 'triangle'
        this.x = x;
        this.y = y;
        this.size = 30;
        this.speed = 2;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        switch (this.type) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'square':
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fill();
                break;
        }
        
        ctx.restore();
    }

    update() {
        this.y += this.speed;
    }
}

class Wheel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 100;
        this.rotation = 0;
        this.holes = [
            { type: 'circle', angle: 0 },
            { type: 'square', angle: Math.PI * 2 / 3 },
            { type: 'triangle', angle: Math.PI * 4 / 3 }
        ];
        this.filledHoles = new Set();
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw wheel body
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#4a4a4a';
        ctx.fill();
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
                }
                ctx.fillStyle = '#2a2a2a';
                ctx.fill();
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

        if (distance < this.radius + shape.size / 2) {
            const angle = Math.atan2(shape.y - wheelCenter.y, shape.x - wheelCenter.x);
            const normalizedAngle = (angle - this.rotation + Math.PI * 2) % (Math.PI * 2);

            for (let i = 0; i < this.holes.length; i++) {
                const holeAngle = this.holes[i].angle;
                const angleDiff = Math.abs(normalizedAngle - holeAngle);

                if (angleDiff < 0.3 && shape.type === this.holes[i].type && !this.filledHoles.has(i)) {
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
        this.canvas.width = 800;
        this.canvas.height = 600;

        this.wheel = new Wheel(this.canvas.width / 2, this.canvas.height - 150);
        this.shapes = [];
        this.gameOver = false;
        this.score = 0;
        this.touchStartX = 0;
        this.lastSpawnTime = 0;
        this.spawnInterval = 2000; // 2 seconds between shapes
        this.currentShape = null;

        this.setupEventListeners();
        this.lockOrientation();
        this.startGame();
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
            }
        });

        // Touch controls
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchStartX = e.touches[0].clientX;
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
        
        const types = ['circle', 'square', 'triangle'];
        const type = types[Math.floor(Math.random() * types.length)];
        // Always spawn shape in the center of the screen
        const x = this.canvas.width / 2;
        const y = 0;
        this.currentShape = new Shape(type, x, y);
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
                this.currentShape = null;
                this.lastSpawnTime = currentTime;
            }

            // Check if shape is below the wheel
            if (this.currentShape.y > this.canvas.height) {
                this.gameOver = true;
                this.currentShape = null;
            }
        }

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

        // Draw current shape
        if (this.currentShape) {
            this.currentShape.draw(this.ctx);
        }

        // Draw wheel
        this.wheel.draw(this.ctx);

        // Draw score
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
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