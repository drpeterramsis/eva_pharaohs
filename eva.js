// Delay for 2 seconds before starting the animation
setTimeout(() => {
    const splashContent = document.querySelector('.content');
    splashContent.classList.add('fade-out'); // Trigger fade-out for content

    // After fade-out finishes, show banner
    setTimeout(() => {
        const splash = document.querySelector('.splash');
        splash.classList.add('show-banner'); // Show banner after fade-out
        
        // After the banner is shown, show menu
        setTimeout(() => {
            splash.classList.add('show-menu'); // Show menu after banner
        }, 1000); // Menu appears after 1 second

    }, 1000); // Banner shows 1 second after content fades out
}, 2000); // Start the sequence 2 seconds after page load
