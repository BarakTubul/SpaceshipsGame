// Audio
const victorySound = new Audio('./Assets/Audio/victory.mp3');
const lostSound = new Audio('./Assets/Audio/lost.mp3');
const bgMusic = new Audio('./Assets/Audio/background.mp3');
bgMusic.loop = true;

const hitSound = new Audio('./Assets/Audio/hit.mp3');
const loseLifeSound = new Audio('./Assets/Audio/lost-life.mp3');

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
let initialPlayerPosition;

let player;
const keys = {};
const gameAreaHeightLimit = canvas.height * 0.6;

// Game state
let score;
let lives;
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


// Enemy movement
let enemies;
let enemyDirection;
let enemySpeed;
let speedBoostCount;
let lastSpeedIncreaseTime;
const maxSpeedBoosts = 4;
const speedIncreaseInterval = 5000;
// Bullets
let bullets;
const bulletSpeed = 8;

// Enemy bullets
let enemyBullets;
const enemyBulletSpeed = 4;
let lastEnemyShotY;

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
        enemySpeed += 0.5;
        speedBoostCount++;
        lastSpeedIncreaseTime = now;
    }

    // Enemy shooting
    if (enemyBullets.length === 0 || enemyBullets[enemyBullets.length - 1].y > canvas.height * 0.75) {
        const shooter = enemies[Math.floor(Math.random() * enemies.length)];
        if (shooter) {
            enemyBullets.push({
                x: shooter.x + shooter.width / 2 - 2,
                y: shooter.y + shooter.height,
                width: 4,
                height: 10
            });
        }
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

// Handle New Game Button
document.getElementById("newGameButton")?.addEventListener("click", () => {
    console.log("New Game button clicked");
    isGameRunning = false; // Stop the current game loop
    bgMusic.pause();       // Stop background music
    bgMusic.currentTime = 0;

    showScreen("Game");    // Re-load the game screen
});


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

    ctx.fillStyle = 'red';
    enemyBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function updateBullets() {
    bullets.forEach(bullet => bullet.y -= bulletSpeed);
    bullets = bullets.filter(bullet => bullet.y + bullet.height > 0);

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
                hitSound.play();
            }
        });
    });

    enemyBullets.forEach((bullet, index) => {
        bullet.y += enemyBulletSpeed;
        if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            lives--;
            player.x = initialPlayerPosition.x;
            player.y = initialPlayerPosition.y;
            enemyBullets.splice(index, 1);
            loseLifeSound.play();
            if (lives <= 0) {
                endGame('lives');
            }
        }
    });

    enemyBullets = enemyBullets.filter(bullet => bullet.y < canvas.height);
}

function drawHUD() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width * 0.05, canvas.height * 0.05);

    for (let i = 0; i < lives; i++) {
        if (heartImg.complete) {
            ctx.drawImage(heartImg, canvas.width - 40 * (i + 1), 10, 30, 30);
        }
    }

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, Math.ceil((gameDuration - elapsed) / 1000));
    ctx.fillText(`Time Left: ${remaining}s`, canvas.width / 2 - 50, 30);

    if (elapsed >= gameDuration) {
        endGame('time');
    }
}

function update() {
    if (enemies.length === 0) {
        endGame('allEnemiesKilled');
        return;
    }
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

let isGameRunning;
let animationFrameId = null;

function gameLoop() {
    if (!isGameRunning) return;
    update();
    draw();
    animationFrameId = requestAnimationFrame(gameLoop); // Save the ID
}

function endGame(reason) {
    isGameRunning = false;
    bgMusic.pause();
    bgMusic.currentTime = 0;

    let message = "";

    if (reason === 'lives') {
        message = "You Lost!";
        lostSound.play();
    } else if (reason === 'time') {
        if (score < 100) {
            message = `You can do better. Score: ${score}`;
            lostSound.play();
        } else {
            message = `Winner! Score: ${score}`;
            victorySound.play();
        }
    } else if (reason === 'allEnemiesKilled') {
        message = `Champion! Score: ${score}`;
        victorySound.play();
    }
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-GB'); // HH:MM:SS
    window.scores.push({ score, time: timeString });

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = 'center';

        ctx.fillStyle = '#ffd700';
        ctx.font = '48px Arial';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = '24px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Click anywhere to continue', canvas.width / 2, canvas.height / 2 + 30);

        ctx.font = '16px Arial';
        ctx.fillStyle = '#999';
        canvas.addEventListener('click', () => showScreen("HighScores"), { once: true });
    }, 300);
}


// Removed duplicate showEndScreen function as it is now inline in endGame

function initGame() {
    // 🛠 Cancel any previous animation frame
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // Game variables
    initialPlayerPosition = {
        x: Math.random() * (canvas.width - 50),
        y: canvas.height - 60
    };

    player = {
        x: initialPlayerPosition.x,
        y: initialPlayerPosition.y,
        width: 50,
        height: 50,
        speed: 5
    };

    enemies = [];
    enemyDirection = 1;
    enemySpeed = 0.5;
    speedBoostCount = 0;
    lastSpeedIncreaseTime = Date.now();
    bullets = [];
    enemyBullets = [];
    lastEnemyShotY = canvas.height; // Start as bottom so first shot is allowed
    score = 0;
    lives = 3;


    isGameRunning = true;
    bgMusic.play().catch(() => {});
    createEnemies();
    startTime = Date.now();
    gameDuration = (window.config?.gameTime || 2) * 60 * 1000;
    shootKey = window.config?.shootKey || ' ';
    gameLoop();
}
