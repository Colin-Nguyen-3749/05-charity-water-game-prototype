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

// Function to create the game area with random platforms
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

    // Generate random platforms
    const platformCount = 7;
    let lastX = 30;
    let lastY = 350;
    for (let i = 0; i < platformCount; i++) {
        // Random width and height for platform
        const width = 80 + Math.floor(Math.random() * 60);
        const height = 16;
        // Random horizontal and vertical gap
        const gapX = 40 + Math.floor(Math.random() * 60);
        const gapY = -40 + Math.floor(Math.random() * 80);

        // Calculate new position
        let x = lastX + gapX;
        let y = lastY + gapY;
        // Clamp y to stay in bounds
        if (y > 370) y = 370;
        if (y < 40) y = 40;

        // Randomly pick color
        let color = '#fff';
        const rand = Math.random();
        if (rand < 0.3) color = '#BF6C46';
        else if (rand < 0.6) color = '#77A8BB';

        // Create platform div
        const platform = document.createElement('div');
        platform.className = 'platform';
        platform.style.position = 'absolute';
        platform.style.left = `${x}px`;
        platform.style.top = `${y}px`;
        platform.style.width = `${width}px`;
        platform.style.height = `${height}px`;
        platform.style.background = color;
        platform.style.border = '2px solid #222';
        platform.style.borderRadius = '6px';
        platform.style.boxShadow = '0 2px 0 #222';
        platform.setAttribute('aria-label', 'Platform');

        gameArea.appendChild(platform);

        // Update lastX and lastY for next platform
        lastX = x;
        lastY = y;
    }

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
