// auth.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const userData = getStoredUserData();
    if (userData) {
        showMainContent();
        return;
    }
    showLoginScreen();
});

function getStoredUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

function showLoginScreen() {
    // Clear any existing main content
    document.querySelector('.user-info-container')?.remove();
    document.querySelector('.app-footer')?.remove();
    
    // Reset splash classes
    const splash = document.querySelector('.splash');
    if (splash) {
        splash.classList.remove(
            'show-banner', 'show-hiero-line', 'show-user-info', 'show-menu', 'show-footer'
        );
    }
    
    // Reset content state
    const content = document.querySelector('.content');
    if (content) content.classList.remove('fade-out');
    
    // Create login container
    const loginContainer = document.createElement('div');
    loginContainer.className = 'login-container';
    loginContainer.innerHTML = `
        <div class="login-box">
            <h2>Login</h2>
            <div class="input-group">
                <input type="email" id="emailInput" placeholder="Enter your email" required>
            </div>
            <button id="signInBtn">Sign In</button>
            <p id="errorMsg" class="error-message"></p>
        </div>
    `;
    document.querySelector('.splash').appendChild(loginContainer);

    // Add event listeners
    document.getElementById('signInBtn').addEventListener('click', handleLogin);
    document.getElementById('emailInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Focus email input
    document.getElementById('emailInput').focus();
}

async function handleLogin() {
    const emailInput = document.getElementById('emailInput');
    const errorMsg = document.getElementById('errorMsg');
    const email = emailInput.value.trim();

    if (!email) {
        errorMsg.textContent = 'Please enter your email';
        return;
    }

    try {
        // Load members data
        const response = await fetch('members.json');
        if (!response.ok) throw new Error('Failed to load members data');
        const members = await response.json();

        // Find user by email
        const user = members.find(member => member.Email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            errorMsg.textContent = 'User not found';
            return;
        }

        // Save user data to localStorage
        storeUserData({
            name: user.Name,
            email: user.Email,
            team: user.Team,
            code: user.Code
        });

        // Show main content
        showMainContent();
    } catch (error) {
        console.error('Login error:', error);
        errorMsg.textContent = 'An error occurred. Please try again.';
    }
}

function storeUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

function showMainContent() {
    // Remove login container if it exists
    document.querySelector('.login-container')?.remove();

    // Get user data
    const userData = getStoredUserData();
    if (!userData) {
        showLoginScreen();
        return;
    }
    
    // Create user info display below banner
    const userInfoContainer = document.createElement('div');
    userInfoContainer.className = 'user-info-container';
    userInfoContainer.innerHTML = `
        <div class="user-info">
            <span class="welcome-message">Welcome, ${userData.name}</span>
            <span class="user-team">Team: ${userData.team}</span>
        </div>
    `;
    document.querySelector('.splash').appendChild(userInfoContainer);

    // Create footer with sign out button
    const footer = document.createElement('footer');
    footer.className = 'app-footer';
    footer.innerHTML = `
        <button id="signOutBtn" class="sign-out-btn">Sign Out</button>
    `;
    document.querySelector('.splash').appendChild(footer);
    
    // Add event listener for sign out
    document.getElementById('signOutBtn').addEventListener('click', handleSignOut);

    // Continue with the original content display
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('fade-out');
        
        setTimeout(() => {
            loader.style.display = 'none';
            animateMainContent();
        }, 1000);
    } else {
        animateMainContent();
    }
}

function animateMainContent() {
    setTimeout(() => {
        const splashContent = document.querySelector('.content');
        if (splashContent) splashContent.classList.add('fade-out');
        
        setTimeout(() => {
            const splash = document.querySelector('.splash');
            if (splash) {
                splash.classList.add('show-banner');
                splash.classList.add('show-hiero-line');
                splash.classList.add('show-user-info');
                
                setTimeout(() => {
                    splash.classList.add('show-menu');
                    splash.classList.add('show-footer');
                    initializeMenuButtons();
                }, 1000);
            }
        }, 1000);
    }, 500);
}

function handleSignOut() {
    // Clear all user data
    localStorage.removeItem('userData');
    
    // Show login screen again
    showLoginScreen();
}

function initializeMenuButtons() {
    const buttons = document.querySelectorAll('.menu button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            button.classList.add('button-clicked');
            setTimeout(() => {
                button.classList.remove('button-clicked');
            }, 300);
            
            const targetUrls = {
                'My Team': 'teams.html'
            };
            
            const buttonText = button.textContent.trim();
            if (targetUrls[buttonText]) {
                const newWindow = window.open(targetUrls[buttonText], '_blank');
                if (newWindow) {
                    newWindow.opener = null;
                } else {
                    alert('Please allow popups for this site to open in new tab');
                }
            }
        });
    });
}