// auth-offline.js - Works 100% offline with local files
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded - Offline Mode');
    initializeAuthSystem();
});

// Hardcoded member data (replace with your actual members)
const LOCAL_MEMBERS_DATA = [
    {
        "Name": "Peter Ramsis Tawfeek",
        "Email": "peter.tawfik@evapharma.com",
        "Code": 4639,
        "Team": "Builders"
    },
    {
        "Name": "Maro Peter Ramsis",
        "Email": "dr.peter.salib@gmail.com",
        "Code": 1234,
        "Team": "Strategic Leaders"
    },
    {
        "Name": "Fiby Magdy Ibrahem",
        "Email": "fabulla86@gmail.com",
        "Code": 7896,
        "Team": "Workers"
    },
    {
        "Name": "Bassem Rafaat Nagiub",
        "Email": "basem.nagiub@evapharma.com",
        "Code": 8524,
        "Team": "Workers"
    },
    {
        "Name": "Guest",
        "Email": "guest@evapharma.com",
        "Code": 1001,
        "Team": "Workers"
    }
];

function initializeAuthSystem() {
    // Check for existing session
    const userData = safelyGetUserData();
    
    if (userData) {
        console.log('User already logged in:', userData.email);
        showMainContent();
    } else {
        console.log('No active session found');
        showLoginScreen();
    }
}

function safelyGetUserData() {
    try {
        const userData = localStorage.getItem('userData');
        if (!userData) return null;
        
        const parsedData = JSON.parse(userData);
        
        // Validate stored data structure
        if (!parsedData.email || !parsedData.team || !parsedData.name) {
            console.warn('Invalid user data structure', parsedData);
            localStorage.removeItem('userData');
            return null;
        }
        
        return parsedData;
    } catch (e) {
        console.error('Error reading user data:', e);
        return null;
    }
}

function showLoginScreen() {
    console.log('Displaying login screen');
    
    // Clear any existing UI
    removeElement('.login-container');
    removeElement('.user-info-container');
    removeElement('.app-footer');
    
    // Reset visual states
    const splash = document.querySelector('.splash');
    if (splash) {
        splash.classList.remove(
            'show-banner', 'show-hiero-line', 'show-user-info', 
            'show-menu', 'show-footer'
        );
    }
    
    // Create fresh login UI
    const loginHTML = `
        <div class="login-container">
            <div class="login-box">
                <h2>Login</h2>
                <div class="input-group">
                    <input type="email" id="emailInput" 
                           placeholder="Enter your email" 
                           required
                           autocomplete="email">
                </div>
                <button id="signInBtn" class="login-button">Sign In</button>
                <p id="errorMsg" class="error-message"></p>
            </div>
        </div>
    `;
    
    document.querySelector('.splash').insertAdjacentHTML('beforeend', loginHTML);
    
    // Set up event listeners
    document.getElementById('signInBtn').addEventListener('click', handleLogin);
    document.getElementById('emailInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    document.getElementById('emailInput').focus();
}

function handleLogin() {
    console.log('Login initiated (offline mode)');
    
    const emailInput = document.getElementById('emailInput');
    const errorMsg = document.getElementById('errorMsg');
    const email = emailInput.value.trim();
    errorMsg.textContent = '';
    
    // Validate email format
    if (!email) {
        showError(errorMsg, 'Please enter your email');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError(errorMsg, 'Please enter a valid email address');
        return;
    }
    
    try {
        console.log('Authenticating against local data');
        
        // Use the hardcoded member data
        const user = LOCAL_MEMBERS_DATA.find(member => 
            member.Email && member.Email.toLowerCase() === email.toLowerCase()
        );
        
        if (!user) {
            showError(errorMsg, 'User not found. Please check your email.');
            return;
        }
        
        // Store session
        localStorage.setItem('userData', JSON.stringify({
            name: user.Name,
            email: user.Email,
            team: user.Team,
            code: user.Code
        }));
        
        // Proceed to main content
        showMainContent();
        
    } catch (error) {
        console.error('Authentication failed:', error);
        showError(errorMsg, 'Login error. Please try again.');
    }
}

function showMainContent() {
    console.log('Displaying main content');
    
    removeElement('.login-container');
    
    const userData = safelyGetUserData();
    if (!userData) {
        showLoginScreen();
        return;
    }
    
    // Create user info display
    const userInfoHTML = `
        <div class="user-info-container">
            <div class="user-info">
                <span class="welcome-message">Welcome, ${userData.name}</span>
                <span class="user-team">Team: ${userData.team}</span>
            </div>
        </div>
    `;
    
    // Create footer
    const footerHTML = `
        <footer class="app-footer">
            <button id="signOutBtn" class="sign-out-btn">Sign Out</button>
        </footer>
    `;
    
    document.querySelector('.splash').insertAdjacentHTML('beforeend', userInfoHTML);
    document.querySelector('.splash').insertAdjacentHTML('beforeend', footerHTML);
    
    // Set up sign out
    document.getElementById('signOutBtn').addEventListener('click', handleSignOut);
    
    // Animate transition
    animateContentTransition();
}

function handleSignOut() {
    console.log('User signing out');
    localStorage.removeItem('userData');
    showLoginScreen();
}

// Helper functions
function removeElement(selector) {
    const element = document.querySelector(selector);
    if (element) element.remove();
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function animateContentTransition() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    }
    
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
        }, 500);
    }, 500);
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
                'My Team': 'teams.html',
            'All Teams': 'allteams.html'
            };
            
            const buttonText = button.textContent.trim();
            if (targetUrls[buttonText]) {
               // window.location.href = targetUrls[buttonText];
               window.open(targetUrls[buttonText], '_blank');
            }
        });
    });
}