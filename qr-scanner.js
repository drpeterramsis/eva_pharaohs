/**
 * EVA Pharaohs QR Code Scanner
 * Professional QR Code scanning solution with manual input
 * Forces use of rear camera with proper initialization
 */

document.addEventListener('DOMContentLoaded', async () => {
    // ======================
    // DOM Element References
    // ======================
    const manualCodeInput = document.getElementById('manual-code');
    const submitBtn = document.getElementById('submit-btn');
    const toggleInputBtn = document.getElementById('toggle-input');
    const messageDiv = document.getElementById('scanner-message');
    const qrScannerContainer = document.querySelector('.qr-scanner-container');
    
    // =================
    // Utility Functions
    // =================
    
    /**
     * Toggles input field between text and password types
     */
    const toggleInputVisibility = () => {
        const isPassword = manualCodeInput.type === 'password';
        manualCodeInput.type = isPassword ? 'text' : 'password';
        toggleInputBtn.textContent = isPassword ? 'Hide Text' : 'Show Text';
        manualCodeInput.focus();
    };
    
    /**
     * Displays status messages to the user
     * @param {string} text - Message to display
     * @param {string} type - Message type ('error' or 'success')
     */
    const showMessage = (text, type) => {
        messageDiv.textContent = text;
        messageDiv.className = `scanner-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Smooth scroll to message
        qrScannerContainer.scrollTo({
            top: qrScannerContainer.scrollHeight,
            behavior: 'smooth'
        });
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    };
    
    /**
     * Validates if a string is a properly formatted URL
     * @param {string} string - Potential URL to validate
     * @returns {boolean} True if valid URL
     */
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };
    
    /**
     * Ensures a URL string has proper http/https protocol
     * @param {string} url - URL to normalize
     * @returns {string} Properly formatted URL
     */
    const ensureHttp = (url) => {
        return url.startsWith('http') ? url : `https://${url}`;
    };
    
    // ======================
    // Manual Input Handling
    // ======================
    
    /**
     * Processes manually entered codes
     */
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
    
    // Event listeners for manual input
    toggleInputBtn.addEventListener('click', toggleInputVisibility);
    submitBtn.addEventListener('click', handleManualInput);
    manualCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleManualInput();
    });
    
    // ===================
    // Camera Permissions
    // ===================
    
    /**
     * Checks and verifies camera permissions
     * @returns {Promise<boolean>} True if camera access is granted
     */
    const checkCameraPermission = async () => {
        try {
            if (navigator.permissions) {
                const result = await navigator.permissions.query({ name: 'camera' });
                if (result.state === 'denied') {
                    showMessage('Camera access denied. Please enable permissions in browser settings.', 'error');
                    return false;
                }
            }
            return true;
        } catch (e) {
            console.warn('Permissions API not supported, proceeding anyway');
            return true;
        }
    };
    
    // =================
    // Scanner Handlers
    // =================
    
    /**
     * Handles successful QR code scans
     * @param {string} decodedText - Decoded QR code content
     */
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
    
    /**
     * Handles scanner errors (filters out common non-critical errors)
     * @param {Error} error - Scanner error
     */
    const handleScanError = (error) => {
        if (!error.message.includes('No QR code found')) {
            console.error("Scan error:", error);
        }
    };
    
    // =====================
    // Camera Configuration
    // =====================
    
    /**
     * Identifies and returns the rear-facing camera device ID
     * @returns {Promise<string|null>} Device ID of rear camera or null if not found
     */
    const getRearCamera = async () => {
        try {
            // First try the standard facingMode constraint
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                const track = stream.getVideoTracks()[0];
                const settings = track.getSettings();
                track.stop();
                return settings.deviceId;
            } catch (facingModeError) {
                console.log('Facing mode approach failed, trying device enumeration');
            }
            
            // Fallback to device enumeration
            const devices = await Html5Qrcode.getCameras();
            
            // Try to find by common label patterns
            const rearCam = devices.find(device => 
                /back|rear|environment/i.test(device.label)
            );
            
            return rearCam?.id || devices[0]?.id;
        } catch (error) {
            console.error("Camera detection failed:", error);
            return null;
        }
    };
    
    // ========================
    // Scanner Initialization
    // ========================
    
    /**
     * Initializes and starts the QR code scanner
     */
    const initializeScanner = async () => {
        try {
            // Reset scroll position
            qrScannerContainer.scrollTo(0, 0);
            
            // Verify camera permissions
            if (!await checkCameraPermission()) return;
            
            // Create scanner instance
            const html5QrcodeScanner = new Html5QrcodeScanner(
                "qr-reader",
                { 
                    fps: 10, 
                    qrbox: 250,
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                    rememberLastUsedCamera: false // Important for consistent rear camera behavior
                },
                false // verbose mode off
            );
            
            // Try to get rear camera
            const rearCameraId = await getRearCamera();
            
            if (rearCameraId) {
                try {
                    // Attempt to start with explicit rear camera
                    await html5QrcodeScanner.start(
                        { deviceId: { exact: rearCameraId } },
                        null, // No camera ID override
                        handleScanSuccess,
                        handleScanError
                    );
                    return; // Successfully started with rear camera
                } catch (startError) {
                    console.warn("Failed to start with rear camera:", startError);
                    showMessage('Could not access rear camera. Trying default...', 'error');
                }
            }
            
            // Fallback to default camera selection
            html5QrcodeScanner.render(handleScanSuccess, handleScanError);
            
        } catch (error) {
            console.error("Scanner initialization error:", error);
            showMessage('Failed to initialize scanner. Please refresh and allow camera access.', 'error');
        }
    };
    
    // =============
    // Main Execution
    // =============
    
    // Initialize scanner
    initializeScanner();
    
    // Focus input field when container is clicked (mobile optimization)
    qrScannerContainer.addEventListener('click', () => {
        if (!manualCodeInput.value) {
            manualCodeInput.focus();
        }
    });
});