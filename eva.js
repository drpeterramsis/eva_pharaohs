// Enhanced JavaScript with security features and animations
document.addEventListener('DOMContentLoaded', function() {
    // Disable right-click and inspect
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
    
    // Create particles
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = window.innerWidth < 768 ? 30 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random properties
            const size = Math.random() * 5 + 2;
            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * window.innerHeight;
            const opacity = Math.random() * 0.5 + 0.3;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            particle.style.opacity = opacity;
            particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
            
            particlesContainer.appendChild(particle);
        }
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
                    
                    // Create particles after loader is hidden
                    createParticles();
                    
                    // After fade-out finishes, show banner
                    setTimeout(() => {
                        const splash = document.querySelector('.splash');
                        splash.classList.add('show-banner');
                        
                        // After the banner is shown, show menu
                        setTimeout(() => {
                            splash.classList.add('show-menu');
                        }, 1000);
                        
                    }, 1000);
                }, 500); // Short delay after loader hides
                
            }, 1000); // Match the fade-out duration
        }, 1500); // Minimum loader display time
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
