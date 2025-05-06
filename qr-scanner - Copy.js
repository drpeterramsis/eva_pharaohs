/**
 * EVA Pharaohs QR Code Scanner
 * Professional QR Code scanning solution with manual input
 * Forces use of rear camera with proper initialization
 */

// Load the HTML5 QR code library
document.addEventListener('DOMContentLoaded', async () => {
    // DOM elements
    const manualCodeInput = document.getElementById('manual-code');
    const submitBtn = document.getElementById('submit-btn');
    const toggleInputBtn = document.getElementById('toggle-input');
    const messageDiv = document.getElementById('scanner-message');
    const qrScannerContainer = document.querySelector('.qr-scanner-container');
    
    // Toggle input visibility
    toggleInputBtn.addEventListener('click', () => {
        const isPassword = manualCodeInput.type === 'password';
        manualCodeInput.type = isPassword ? 'text' : 'password';
        toggleInputBtn.textContent = isPassword ? 'Hide Text' : 'Show Text';
        manualCodeInput.focus();
    });
    
    // Show message with auto-hide for success
    const showMessage = (text, type) => {
        messageDiv.textContent = text;
        messageDiv.className = `scanner-message ${type}`;
        messageDiv.style.display = 'block';
        
        qrScannerContainer.scrollTo({
            top: qrScannerContainer.scrollHeight,
            behavior: 'smooth'
        });
        
        if (type === 'success') {
            setTimeout(() => messageDiv.style.display = 'none', 3000);
        }
    };
    
    // URL validation helpers
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };
    
    const ensureHttp = (url) => {
        return url.startsWith('http') ? url : `https://${url}`;
    };
    
    // Manual input handling
    const handleManualInput = () => {
        const input = manualCodeInput.value.trim();
        if (!input) {
            showMessage('Please enter a code.', 'error');
            manualCodeInput.focus();
            return;
        }
        
        if (isValidUrl(input)) {
            showMessage('Redirecting...', 'success');
            setTimeout(() => { window.location.href = ensureHttp(input); }, 500);
        } else {
            showMessage('Invalid URL format.', 'error');
        }
    };
    
    submitBtn.addEventListener('click', handleManualInput);
    manualCodeInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleManualInput());
    
    // Camera permission check
    const checkCameraPermission = async () => {
        try {
            if (navigator.permissions) {
                const result = await navigator.permissions.query({ name: 'camera' });
                if (result.state === 'denied') {
                    showMessage('Camera access denied in browser settings.', 'error');
                    return false;
                }
            }
            return true;
        } catch (e) {
            console.warn('Permissions API not supported');
            return true;
        }
    };
    
    // Scan handlers
    const handleScanSuccess = (decodedText) => {
        console.log("Scanned:", decodedText);
        if (isValidUrl(decodedText)) {
            showMessage('Valid code found. Redirecting...', 'success');
            setTimeout(() => { window.location.href = ensureHttp(decodedText); }, 500);
        } else {
            showMessage('Scanned code is not a URL.', 'error');
        }
    };
    
    const handleScanError = (error) => {
        if (!error.message.includes('No QR code found')) {
            console.error("Scan error:", error);
        }
    };
    
    // Camera selection
    const getRearCamera = async () => {
        try {
            // Try facingMode constraint first
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                const track = stream.getVideoTracks()[0];
                const settings = track.getSettings();
                track.stop();
                return settings.deviceId;
            } catch (facingModeError) {
                console.log('Facing mode approach failed, trying device list');
            }
            
            // Fallback to device enumeration
            const devices = await Html5Qrcode.getCameras();
            const rearCam = devices.find(device => 
                /back|rear|environment/i.test(device.label)
            );
            return rearCam?.id || devices[0]?.id;
        } catch (error) {
            console.error("Camera detection failed:", error);
            return null;
        }
    };
    
    // Scanner initialization
    const initializeScanner = async () => {
        try {
            qrScannerContainer.scrollTo(0, 0);
            
            if (!await checkCameraPermission()) return;
            
            const html5QrcodeScanner = new Html5QrcodeScanner(
                "qr-reader",
                { 
                    fps: 10, 
                    qrbox: 250,
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                    rememberLastUsedCamera: false // Important for consistent rear camera behavior
                },
                false
            );
            
            const rearCameraId = await getRearCamera();
            if (rearCameraId) {
                try {
                    await html5QrcodeScanner.start(
                        { deviceId: { exact: rearCameraId } },
                        null,
                        handleScanSuccess,
                        handleScanError
                    );
                    return; // Successfully started with rear camera
                } catch (startError) {
                    console.warn("Failed to start with rear camera:", startError);
                }
            }
            
            // Fallback to default camera selection
            html5QrcodeScanner.render(handleScanSuccess, handleScanError);
            
        } catch (error) {
            console.error("Scanner init error:", error);
            showMessage('Failed to start camera. Please refresh and allow camera access.', 'error');
        }
    };
    
    // Initialize and set up click handler
    initializeScanner();
    qrScannerContainer.addEventListener('click', () => {
        if (!manualCodeInput.value) manualCodeInput.focus();
    });
});
