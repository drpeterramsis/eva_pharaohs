

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded - Offline Mode');
    initializeAuthSystem();
});


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
        if (!parsedData.email || !parsedData.team || !parsedData.name || !parsedData.kingdom) {
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
            'show-menu', 'show-footer', 'show-notes'
        );
    }

    const loginHTML = `
        <div class="login-container">
            <div class="login-box">
              <img src="assets/kemet.png" class="logo-main" alt="EVA Logo" />
                
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
            code: user.Code,
            kingdom: user.Kingdom,
            date: user.Date,
            time: user.Time
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

    // Update user info displays
    const userNameDisplay = document.querySelector('.user-name-display');
    const teamDisplay = document.querySelector('.team-display');
    const kingdomDisplay = document.querySelector('.kingdom-display');
    const dateDisplay = document.querySelector('.date-display');
    const timeDisplay = document.querySelector('.time-display');

    if (userNameDisplay) userNameDisplay.textContent = userData.name;
    if (teamDisplay) teamDisplay.textContent = userData.team;
    if (kingdomDisplay) kingdomDisplay.textContent = userData.kingdom;
    if (dateDisplay) dateDisplay.textContent = userData.date;
    if (timeDisplay) timeDisplay.textContent = userData.time;

    // Team-specific configurations
    const videoMap = {
        'Strategic Leaders': 'assets/back_leaders.mp4',
        'Builders': 'assets/back_builders.mp4',
        'Workers': 'assets/back_workers.mp4',
        'Farmers': 'assets/back_farmers.mp4',
        'Riddles Solvers': 'assets/back_solvers.mp4'
    };

    const PHARAOH_IMAGES = {
        'Strategic Leaders': 'assets/snefru_leader.png',
        'Builders': 'assets/snefru_builder.png',
        'Workers': 'assets/snefru_worker.png',
        'Farmers': 'assets/snefru_farmer.png',
        'Riddles Solvers': 'assets/snefru_solver.png',
        'default': 'assets/snefru_main.png'
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

        const pharaohImg = document.querySelector('.pharaoh-character');
        if (pharaohImg) {
            const imgSrc = PHARAOH_IMAGES[team] || PHARAOH_IMAGES['default'];
            pharaohImg.setAttribute('src', imgSrc);
        }
    }
    
    // Hide all team divs first
    const allTeamDivs = document.querySelectorAll('.menu > div[id]');
    allTeamDivs.forEach(div => div.style.display = 'none');

    // Show only the relevant team div
    const teamDiv = document.getElementById(userData.team);
    if (teamDiv) {
        teamDiv.style.display = 'block';
    }

    // Create pharaoh character
    const pharaohContainer = document.createElement('div');
    pharaohContainer.className = 'pharaoh-container';
    pharaohContainer.innerHTML = `
        <img src="${PHARAOH_IMAGES[userData.team] || PHARAOH_IMAGES['default']}" class="pharaoh-character" alt="Pharaoh Character" />
    `;
    document.body.appendChild(pharaohContainer);

    // Set up background cycling
    const cycleBtn = document.getElementById('cycleBackgroundBtn');
    if (cycleBtn) {
        cycleBtn.addEventListener('click', () => {
            currentTeamIndex = (currentTeamIndex + 1) % teamNames.length;
            const nextTeam = teamNames[currentTeamIndex];
            setBackgroundByTeam(nextTeam);
            console.log('Background changed to:', nextTeam);
        });
    }

    // Set initial background
    setBackgroundByTeam(userData.team);

    // Populate team notes
    const teamNotesList = document.getElementById('teamNotesList');
    if (teamNotesList) {
        teamNotesList.innerHTML = ''; // Clear existing notes
        
        const teamInfo = teamData[userData.team];
        if (teamInfo && teamInfo.notes) {
            teamInfo.notes.forEach(note => {
                const li = document.createElement('li');
                li.textContent = note;
                teamNotesList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "No notes available for this team.";
            teamNotesList.appendChild(li);
        }
    }

    // Create user info and footer
    const userInfoHTML = `
        <div class="user-info-container" style="display:none;">
            <div class="user-info">
                <span class="user-team"></span><span class="welcome-message"><big> ${userData.name}</span>
                <span class="welcome-message" style="color:#834333;"><big>${userData.team}</span>
            </div>
        </div>
    `;

    const footerHTML = `
        <footer class="app-footer">
            <div class="footer-content">
                <small>@2025 Dr. Peter Ramsis | DCC5 - v1.30.10</small>
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
    location.reload(); // This reloads the entire page
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
                splash.classList.add('show-banner', 'show-hiero-line', 'show-user-info','show-notes');

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

