// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// Get the menu and all menu buttons
const menu = document.getElementById('menu');
const buttons = document.querySelectorAll('.menu-btn');

// Function to create the game HUD (top info bar)
function createHUD(money, hunger, food, health, timerSeconds) {
    const hud = document.createElement('div');
    hud.id = 'hud';
    hud.className = 'hud-grid';

    // --- Counter stacks (2x2 grid) ---
    const countersGrid = document.createElement('div');
    countersGrid.className = 'counters-grid';

    // Money (top left)
    const moneyStack = document.createElement('div');
    moneyStack.className = 'counter-stack';
    const moneyLabel = document.createElement('span');
    moneyLabel.textContent = 'MONEY';
    moneyLabel.className = 'counter-label';
    moneyStack.appendChild(moneyLabel);
    const moneyCounter = document.createElement('span');
    moneyCounter.className = 'counter-value';
    moneyCounter.innerHTML = `<span class="coin-icon"></span>x ${money}`;
    moneyStack.appendChild(moneyCounter);

    // Hunger (bottom left)
    const hungerStack = document.createElement('div');
    hungerStack.className = 'counter-stack';
    const hungerLabel = document.createElement('span');
    hungerLabel.textContent = 'HUNGER';
    hungerLabel.className = 'counter-label';
    hungerStack.appendChild(hungerLabel);
    // Hunger bar
    const hungerBarWrap = document.createElement('span');
    hungerBarWrap.className = 'counter-value';
    const hungerBarOuter = document.createElement('span');
    hungerBarOuter.className = 'hunger-bar-outer';
    const hungerBar = document.createElement('span');
    hungerBar.className = 'hunger-bar-inner';
    hungerBar.id = 'hunger-bar';
    hungerBar.style.width = `${hunger}%`;
    hungerBarOuter.appendChild(hungerBar);
    hungerBarWrap.appendChild(hungerBarOuter);
    hungerStack.appendChild(hungerBarWrap);

    // Food (top right)
    const foodStack = document.createElement('div');
    foodStack.className = 'counter-stack';
    const foodLabel = document.createElement('span');
    foodLabel.textContent = 'FOOD';
    foodLabel.className = 'counter-label';
    foodStack.appendChild(foodLabel);
    const foodCounter = document.createElement('span');
    foodCounter.className = 'counter-value';
    foodCounter.innerHTML = `<span class="food-icon"></span>x ${food}`;
    foodStack.appendChild(foodCounter);

    // Health (bottom right)
    const healthStack = document.createElement('div');
    healthStack.className = 'counter-stack';
    const healthLabel = document.createElement('span');
    healthLabel.textContent = 'HEALTH';
    healthLabel.className = 'counter-label';
    healthStack.appendChild(healthLabel);
    const healthCounter = document.createElement('span');
    healthCounter.className = 'counter-value';
    healthCounter.innerHTML = `<span class="heart-icon">❤</span>x ${health}`;
    healthStack.appendChild(healthCounter);

    // Add stacks to grid
    countersGrid.appendChild(moneyStack);
    countersGrid.appendChild(foodStack);
    countersGrid.appendChild(hungerStack);
    countersGrid.appendChild(healthStack);

    // --- Timer section ---
    const timerSection = document.createElement('div');
    timerSection.className = 'timer-section';
    const timerLabel = document.createElement('span');
    timerLabel.textContent = 'TIME';
    timerLabel.className = 'counter-label';
    timerSection.appendChild(timerLabel);
    const timerDiv = document.createElement('span');
    timerDiv.id = 'timer';
    timerDiv.className = 'counter-value';
    timerDiv.textContent = formatTime(timerSeconds);
    timerSection.appendChild(timerDiv);

    // Add grid and timer to HUD
    hud.appendChild(countersGrid);
    hud.appendChild(timerSection);

    return hud;
}

