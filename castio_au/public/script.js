document.getElementById('site-name').textContent = window.location.hostname;

let authFrame;

function createAuthFrame() {
    if (!authFrame) {
        authFrame = document.createElement('iframe');
        authFrame.style.display = 'none';
        authFrame.src = 'https://app.cast.io/auth-status.html';
        document.body.appendChild(authFrame);
    }
}

function checkAuthStatus() {
    return new Promise((resolve, reject) => {
        createAuthFrame();

        const handleMessage = (event) => {
            if (event.origin !== 'https://app.cast.io') return;

            window.removeEventListener('message', handleMessage);
            resolve(event.data);
        };

        window.addEventListener('message', handleMessage);

        authFrame.src += '';

        setTimeout(() => {
            window.removeEventListener('message', handleMessage);
            reject(new Error('Auth check timed out'));
        }, 5000);
    });
}

document.getElementById('check-auth').addEventListener('click', async () => {
    try {
        const authStatus = await checkAuthStatus();
        if (authStatus.isAuthenticated) {
            showMessage(`Authenticated as: ${authStatus.email}`, 'success');
        } else {
            showMessage(authStatus.message || 'Not authenticated', 'error');
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        showMessage('Error checking authentication status', 'error');
    }
});

function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = type;
    messageElement.style.display = 'block';
}

createAuthFrame();