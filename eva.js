// eva.js
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
    
    // Hide loader after everything is loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            const loader = document.querySelector('.loader');
            if (loader) {
                loader.classList.add('fade-out');
                
                // Remove loader after fade out
                setTimeout(function() {
                    loader.style.display = 'none';
                }, 1000);
            }
        }, 1000);
    });
    
    // Parallax effect for background
    document.addEventListener('mousemove', function(e) {
        const background = document.querySelector('.background');
        if (background) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            background.style.transform = `scale(1.05) translate(${x * 10}px, ${y * 10}px)`;
        }
    });
    
    // Reset background position when mouse leaves
    document.querySelector('.splash')?.addEventListener('mouseleave', function() {
        const background = document.querySelector('.background');
        if (background) {
            background.style.transform = 'scale(1.1)';
        }
    });
});