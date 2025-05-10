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


 const mapPopup = document.getElementById('mapPopup');
    const mapImage = document.getElementById('mapImage');

    function map() {
        mapPopup.style.display = 'flex';
    }

    function closeMap() {
        mapPopup.style.display = 'none';
    }

    // Zoom functionality
    let scale = 1;
    let start = { x: 0, y: 0 };
    let isDragging = false;

    mapImage.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomIntensity = 0.1;
        scale += (e.deltaY < 0 ? 1 : -1) * zoomIntensity;
        scale = Math.min(Math.max(1, scale), 5); // Limit zoom between 1x and 5x
        mapImage.style.transform = `scale(${scale})`;
    });

    // Drag to pan on zoom
    mapImage.addEventListener('mousedown', (e) => {
        if (scale === 1) return;
        isDragging = true;
        start = { x: e.clientX, y: e.clientY };
        mapImage.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let dx = e.clientX - start.x;
        let dy = e.clientY - start.y;
        mapImage.style.transform += ` translate(${dx}px, ${dy}px)`;
        start = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        mapImage.style.cursor = 'default';
    });

    // Touch pinch zoom
    let initialDistance = 0;
    let initialScale = 1;

    mapImage.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            initialDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            initialScale = scale;
        }
    });

    mapImage.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const pinchScale = currentDistance / initialDistance;
            scale = Math.min(Math.max(1, initialScale * pinchScale), 5);
            mapImage.style.transform = `scale(${scale})`;
        }
    });