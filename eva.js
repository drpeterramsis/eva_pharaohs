document.addEventListener('DOMContentLoaded', function () {
    // Disable right-click and certain shortcuts
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    document.addEventListener('keydown', function (e) {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
        }
    });

    // Hide loader and centered logo after loading
    window.addEventListener('load', function () {
        // Loader fade out
        setTimeout(function () {
            const loader = document.querySelector('.loader');
            document.querySelector('.pharaoh-character')?.classList.add('loaded');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 1500); // Fade out loader after 1.5 seconds
            }
        }, 2000); // Initial delay for loader fade out

        // Centered logo fade out after 3 seconds
        const centeredLogo = document.querySelector('.centered-logo');
        setTimeout(() => {
            if (centeredLogo) {
                centeredLogo.classList.add('fade-out');
                setTimeout(() => {
                    centeredLogo.style.display = 'none';
                }, 2000); // Match the fade-out duration for logo
            }
        }, 2000); // Delay for logo fade out

        // Fade in the menu and buttons AFTER the loader and logo fade out
        setTimeout(() => {
            // Make sure everything has been hidden and transitions are complete
            const menuContainer = document.querySelector('.menu');
            if (menuContainer) {
                menuContainer.classList.add('fade-in'); // Add fade-in class
            }
        }, 4500); // Wait for the loader and logo to fade out (2000ms + 2000ms for logo fade)
    });

    // Parallax effect
    document.addEventListener('mousemove', function (e) {
        const background = document.querySelector('.background');
        if (background) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            background.style.transform = `scale(1.05) translate(${x * 10}px, ${y * 10}px)`;
        }
    });

    // Reset background position on mouse leave
    document.querySelector('.splash')?.addEventListener('mouseleave', function () {
        const background = document.querySelector('.background');
        if (background) {
            background.style.transform = 'scale(1.1)';
        }
    });

    // Reset scroll
    window.scrollTo(0, 0);
    const menuContainer = document.querySelector('.menu-container');
    if (menuContainer) {
        menuContainer.scrollTop = 0;
    }

    // Pharaoh character click animation
    const pharaoh = document.querySelector('.pharaoh-character');
    if (pharaoh) {
        pharaoh.addEventListener('click', function () {
            this.classList.toggle('pharaoh-animate');
        });
    }
});
