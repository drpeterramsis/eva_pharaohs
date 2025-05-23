// auth-offline.js - Works 100% offline with local files
document.addEventListener('DOMContentLoaded', function () {
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

    removeElement('.login-container');
    removeElement('.user-info-container');
    removeElement('.app-footer');

    const splash = document.querySelector('.splash');
    if (splash) {
        splash.classList.remove(
            'show-banner', 'show-hiero-line', 'show-user-info',
            'show-menu', 'show-footer'
        );
    }

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

    splash.insertAdjacentHTML('beforeend', loginHTML);

    document.getElementById('signInBtn').addEventListener('click', handleLogin);
    document.getElementById('emailInput').addEventListener('keypress', function (e) {
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

        const user = LOCAL_MEMBERS_DATA.find(member =>
            member.Email && member.Email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
            showError(errorMsg, 'User not found. Please check your email.');
            return;
        }

        localStorage.setItem('userData', JSON.stringify({
            name: user.Name,
            email: user.Email,
            team: user.Team,
            code: user.Code
        }));

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

    const videoMap = {
        'Strategic Leaders': 'assets/back_leaders.mp4',
        'Builders': 'assets/back_builders.mp4',
        'Workers': 'assets/back_workers.mp4',
        'Farmers': 'assets/back_farmers.mp4',
        'Riddle Solvers': 'assets/back_solvers.mp4'
    };

    const teamNames = Object.keys(videoMap);
    let currentTeamIndex = teamNames.indexOf(userData.team);
    if (currentTeamIndex === -1) currentTeamIndex = 0;

    function setBackgroundByTeam(team) {
        const backgroundVideo = document.getElementById('backgroundVideo');
        if (backgroundVideo && backgroundVideo.querySelector('source')) {
            const source = backgroundVideo.querySelector('source');
            const selectedVideo = videoMap[team] || 'assets/gen_back.mp4';
            source.setAttribute('src', selectedVideo);
            backgroundVideo.load();
        }

        const button = document.getElementById('cycleBackgroundBtn');
        if (button) {
            button.innerHTML = `Change Background<br>(Current: ${team})`;
        }
    }

    const pharaohContainer = document.createElement('div');
    pharaohContainer.className = 'pharaoh-container';
    pharaohContainer.innerHTML = `
        <img src="assets/phar_char.webp" class="pharaoh-character" alt="Pharaoh Character" />
    `;
    document.body.appendChild(pharaohContainer);

    const cycleBtn = document.getElementById('cycleBackgroundBtn');
    if (cycleBtn) {
        cycleBtn.addEventListener('click', () => {
            currentTeamIndex = (currentTeamIndex + 1) % teamNames.length;
            const nextTeam = teamNames[currentTeamIndex];
            setBackgroundByTeam(nextTeam);
            console.log('Background changed to:', nextTeam);
        });
    }

    setBackgroundByTeam(userData.team);

    const userInfoHTML = `
        <div class="user-info-container">
            <div class="user-info">
                <span class="user-team"></span><span class="welcome-message"><big> ${userData.name}</span>
                <span class="welcome-message" style="color:#834333;"><big>${userData.team}</span>
            </div>
        </div>
    `;

    const footerHTML = `
<footer class="app-footer">
  <div class="footer-content">
    <small>@2025 Dr. Peter Ramsis | DCC5</small>
    <button id="signOutBtn" class="sign-out-btn">Sign Out</button>
  </div>
</footer>
    `;

    document.querySelector('.splash').insertAdjacentHTML('beforeend', userInfoHTML);
    document.querySelector('.splash').insertAdjacentHTML('beforeend', footerHTML);

    document.getElementById('signOutBtn').addEventListener('click', handleSignOut);

    animateContentTransition();
}

function handleSignOut() {
    console.log('User signing out');
    localStorage.removeItem('userData');
    showLoginScreen();
}

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
        }, 2000);
    }

    setTimeout(() => {
        const splashContent = document.querySelector('.content');
        if (splashContent) splashContent.classList.add('fade-out');

        setTimeout(() => {
            const splash = document.querySelector('.splash');
            if (splash) {
                splash.classList.add('show-banner', 'show-hiero-line', 'show-user-info');

                setTimeout(() => {
                    splash.classList.add('show-menu', 'show-footer');
                    initializeMenuButtons();
                }, 1000);
            }
        }, 500);
    }, 500);
}

function initializeMenuButtons() {
    const buttons = document.querySelectorAll('.menu button');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            button.classList.add('button-clicked');
            setTimeout(() => {
                button.classList.remove('button-clicked');
            }, 300);

            const targetUrls = {
                'My Team': 'teams.html',
                'All Teams': 'allteams.html',
                'QR Code': 'qr-scanner.html'
            };

            const buttonText = button.textContent.trim();
            if (targetUrls[buttonText]) {
                window.open(targetUrls[buttonText], '_blank');
            }
        });
    });
}
