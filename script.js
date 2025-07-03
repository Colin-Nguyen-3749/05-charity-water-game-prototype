// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// Get the menu and all menu buttons
const menu = document.getElementById('menu');
const buttons = document.querySelectorAll('.menu-btn');

// Function to create the game HUD (top info bar)
function createHUD(money, hunger, food, health) {
    // Create the HUD container
    const hud = document.createElement('div');
    hud.id = 'hud';
    hud.style.display = 'flex';
    hud.style.alignItems = 'center';
    hud.style.justifyContent = 'space-between';
    hud.style.width = '100%';
    hud.style.maxWidth = '600px';
    hud.style.margin = '0 auto';
    hud.style.background = '#111';
    hud.style.border = '2px solid #fff';
    hud.style.borderRadius = '12px';
    hud.style.padding = '16px 12px 12px 12px';
    hud.style.boxSizing = 'border-box';
    hud.style.fontFamily = `'Press Start 2P', monospace`;
    hud.style.fontSize = '0.8rem';
    hud.style.marginTop = '24px';

    // Money counter
    const moneyDiv = document.createElement('div');
    moneyDiv.style.display = 'flex';
    moneyDiv.style.alignItems = 'center';
    // Coin icon (simple yellow circle)
    const coin = document.createElement('span');
    coin.style.display = 'inline-block';
    coin.style.width = '18px';
    coin.style.height = '18px';
    coin.style.background = '#FFC907';
    coin.style.border = '2px solid #fff';
    coin.style.borderRadius = '50%';
    coin.style.marginRight = '8px';
    coin.style.verticalAlign = 'middle';
    coin.setAttribute('aria-label', 'Coin');
    moneyDiv.appendChild(coin);
    // Amount
    const moneyText = document.createElement('span');
    moneyText.textContent = `x ${money}`;
    moneyDiv.appendChild(moneyText);

    // Hunger bar (below money)
    const hungerDiv = document.createElement('div');
    hungerDiv.style.marginTop = '8px';
    hungerDiv.style.width = '70px';
    hungerDiv.style.height = '12px';
    hungerDiv.style.background = '#333';
    hungerDiv.style.border = '2px solid #fff';
    hungerDiv.style.borderRadius = '6px';
    hungerDiv.style.overflow = 'hidden';
    // Actual hunger bar
    const hungerBar = document.createElement('div');
    hungerBar.style.height = '100%';
    hungerBar.style.width = `${hunger}%`;
    hungerBar.style.background = '#FF902A';
    hungerBar.style.transition = 'width 0.3s';
    hungerBar.id = 'hunger-bar';
    hungerDiv.appendChild(hungerBar);

    // Food counter
    const foodDiv = document.createElement('div');
    foodDiv.style.display = 'flex';
    foodDiv.style.alignItems = 'center';
    // Food icon (simple green square)
    const foodIcon = document.createElement('span');
    foodIcon.style.display = 'inline-block';
    foodIcon.style.width = '18px';
    foodIcon.style.height = '18px';
    foodIcon.style.background = '#4FCB53';
    foodIcon.style.border = '2px solid #fff';
    foodIcon.style.borderRadius = '4px';
    foodIcon.style.marginRight = '8px';
    foodIcon.setAttribute('aria-label', 'Food');
    foodDiv.appendChild(foodIcon);
    // Amount
    const foodText = document.createElement('span');
    foodText.textContent = `x ${food}`;
    foodDiv.appendChild(foodText);

    // Health counter (below food)
    const healthDiv = document.createElement('div');
    healthDiv.style.marginTop = '8px';
    healthDiv.style.display = 'flex';
    healthDiv.style.alignItems = 'center';
    // Heart icon (simple red heart shape using emoji for simplicity)
    const heart = document.createElement('span');
    heart.textContent = '❤';
    heart.style.color = '#F5402C';
    heart.style.fontSize = '1rem';
    heart.style.marginRight = '8px';
    heart.setAttribute('aria-label', 'Health');
    healthDiv.appendChild(heart);
    // Amount
    const healthText = document.createElement('span');
    healthText.textContent = `x ${health}`;
    healthDiv.appendChild(healthText);

    // Left section (money + hunger)
    const leftSection = document.createElement('div');
    leftSection.appendChild(moneyDiv);
    leftSection.appendChild(hungerDiv);

    // Right section (food + health)
    const rightSection = document.createElement('div');
    rightSection.appendChild(foodDiv);
    rightSection.appendChild(healthDiv);

    // Add sections to HUD
    hud.appendChild(leftSection);
    hud.appendChild(rightSection);

    return hud;
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
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') leftPressed = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') rightPressed = true;
        if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && onGround) jumpPressed = true;
    });
    document.addEventListener('keyup', function(e) {
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
        const hud = createHUD(3, 80, 2, 5);
        screen.appendChild(hud);

        // Add the game area with platforms
        const gameArea = createGameArea();
        screen.appendChild(gameArea);

        // Add a back button to return to menu
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
