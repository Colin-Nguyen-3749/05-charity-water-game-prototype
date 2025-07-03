// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// Get the menu and all menu buttons
const menu = document.getElementById('menu');
const buttons = document.querySelectorAll('.menu-btn');

// Function to show a new screen with a message
function showScreen(message) {
    // Hide the menu
    menu.style.display = 'none';

    // Remove any old screen if present
    const oldScreen = document.getElementById('screen');
    if (oldScreen) {
        oldScreen.remove();
    }

    // Create a new screen div
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

    // Add the message
    const msg = document.createElement('div');
    msg.textContent = message;
    msg.style.textAlign = 'center';
    msg.style.maxWidth = '90vw';
    screen.appendChild(msg);

    // Add a back button for beginners to return to menu
    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back to Menu';
    backBtn.className = 'menu-btn';
    backBtn.style.marginTop = '32px';
    backBtn.onclick = function() {
        screen.remove();
        menu.style.display = 'flex';
        // Move focus back to the main title for accessibility
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
}

// Add click event listeners to each button
buttons[0].onclick = function() {
    // Start button
    showScreen('Game Starting... (This is a placeholder screen)');
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