// Helper to format seconds as MM:SS
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Function to create the game area with random platforms and player
function createGameArea() {
    // Create the game area container
    const gameArea = document.createElement('div');
    gameArea.id = 'game-area';
    gameArea.style.position = 'relative';
    gameArea.style.width = '100vw';
    gameArea.style.maxWidth = '600px';
    gameArea.style.height = '400px';
    gameArea.style.margin = '32px auto 0 auto';
    gameArea.style.background = '#181818';
    gameArea.style.border = '2px solid #fff';
    gameArea.style.borderRadius = '12px';
    gameArea.style.overflow = 'hidden';
    gameArea.style.display = 'flex';
    gameArea.style.alignItems = 'flex-end';

    // Game variables
    const areaWidth = 600;
    const areaHeight = 400;
    const platformCount = 8;
    const platformMinGapY = 40;
    const platformMaxGapY = 70;
    const platformMinWidth = 80;
    const platformMaxWidth = 120;
    const platformHeight = 16;

    // Store platforms as objects for collision
    let platforms = [];

    // Helper to generate a platform at a given y
    function createPlatform(y) {
        // Random width and x position
        const width = platformMinWidth + Math.floor(Math.random() * (platformMaxWidth - platformMinWidth));
        const x = Math.floor(Math.random() * (areaWidth - width - 20)) + 10;
        // Alternate colors
        const color = Math.random() < 0.5 ? '#BF6C46' : '#77A8BB';

        // Create platform div
        const platform = document.createElement('div');
        platform.className = 'platform';
        platform.style.position = 'absolute';
        platform.style.left = `${x}px`;
        platform.style.top = `${y}px`;
        platform.style.width = `${width}px`;
        platform.style.height = `${platformHeight}px`;
        platform.style.background = color;
        platform.style.border = '2px solid #222';
        platform.style.borderRadius = '6px';
        platform.style.boxShadow = '0 2px 0 #222';
        platform.setAttribute('aria-label', 'Platform');

        // Add to DOM and array
        gameArea.appendChild(platform);
        platforms.push({el: platform, x, y, width, height: platformHeight});
    }

    // Generate initial platforms, spaced vertically so they don't touch
    let y = areaHeight - 40;
    for (let i = 0; i < platformCount; i++) {
        createPlatform(y);
        y -= platformMinGapY + Math.floor(Math.random() * (platformMaxGapY - platformMinGapY));
    }

    // Add the player avatar
    const player = document.createElement('div');
    player.id = 'player';
    player.style.position = 'absolute';
    player.style.width = '28px';
    player.style.height = '28px';
    player.style.left = `${platforms[0].x + platforms[0].width / 2 - 14}px`;
    player.style.top = `${platforms[0].y - 28}px`;
    player.style.background = '#FFC907';
    player.style.border = '2px solid #fff';
    player.style.borderRadius = '6px';
    player.style.boxShadow = '0 2px 0 #222';
    player.style.display = 'flex';
    player.style.alignItems = 'center';
    player.style.justifyContent = 'center';
    player.style.fontSize = '1.2rem';
    player.style.zIndex = '2';
    player.textContent = '🙂'; // Simple avatar
    gameArea.appendChild(player);

    // Player physics variables
    let px = platforms[0].x + platforms[0].width / 2 - 14;
    let py = platforms[0].y - 28;
    let vx = 0;
    let vy = 0;
    let onGround = false;
    let jumpPower = -15;
    let gravity = 0.5;
    let moveSpeed = 4;
    let scrollY = 0;
    let maxPlayerY = py;

    // Keyboard controls
    let leftPressed = false;
    let rightPressed = false;
    let jumpPressed = false;

    // Listen for keydown and keyup
    document.addEventListener('keydown', function(e) {
        // Prevent default scrolling for space and arrow keys
        if (
            e.code === 'Space' ||
            e.code === 'ArrowUp' ||
            e.code === 'ArrowDown' ||
            e.code === 'ArrowLeft' ||
            e.code === 'ArrowRight'
        ) {
            e.preventDefault();
        }
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') leftPressed = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') rightPressed = true;
        if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && onGround) jumpPressed = true;
    });
    document.addEventListener('keyup', function(e) {
        // Prevent default scrolling for space and arrow keys
        if (
            e.code === 'Space' ||
            e.code === 'ArrowUp' ||
            e.code === 'ArrowDown' ||
            e.code === 'ArrowLeft' ||
            e.code === 'ArrowRight'
        ) {
            e.preventDefault();
        }
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') leftPressed = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') rightPressed = false;
    });

    // Game loop
    function gameLoop() {
        // Move left/right
        if (leftPressed) vx = -moveSpeed;
        else if (rightPressed) vx = moveSpeed;
        else vx = 0;

        // Jump
        if (jumpPressed && onGround) {
            vy = jumpPower;
            onGround = false;
            jumpPressed = false;
        }

        // Apply gravity
        vy += gravity;

        // Update player position
        px += vx;
        py += vy;

        // Prevent player from going out of bounds horizontally
        if (px < 0) px = 0;
        if (px > areaWidth - 28) px = areaWidth - 28;

        // Platform collision (simple AABB)
        onGround = false;
        for (let plat of platforms) {
            // Check if player is falling and feet are above platform
            if (
                py + 28 <= plat.y + vy && // was above platform last frame
                py + 28 + vy >= plat.y && // will be at or below platform this frame
                px + 24 > plat.x && px + 4 < plat.x + plat.width // horizontally overlapping
            ) {
                // Land on platform
                py = plat.y - 28;
                vy = 0;
                onGround = true;
            }
        }

        // If player falls below screen, reset to top platform
        if (py > areaHeight) {
            // Reset to highest platform
            const topPlat = platforms.reduce((a, b) => (a.y < b.y ? a : b));
            px = topPlat.x + topPlat.width / 2 - 14;
            py = topPlat.y - 28;
            vy = 0;
            scrollY = 0;
        }

        // Scroll platforms down as player moves up
        if (py < areaHeight / 2) {
            const diff = areaHeight / 2 - py;
            py = areaHeight / 2;
            scrollY += diff;
            // Move all platforms down
            for (let plat of platforms) {
                plat.y += diff;
                plat.el.style.top = `${plat.y}px`;
            }
        }

        // Remove platforms that go off the bottom and add new ones at the top
        platforms = platforms.filter(plat => plat.y < areaHeight);
        while (platforms.length < platformCount) {
            // Find highest platform
            const highest = platforms.reduce((a, b) => (a.y < b.y ? a : b), {y: areaHeight});
            // New y above highest
            const newY = highest.y - (platformMinGapY + Math.floor(Math.random() * (platformMaxGapY - platformMinGapY)));
            createPlatform(newY);
        }

        // Update player DOM position
        player.style.left = `${px}px`;
        player.style.top = `${py}px`;

        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    requestAnimationFrame(gameLoop);

    return gameArea;
}

