const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load spaceship image
const playerImg = new Image();
playerImg.src = './Assets/Images/SpaceShip Logo.png';

const heartImg = new Image();
heartImg.src = './Assets/Images/heart.png';

// Game variables
const player = {
    x: Math.random() * (canvas.width - 50),
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5
};
const keys = {};
const gameAreaHeightLimit = canvas.height * 0.6;

// Game state
let score = 0;
let lives = 3;
let startTime;
let gameDuration;
let shootKey;

// Bad spaceships
const enemyRows = 4;
const enemyCols = 5;
const enemyWidth = 50;
const enemyHeight = 40;
const enemyGapX = 70;
const enemyGapY = 50;
const enemyColors = ['#ff5e57', '#feca57', '#48dbfb', '#1dd1a1'];

let enemies = [];
let enemyDirection = 1;
let enemySpeed = 0.5;
let speedBoostCount = 0;
let lastSpeedIncreaseTime = Date.now();
const maxSpeedBoosts = 4;
const speedIncreaseInterval = 5000;

// Bullets
let bullets = [];
const bulletSpeed = 8;

function createEnemies() {
    enemies = [];
    for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
            const x = col * (enemyWidth + enemyGapX) + 100;
            const y = row * (enemyHeight + enemyGapY) + 50;
            enemies.push({ x, y, width: enemyWidth, height: enemyHeight, color: enemyColors[row], row });
        }
    }
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function moveEnemies() {
    let reachedEdge = false;
    for (const enemy of enemies) {
        enemy.x += enemyDirection * enemySpeed;
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            reachedEdge = true;
        }
    }
    if (reachedEdge) {
        enemyDirection *= -1;
    }

    const now = Date.now();
    if (speedBoostCount < maxSpeedBoosts && now - lastSpeedIncreaseTime >= speedIncreaseInterval) {
        enemySpeed += 0.5; // Increase speed
        speedBoostCount++;
        lastSpeedIncreaseTime = now;
    }
}

document.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (e.key.toLowerCase() === (shootKey || ' ')) {
        bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10
        });
    }
});

document.addEventListener('keyup', e => keys[e.key] = false);

function drawPlayer() {
    if (playerImg.complete) {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }
}

function drawBullets() {
    ctx.fillStyle = 'white';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function updateBullets() {
    bullets.forEach(bullet => bullet.y -= bulletSpeed);

    // Remove off-screen bullets
    bullets = bullets.filter(bullet => bullet.y + bullet.height > 0);

    // Check for collisions
    bullets.forEach((bullet, i) => {
        enemies.forEach((enemy, j) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                const rowScore = [20, 15, 10, 5];
                score += rowScore[enemy.row];
            }
        });
    });
}

function drawHUD() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);

    for (let i = 0; i < lives; i++) {
        if (heartImg.complete) {
            ctx.drawImage(heartImg, canvas.width - 40 * (i + 1), 10, 30, 30);
        }
    }

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, Math.ceil((gameDuration - elapsed) / 1000));
    ctx.fillText(`Time Left: ${remaining}s`, canvas.width / 2 - 50, 30);

    if (elapsed >= gameDuration) {
        endGame();
    }
}

function update() {
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && (player.x + player.width) < canvas.width) player.x += player.speed;
    if (keys['ArrowUp'] && player.y > gameAreaHeightLimit) player.y -= player.speed;
    if (keys['ArrowDown'] && (player.y + player.height) < canvas.height) player.y += player.speed;

    moveEnemies();
    updateBullets();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawBullets();
    drawHUD();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function endGame() {
    alert('⏰ Game Over!');
    window.location.reload();
}

function initGame() {
    createEnemies();
    startTime = Date.now();
    gameDuration = (window.config?.gameTime || 2) * 60 * 1000;
    shootKey = window.config?.shootKey || ' ';
    gameLoop();
}
