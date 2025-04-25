document.addEventListener('DOMContentLoaded', function() {
    // Security: Disable right-click and inspect
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('keydown', function(e) {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') || 
            (e.ctrlKey && e.shiftKey && e.key === 'J') || 
            (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
        }
    });
    
    // Initialize menu buttons with new tab functionality
    function initializeMenuButtons() {
        const buttons = document.querySelectorAll('.menu button');
        // Add this to your initializeMenuButtons() function
const imageButton = document.querySelector('.image-button');
if (imageButton) {
    imageButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.open('leaders.html', '_blank', 'noopener,noreferrer');
    });
}
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add visual feedback
                button.classList.add('button-clicked');
                setTimeout(() => {
                    button.classList.remove('button-clicked');
                }, 300);
                
                // Define target URLs
                const targetUrls = {
                    'Schedule': 'schedule.html',
                    'Rooming List': 'rooming.html',
                    'Road to Hotel': 'directions.html',
                    'Assessment': 'assessment.html'
                };
                
                const buttonText = button.textContent.trim();
                if (targetUrls[buttonText]) {
                    // Open in new tab with security features
                    const newWindow = window.open(targetUrls[buttonText], '_blank');
                    
                    // Prevent potential security issues
                    if (newWindow) {
                        newWindow.opener = null;
                    } else {
                        // Fallback if popup is blocked
                        alert('Please allow popups for this site to open in new tab');
                    }
                }
            });
        });
    }
    
    // Hide loader after everything is loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            const loader = document.querySelector('.loader');
            loader.classList.add('fade-out');
            
            // Remove loader after fade out
            setTimeout(function() {
                loader.style.display = 'none';
                
                // Start main animation sequence
                setTimeout(() => {
                    const splashContent = document.querySelector('.content');
                    splashContent.classList.add('fade-out');
                    
                    // After fade-out finishes, show banner
                    setTimeout(() => {
                        const splash = document.querySelector('.splash');
                        splash.classList.add('show-banner');
                        splash.classList.add('show-hiero-line');
                        
                        // After the banner is shown, show menu
                        setTimeout(() => {
                            splash.classList.add('show-menu');
                            initializeMenuButtons();
                        }, 1000);
                        
                    }, 1000);
                }, 500);
                
            }, 1000);
        }, 1000);
    });
    
    // Parallax effect for background
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        const background = document.querySelector('.background');
        
        background.style.transform = `scale(1.05) translate(${x * 10}px, ${y * 10}px)`;
    });
    
    // Reset background position when mouse leaves
    document.querySelector('.splash').addEventListener('mouseleave', function() {
        const background = document.querySelector('.background');
        background.style.transform = 'scale(1.1)';
    });
});

// Add this to eva.js for better button feedback
function handleButtonClick(button) {
    button.classList.add('button-clicked');
    setTimeout(() => {
        button.classList.remove('button-clicked');
        
        const pageMap = {
            'Schedule': 'schedule.html',
            'Rooming List': 'rooming.html',
            'Teams': 'teams.html',
            'Assessment': 'assessment.html'
        };
        
        const buttonText = button.textContent.trim();
        if (pageMap[buttonText]) {
            window.open(pageMap[buttonText], '_blank', 'noopener,noreferrer');
        }
    }, 300);
}