// Function to show a new screen with a message or the game
function showScreen(message) {
    // Hide the menu
    menu.style.display = 'none';

    // Remove any old screen if present
    const oldScreen = document.getElementById('screen');
    if (oldScreen) {
        oldScreen.remove();
    }

    // If message is "GAME", show the game screen
    if (message === 'GAME') {
        // Create the game screen container
        const screen = document.createElement('div');
        screen.id = 'screen';
        screen.style.display = 'flex';
        screen.style.flexDirection = 'column';
        screen.style.alignItems = 'center';
        screen.style.justifyContent = 'flex-start';
        screen.style.minHeight = '100vh';
        screen.style.color = '#fff';
        screen.style.fontFamily = `'Press Start 2P', monospace`;
        screen.style.fontSize = '1.2rem';
        screen.setAttribute('role', 'region');
        screen.setAttribute('tabindex', '-1');
        screen.setAttribute('aria-label', 'Game Screen');

        // Add HUD at the top (example values)
        const startTime = 180; // 3 minutes in seconds
        let timeLeft = startTime;
        const hud = createHUD(3, 80, 2, 5, timeLeft);
        screen.appendChild(hud);

        // Add the game area with platforms
        const gameArea = createGameArea();
        screen.appendChild(gameArea);

        // Timer countdown
        let timerInterval = setInterval(() => {
            timeLeft--;
            const timerDiv = document.getElementById('timer');
            if (timerDiv) timerDiv.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                // Show game over message
                alert('Time is up!');
            }
        }, 1000);

        // Add a back button to return to menu
        const backBtn = document.createElement('button');
        backBtn.textContent = 'Back to Menu';
        backBtn.className = 'menu-btn';
        backBtn.style.marginTop = '32px';
        backBtn.onclick = function() {
            clearInterval(timerInterval);
            screen.remove();
            menu.style.display = 'flex';
            const title = document.getElementById('main-title');
            if (title) {
                title.focus();
            }
        };
        backBtn.setAttribute('aria-label', 'Back to Main Menu');
        screen.appendChild(backBtn);

        // Add the new screen to the body
        document.body.appendChild(screen);

        // Move focus to the new screen for accessibility
        screen.focus();
        return;
    }

    // Otherwise, show a simple message screen
    const screen = document.createElement('div');
    screen.id = 'screen';
    screen.style.display = 'flex';
    screen.style.flexDirection = 'column';
    screen.style.alignItems = 'center';
    screen.style.justifyContent = 'center';
    screen.style.minHeight = '100vh';
    screen.style.color = '#fff';
    screen.style.fontFamily = `'Press Start 2P', monospace`;
    screen.style.fontSize = '1.2rem';
    screen.setAttribute('role', 'region');
    screen.setAttribute('tabindex', '-1');
    screen.setAttribute('aria-label', 'Game Screen');

    const msg = document.createElement('div');
    msg.textContent = message;
    msg.style.textAlign = 'center';
    msg.style.maxWidth = '90vw';
    screen.appendChild(msg);

    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back to Menu';
    backBtn.className = 'menu-btn';
    backBtn.style.marginTop = '32px';
    backBtn.onclick = function() {
        screen.remove();
        menu.style.display = 'flex';
        const title = document.getElementById('main-title');
        if (title) {
            title.focus();
        }
    };
    backBtn.setAttribute('aria-label', 'Back to Main Menu');
    screen.appendChild(backBtn);

    document.body.appendChild(screen);
    screen.focus();
}

// Add click event listeners to each button
buttons[0].onclick = function() {
    // Start button: show the game screen
    showScreen('GAME');
};
buttons[1].onclick = function() {
    // How to Play button
    showScreen('How to Play: Use your skills to help bring water to those in need!');
};
buttons[2].onclick = function() {
    // About Charity: Water button
    showScreen('Charity: Water is a non-profit bringing clean water to people in need.');
};

// Add keyboard accessibility: allow Enter/Space to activate buttons
buttons.forEach(btn => {
    btn.addEventListener('keyup', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            btn.click();
        }
    });
});
