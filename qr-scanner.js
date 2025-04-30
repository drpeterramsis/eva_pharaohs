/**
 * EVA Pharaohs QR Code Scanner
 * Professional QR Code scanning solution with manual input
 * Forces use of rear camera
 */

document.addEventListener('DOMContentLoaded', async () => {
    // DOM elements
    const manualCodeInput = document.getElementById('manual-code');
    const submitBtn = document.getElementById('submit-btn');
    const toggleInputBtn = document.getElementById('toggle-input');
    const messageDiv = document.getElementById('scanner-message');
    const qrScannerContainer = document.querySelector('.qr-scanner-container');
    
    // Toggle input type between text and password
    toggleInputBtn.addEventListener('click', () => {
        const isPassword = manualCodeInput.type === 'password';
        manualCodeInput.type = isPassword ? 'text' : 'password';
        toggleInputBtn.textContent = isPassword ? 'Hide Text' : 'Show Text';
        manualCodeInput.focus();
    });
    
    // Show message function with auto-hide
    const showMessage = (text, type) => {
        messageDiv.textContent = text;
        messageDiv.className = `scanner-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto-scroll to message and auto-hide success messages
        qrScannerContainer.scrollTo({
            top: qrScannerContainer.scrollHeight,
            behavior: 'smooth'
        });
        
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    };
    
    // Validate URL format
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };
    
    // Ensure URL has proper protocol
    const ensureHttp = (url) => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return 'https://' + url;
        }
        return url;
    };
    
    // Handle manual input submission
    const handleManualInput = () => {
        const input = manualCodeInput.value.trim();
        
        if (!input) {
            showMessage('Please enter a code.', 'error');
            manualCodeInput.focus();
            return;
        }
        
        if (isValidUrl(input)) {
            showMessage('Valid code detected. Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = ensureHttp(input);
            }, 500);
        } else {
            showMessage('The entered code is not a valid URL.', 'error');
        }
    };
    
    // Submit on button click or Enter key
    submitBtn.addEventListener('click', handleManualInput);
    manualCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleManualInput();
    });
    
    // Check camera permissions
    const checkCameraPermission = async () => {
        try {
            if (!navigator.permissions) return true; // Skip if Permissions API not supported
            
            const result = await navigator.permissions.query({ name: 'camera' });
            if (result.state === 'denied') {
                showMessage('Camera access denied. Please enable permissions in browser settings.', 'error');
                return false;
            }
            return true;
        } catch (e) {
            console.log('Permissions API not supported, proceeding anyway');
            return true;
        }
    };
    
    // Handle successful scan
    const handleScanSuccess = (decodedText) => {
        console.log("Scanned:", decodedText);
        
        if (isValidUrl(decodedText)) {
            showMessage('QR code detected. Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = ensureHttp(decodedText);
            }, 500);
        } else {
            showMessage('Scanned code is not a valid URL.', 'error');
        }
    };
    
    // Handle scan errors (only show relevant errors to user)
    const handleScanError = (error) => {
        if (!error.message.includes('No QR code found')) {
            console.error("Scan error:", error);
        }
    };
    
    // Find rear-facing camera
    const getRearCamera = async () => {
        try {
            const devices = await Html5Qrcode.getCameras();
            const rearCameras = devices.filter(device => 
                device.label.toLowerCase().includes('back') || 
                device.label.toLowerCase().includes('rear') ||
                device.label.toLowerCase().includes('environment')
            );
            
            if (rearCameras.length > 0) {
                return rearCameras[0].id; // Return first rear camera found
            }
            
            // If no explicitly labeled rear camera, try to find one by facingMode
            const constraints = { video: { facingMode: { exact: "environment" } } };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const tracks = stream.getVideoTracks();
            const rearCameraId = tracks[0]?.getSettings().deviceId;
            tracks.forEach(track => track.stop());
            
            if (rearCameraId) return rearCameraId;
            
            // Fallback to last device if no rear camera found
            return devices[devices.length - 1]?.id;
        } catch (error) {
            console.error("Error finding rear camera:", error);
            return null;
        }
    };
    
    // Initialize and configure QR scanner with rear camera
    const initializeScanner = async () => {
        try {
            qrScannerContainer.scrollTo(0, 0); // Reset scroll position
            
            if (!await checkCameraPermission()) return;
            
            const rearCameraId = await getRearCamera();
            if (!rearCameraId) {
                showMessage('Could not access rear camera. Using default camera.', 'error');
            }
            
            const html5QrcodeScanner = new Html5QrcodeScanner(
                "qr-reader",
                { 
                    fps: 10, 
                    qrbox: (width, height) => Math.min(width, height) * 0.8,
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                    rememberLastUsedCamera: true
                },
                /* verbose= */ false
            );
            
            // Start with rear camera if found
            if (rearCameraId) {
                await html5QrcodeScanner.start(
                    { deviceId: { exact: rearCameraId } },
                    { fps: 10, qrbox: 250 },
                    handleScanSuccess,
                    handleScanError
                );
            } else {
                // Fallback to default rendering if no rear camera found
                html5QrcodeScanner.render(handleScanSuccess, handleScanError);
            }
        } catch (error) {
            console.error("Scanner initialization failed:", error);
            showMessage('Scanner initialization failed. Please try refreshing the page.', 'error');
        }
    };
    
    // Start the scanner
    initializeScanner();
    
    // Focus the input field when container is clicked (useful on mobile)
    qrScannerContainer.addEventListener('click', () => {
        if (manualCodeInput.value === '') {
            manualCodeInput.focus();
        }
    });
});