// Function to display the notifier with a custom message
function showNotifier(message) {
    document.getElementById("notifierMessage").innerHtml = message;
    document.getElementById("notifier").style.display = "flex";
}
function showNotifier(html) {
    document.getElementById("notifier-overlay").style.display = "block";
    const notifier = document.getElementById("notifier");
    notifier.style.display = "block";
    notifier.querySelector(".notifier-body").innerHTML = html;
}


// Function to close the notifier
function closeNotifier() {
    document.getElementById("notifier").style.display = "none";
    document.getElementById("notifier-overlay").style.display = "none";
}


// Action functions for buttons
function customAction1() {
    alert("Action 1 clicked!");
    closeNotifier();  // Close the notifier after action
}

function customAction2() {
    alert("Action 2 clicked!");
    closeNotifier();  // Close the notifier after action
}




const PASSWORDS = {
    preTrainingAction: "1",
    teamSimulationAction: "2",
    postTrainingAction: "3"
};

function checkPassword() {
    // Show the password prompt (notifier popup)
    document.getElementById('passwordPrompt').style.display = 'flex';
    // Hide the team container in case the user failed the previous attempt
    document.getElementById('teamContainer').style.display = 'none';
}



function teamSimulation() {
    // Show the password prompt for Pre Training
    showPasswordPrompt("Please enter the password to access Your Team:", "teamSimulationAction");
}




function preTrain() {
    // Show the password prompt for Pre Training
    showPasswordPrompt("Please enter the password to access Pre Training:", "preTrainingAction");
}

function postTrain() {
    // Show the password prompt for Post Training
    showPasswordPrompt("Please enter the password to access Post Training:", "postTrainingAction");
}

// Show the password prompt with different messages and actions
function showPasswordPrompt(message, action) {
    document.getElementById("popup-overlay").style.display = "block";
    document.getElementById("passwordPrompt").style.display = "block";
    document.getElementById("errorMessage").style.display = "none"; // Hide error message
    document.getElementById("passwordInput").value = ''; // Clear the password input field
    document.getElementById("passwordPrompt").setAttribute('data-action', action); // Store the action type
    document.querySelector(".popup-content p").innerText = message; // Set the message in the prompt
}
// Modify just the verifyPassword function (keep everything else the same)
function verifyPassword() {
    var password = document.getElementById("passwordInput").value;
    var action = document.getElementById("passwordPrompt").getAttribute('data-action');
    var correctPassword = PASSWORDS[action]; // Get password for this action

    if (password === correctPassword) {
        if (action === "preTrainingAction") {
            alert("Pre Training access granted!");
            closePopup();
        } else if (action === "postTrainingAction") {
            window.open("https://www.google.com", "_blank");
            closePopup();
        } else if (action === "teamSimulationAction") {
            document.getElementById('teamContainer').style.display = 'block';
            document.getElementById('showTeamButton').style.display = 'none';
            closePopup();
        }
    } else {
        document.getElementById("errorMessage").style.display = "block";
    }
}

// Close the popup
function closePopup(event) {
    if (event) {
        event.stopPropagation();
        // Only close if clicking on overlay or close button
        if (event.target.classList.contains('popup-overlay') || 
            event.target.classList.contains('popup-close')) {
            document.getElementById("popup-overlay").style.display = "none";
            document.getElementById("passwordPrompt").style.display = "none";
        }
    } else {
        document.getElementById("popup-overlay").style.display = "none";
        document.getElementById("passwordPrompt").style.display = "none";
    }
}

// Trigger verifyPassword on Enter key press
document.getElementById("passwordInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        verifyPassword();
    }
});


function videoBrief() {
    const backgroundVideo = document.getElementById('backgroundVideo');
    if (!backgroundVideo) return;

    const videoSrc = backgroundVideo.querySelector('source')?.getAttribute('src');
    if (!videoSrc) return;

    // Remove existing popup if any
    const existingPopup = document.querySelector('.video-popup');
    if (existingPopup) existingPopup.remove();

    // Create popup container
    const popup = document.createElement('div');
    popup.className = 'video-popup';
    popup.innerHTML = `
        <div class="video-popup-overlay" onclick="document.querySelector('.video-popup').remove()"></div>
        <div class="video-popup-content">
            <button class="video-popup-close" onclick="document.querySelector('.video-popup').remove()">✖</button>
            <video class="popup-video" autoplay muted loop playsinline>
                <source src="${videoSrc}" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    `;

    document.body.appendChild(popup);

    // Manually trigger play to ensure autoplay works across browsers
    const popupVideo = popup.querySelector('video');
    popupVideo.play().catch(err => console.warn("Autoplay failed:", err));
}
