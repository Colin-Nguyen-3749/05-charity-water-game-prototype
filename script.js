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
    // Use a span for the value so we can update it easily
    moneyCounter.innerHTML = `<span class="coin-icon"></span>x <span id="money-value">${money}</span>`;
    moneyStack.appendChild(moneyCounter);

    // Hunger (bottom left)
    const hungerStack = document.createElement('div');
    hungerStack.className = 'counter-stack';
    const hungerLabel = document.createElement('span');
    hungerLabel.textContent = 'HUNGER';
    hungerLabel.className = 'counter-label';
    hungerStack.appendChild(hungerLabel);

    // Hunger bar: 10 segments, each segment is a small white rectangle
    const hungerBarWrap = document.createElement('span');
    hungerBarWrap.className = 'counter-value';
    const hungerBarOuter = document.createElement('span');
    hungerBarOuter.className = 'hunger-bar-outer';
    hungerBarOuter.style.display = 'flex';
    hungerBarOuter.style.gap = '2px';
    hungerBarOuter.style.background = 'transparent';
    hungerBarOuter.style.border = '2px solid #fff';
    hungerBarOuter.style.borderRadius = '0'; // Make it unrounded
    hungerBarOuter.style.width = '70px';
    hungerBarOuter.style.height = '12px';
    hungerBarOuter.style.overflow = 'hidden';
    hungerBarOuter.style.alignItems = 'center';
    hungerBarOuter.style.position = 'relative';

    // Create 10 segments
    const hungerSegments = [];
    for (let i = 0; i < 10; i++) {
        const seg = document.createElement('span');
        seg.className = 'hunger-segment';
        seg.style.display = 'inline-block';
        seg.style.height = '100%';
        seg.style.width = '10%';
        seg.style.background = '#fff';
        seg.style.margin = '0';
        seg.style.transition = 'background 0.3s';
        hungerBarOuter.appendChild(seg);
        hungerSegments.push(seg);
    }
    hungerBarOuter._segments = hungerSegments;
    hungerBarWrap.appendChild(hungerBarOuter);
    hungerStack.appendChild(hungerBarWrap);

    // Food (top right)
    const foodStack = document.createElement('div');
    foodStack.className = 'counter-stack';
    const foodLabel = document.createElement('span');
    foodLabel.textContent = 'FOOD';
    foodLabel.className = 'counter-label';
    foodStack.appendChild(foodLabel);
    const foodCounter = document.createElement('div');
    foodCounter.className = 'counter-value';
    // Use a span for the value so we can update it easily
    foodCounter.innerHTML = `<span class="food-icon"></span>x <span id="food-value">${food}</span>`;
    foodStack.appendChild(foodCounter);

    // Health (bottom right)
    const healthStack = document.createElement('div');
    healthStack.className = 'counter-stack';
    // Change label from 'HEALTH' to 'MEDICINE'
    const healthLabel = document.createElement('span');
    healthLabel.textContent = 'MEDICINE';
    healthLabel.className = 'counter-label';
    healthStack.appendChild(healthLabel);
    const healthCounter = document.createElement('span');
    healthCounter.className = 'counter-value';
    // Use a span for the value so we can update it easily
    healthCounter.innerHTML = `<span class="heart-icon">❤</span>x <span id="health-value">${health}</span>`;
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

    hud._hungerSegments = hungerSegments;
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
    // Detect if the screen is mobile-sized
    const isMobile = window.innerWidth <= 700;

    // Set area size based on device
    // For mobile, make the game area much taller (about 70% of the viewport height, max 420px)
    const areaWidth = isMobile ? Math.min(window.innerWidth * 0.9, 320) : 600;
    const areaHeight = isMobile ? Math.min(window.innerHeight * 0.7, 420) : 400;

    // Create the game area container
    const gameArea = document.createElement('div');
    gameArea.id = 'game-area';
    gameArea.style.position = 'relative';
    gameArea.style.width = `${areaWidth}px`;
    gameArea.style.maxWidth = isMobile ? `${areaWidth}px` : '600px';
    gameArea.style.height = `${areaHeight}px`;
    gameArea.style.margin = isMobile ? '0 auto 0 auto' : '32px auto 0 auto';
    gameArea.style.background = '#181818';
    gameArea.style.border = '2px solid #fff';
    gameArea.style.borderRadius = isMobile ? '8px' : '12px';
    gameArea.style.overflow = 'hidden';
    gameArea.style.display = 'flex';
    gameArea.style.alignItems = 'flex-end';

    // Game variables
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
        // Random width and x position, always inside the game area
        const width = platformMinWidth + Math.floor(Math.random() * (platformMaxWidth - platformMinWidth));
        const maxX = areaWidth - width - 10;
        const x = Math.floor(Math.random() * (maxX > 0 ? maxX : 1)) + 5;
        // Alternate colors
        const isBrown = Math.random() < 0.5;
        const color = isBrown ? '#BF6C46' : '#77A8BB';

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

        // --- Double-click to turn brown platform blue ---
        platform.addEventListener('dblclick', function() {
            // Only change if it's brown (#BF6C46)
            if (platform.style.background === 'rgb(191, 108, 70)' || platform.style.background === '#BF6C46') {
                platform.style.background = '#77A8BB';
            }
        });

        // --- Randomly add a coin on blue platforms ---
        let coin = null;
        // 40% chance to add a coin if platform is blue
        if (!isBrown && Math.random() < 0.4) {
            coin = document.createElement('span');
            coin.className = 'coin-on-platform';
            coin.style.position = 'absolute';
            coin.style.left = `${width / 2 - 10}px`;
            coin.style.top = '-18px';
            coin.style.width = '20px';
            coin.style.height = '20px';
            coin.style.background = '#FFC907';
            coin.style.border = '2px solid #fff';
            coin.style.borderRadius = '50%';
            coin.style.display = 'flex';
            coin.style.alignItems = 'center';
            coin.style.justifyContent = 'center';
            coin.style.zIndex = '3';
            coin.innerHTML = '<span style="color:#fff;font-size:14px;">$</span>';
            coin.setAttribute('data-collected', 'false');
            platform.appendChild(coin);
        }

        // Add to DOM and array
        gameArea.appendChild(platform);
        platforms.push({
            el: platform,
            x,
            y,
            width,
            height: platformHeight,
            coin: coin
        });
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
    // Use window.currentJumpPower for jump height
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

    // --- On-screen controls for mobile ---
    let controls = null;
    if (isMobile) {
        // Create a container for the on-screen buttons (will be added outside gameArea)
        controls = document.createElement('div');
        controls.id = 'mobile-controls';
        controls.style.display = 'flex';
        controls.style.justifyContent = 'center';
        controls.style.gap = '24px';
        controls.style.margin = '18px 0 0 0';
        controls.style.width = `${areaWidth}px`;

        // Helper to make a pixelated button
        function makeBtn(label) {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.style.background = '#111';
            btn.style.color = '#fff';
            btn.style.border = '2px solid #fff';
            btn.style.fontFamily = "'Press Start 2P', monospace";
            btn.style.fontSize = '2rem';
            btn.style.padding = '22px 32px';
            btn.style.borderRadius = '10px';
            btn.style.margin = '0 4px';
            btn.style.cursor = 'pointer';
            btn.style.outline = 'none';
            btn.style.boxShadow = '0 2px #222';
            btn.style.pointerEvents = 'auto'; // enable click/touch
            btn.style.userSelect = 'none';
            btn.style.touchAction = 'none';
            return btn;
        }

        // Left, Right, Jump buttons
        const leftBtn = makeBtn('←');
        const rightBtn = makeBtn('→');
        const jumpBtn = makeBtn('⤒');

        // Add event listeners for touch and mouse
        leftBtn.addEventListener('touchstart', e => { e.preventDefault(); leftPressed = true; });
        leftBtn.addEventListener('touchend', e => { e.preventDefault(); leftPressed = false; });
        leftBtn.addEventListener('mousedown', e => { e.preventDefault(); leftPressed = true; });
        leftBtn.addEventListener('mouseup', e => { e.preventDefault(); leftPressed = false; });
        leftBtn.addEventListener('mouseleave', e => { leftPressed = false; });

        rightBtn.addEventListener('touchstart', e => { e.preventDefault(); rightPressed = true; });
        rightBtn.addEventListener('touchend', e => { e.preventDefault(); rightPressed = false; });
        rightBtn.addEventListener('mousedown', e => { e.preventDefault(); rightPressed = true; });
        rightBtn.addEventListener('mouseup', e => { e.preventDefault(); rightPressed = false; });
        rightBtn.addEventListener('mouseleave', e => { rightPressed = false; });

        jumpBtn.addEventListener('touchstart', e => { e.preventDefault(); if (onGround) jumpPressed = true; });
        jumpBtn.addEventListener('mousedown', e => { e.preventDefault(); if (onGround) jumpPressed = true; });

        // Arrange buttons: left, jump, right
        controls.appendChild(leftBtn);
        controls.appendChild(jumpBtn);
        controls.appendChild(rightBtn);
    }

    // Track the player's items
    let money = 0;
    let food = 0;
    let health = 0;

    // We need to get the money counter span from the HUD each time, because the HUD is created in showScreen
    // So we use document.getElementById to always get the current value span
    // ...existing code...

    function gameLoop() {
        // Move left/right
        if (leftPressed) vx = -moveSpeed;
        else if (rightPressed) vx = moveSpeed;
        else vx = 0;

        // Jump
        if (jumpPressed && onGround) {
            // Use the currentJumpPower global variable for jump height
            // If not set, default to -15
            vy = typeof window.currentJumpPower === "number" ? window.currentJumpPower : -15;
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

        // Prevent player from jumping above the top of the game area
        if (py < 0) {
            py = 0;
            vy = 0;
        }

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
        // Before removing a platform, also remove its coin from the DOM if it exists
        platforms = platforms.filter(plat => {
            if (plat.y >= areaHeight) {
                // If the platform has a coin, remove it from the DOM
                if (plat.coin && plat.coin.parentNode) {
                    plat.coin.parentNode.removeChild(plat.coin);
                }
                // Remove the platform element from the DOM
                if (plat.el && plat.el.parentNode) {
                    plat.el.parentNode.removeChild(plat.el);
                }
                return false; // Remove this platform from the array
            }
            return true; // Keep this platform
        });

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

        // --- Coin collection check ---
        for (let plat of platforms) {
            if (plat.coin && plat.coin.getAttribute('data-collected') === 'false') {
                // Get player and coin positions
                const playerRect = player.getBoundingClientRect();
                const coinRect = plat.coin.getBoundingClientRect();
                // Check if player's feet are touching the coin (simple overlap)
                if (
                    playerRect.bottom >= coinRect.top &&
                    playerRect.top < coinRect.bottom &&
                    playerRect.left < coinRect.right &&
                    playerRect.right > coinRect.left
                ) {
                    plat.coin.setAttribute('data-collected', 'true');
                    plat.coin.style.display = 'none';
                    // Increase money by 1
                    money++;
                    // Always get the money-value span from the DOM and update it
                    const moneyValue = document.getElementById('money-value');
                    if (moneyValue) {
                        moneyValue.textContent = money;
                    }
                }
            }
        }

        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    requestAnimationFrame(gameLoop);

    // Return both gameArea and controls if mobile, else just gameArea
    if (isMobile) {
        // Wrap in a container to keep layout simple for students
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.appendChild(gameArea);
        wrapper.appendChild(controls);
        return wrapper;
    } else {
        return gameArea;
    }
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

        // Set all counters to zero at the start of the game
        let money = 0;
        let food = 0;
        let health = 0;
        let hunger = 100; // Hunger bar starts full

        // Create the HUD with starting values
        const startTime = 180; // 3 minutes in seconds
        let timeLeft = startTime;
        const hud = createHUD(money, hunger, food, health, timeLeft);
        screen.appendChild(hud);

        // Add the game area with platforms
        const gameAreaOrWrapper = createGameArea();
        screen.appendChild(gameAreaOrWrapper);

        // --- Hunger bar segment logic ---
        let jumpCount = 0;
        let hungerSegments = hud._hungerSegments;
        let segmentsLeft = 10;

        // Set jump powers for normal and much lower jumps
        let jumpPowerNormal = -15;
        let jumpPowerLow = -10; // much lower jump

        // Listen for jump events and update hunger bar segments
        document.addEventListener('keydown', function(e) {
            if (
                (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW')
            ) {
                // Find the player element
                const player = document.getElementById('player');
                if (player) {
                    if (player.getAttribute('data-on-ground') === 'true') {
                        jumpCount++;
                        // Every 15 jumps, hide a segment
                        if (jumpCount % 15 === 0 && segmentsLeft > 0) {
                            segmentsLeft--;
                            // Visually show how many segments are left
                            for (let i = 0; i < 10; i++) {
                                if (i < segmentsLeft) {
                                    hungerSegments[i].style.background = '#fff';
                                } else {
                                    hungerSegments[i].style.background = '#181818';
                                }
                            }
                        }
                    }
                }
            }
        });

        // --- Decrease hunger bar every 5 seconds ---
        let hungerInterval = setInterval(() => {
            if (segmentsLeft > 0) {
                segmentsLeft--;
                for (let i = 0; i < 10; i++) {
                    if (i < segmentsLeft) {
                        hungerSegments[i].style.background = '#fff';
                    } else {
                        hungerSegments[i].style.background = '#181818';
                    }
                }
            }
        }, 5000);

        // Patch the game loop to update the player's onGround attribute and jump power
        setTimeout(() => {
            function patchPlayerOnGroundAndJumpPower() {
                const player = document.getElementById('player');
                if (player) {
                    // Patch onGround attribute
                    const plats = Array.from(document.querySelectorAll('.platform'));
                    let playerRect = player.getBoundingClientRect();
                    let onGroundNow = false;
                    for (let plat of plats) {
                        let platRect = plat.getBoundingClientRect();
                        if (
                            playerRect.bottom <= platRect.top + 2 &&
                            playerRect.bottom + 2 >= platRect.top &&
                            playerRect.right > platRect.left + 4 &&
                            playerRect.left < platRect.right - 4
                        ) {
                            onGroundNow = true;
                        }
                    }
                    player.setAttribute('data-on-ground', onGroundNow ? 'true' : 'false');
                }
                // Set jump power based on hunger segments left
                if (segmentsLeft <= 3) {
                    window.currentJumpPower = jumpPowerLow;
                } else {
                    window.currentJumpPower = jumpPowerNormal;
                }
                requestAnimationFrame(patchPlayerOnGroundAndJumpPower);
            }
            patchPlayerOnGroundAndJumpPower();
        }, 500);

        // Timer countdown
        let timerInterval = setInterval(() => {
            timeLeft--;
            const timerDiv = document.getElementById('timer');
            if (timerDiv) timerDiv.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                clearInterval(hungerInterval);
                // Show game over message
                alert('Time is up!');
            }
        }, 1000);

        // --- Reset Button ---
        // This button will reset the game completely
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Game';
        resetBtn.className = 'menu-btn';
        resetBtn.style.marginTop = '16px';
        resetBtn.onclick = function() {
            // Clear intervals to stop timers
            clearInterval(timerInterval);
            clearInterval(hungerInterval);
            // Remove the current game screen
            screen.remove();
            // Show a new game screen (fresh start)
            showScreen('GAME');
        };
        resetBtn.setAttribute('aria-label', 'Reset the game');
        screen.appendChild(resetBtn);

        // Add a back button to return to menu
        const backBtn = document.createElement('button');
        backBtn.textContent = 'Back to Menu';
        backBtn.className = 'menu-btn';
        backBtn.style.marginTop = '16px';
        backBtn.onclick = function() {
            clearInterval(timerInterval);
            clearInterval(hungerInterval);
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

// --- Add a yellow jerry can above the main title on the main menu ---
window.addEventListener('DOMContentLoaded', function() {
    // Only add if on the menu screen and not already present
    const menu = document.getElementById('menu');
    if (menu && !document.getElementById('jerrycan-icon')) {
        // Create a simple yellow jerry can using a div and CSS
        const jerryCan = document.createElement('div');
        jerryCan.id = 'jerrycan-icon';
        jerryCan.style.width = '54px';
        jerryCan.style.height = '54px';
        jerryCan.style.marginBottom = '18px';
        jerryCan.style.background = '#FFC907';
        jerryCan.style.border = '4px solid #fff';
        jerryCan.style.borderRadius = '10px';
        jerryCan.style.position = 'relative';
        jerryCan.style.boxShadow = '2px 4px #222';

       

        // Add a spout (small rectangle)
        const spout = document.createElement('div');
        spout.style.position = 'absolute';
        spout.style.top = '5px';
        spout.style.right = '7px';
        spout.style.width = '8px';
        spout.style.height = '16px';
        spout.style.background = '#fff';
        spout.style.borderRadius = '2px';
        jerryCan.appendChild(spout);

        // Center the X in the jerry can
        const crossCenter = document.createElement('div');
        crossCenter.style.position = 'absolute';
        crossCenter.style.left = '50%';
        crossCenter.style.top = '50%';
        crossCenter.style.transform = 'translate(-50%, -50%)';
        crossCenter.style.width = '28px';
        crossCenter.style.height = '28px';

        // Add a cross (X) for the jerry can design, centered
        const cross1 = document.createElement('div');
        cross1.style.position = 'absolute';
        cross1.style.left = '0';
        cross1.style.top = '11px';
        cross1.style.width = '28px';
        cross1.style.height = '6px';
        cross1.style.background = '#fff';
        cross1.style.transform = 'rotate(45deg)';
        cross1.style.borderRadius = '2px';
        crossCenter.appendChild(cross1);

        const cross2 = document.createElement('div');
        cross2.style.position = 'absolute';
        cross2.style.left = '0';
        cross2.style.top = '11px';
        cross2.style.width = '28px';
        cross2.style.height = '6px';
        cross2.style.background = '#fff';
        cross2.style.transform = 'rotate(-45deg)';
        cross2.style.borderRadius = '2px';
        crossCenter.appendChild(cross2);

        jerryCan.appendChild(crossCenter);

        // Insert above the main title
        const mainTitle = document.getElementById('main-title');
        if (mainTitle) {
            menu.insertBefore(jerryCan, mainTitle);
        }
    }
});

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

// In your createGameArea's gameLoop, use window.currentJumpPower for jump height:
// if (jumpPressed && onGround) { vy = window.currentJumpPower; onGround = false; jumpPressed = false; }
// In your createGameArea's gameLoop, use window.currentJumpPower for jump height:
// if (jumpPressed && onGround) { vy = window.currentJumpPower; onGround = false; jumpPressed = false; }
