document.getElementById('site-name').textContent = window.location.hostname;

function checkAuthOnAppCastIo() {
    return new Promise((resolve, reject) => {
        const authWindow = window.open('https://app.cast.io/auth-check.html', 'AuthCheck', 'width=1,height=1');

        if (!authWindow) {
            reject(new Error('Popup blocked. Please allow popups for this site.'));
            return;
        }

        let timeoutId;

        function handleMessage(event) {
            if (event.origin !== 'https://app.cast.io') return;

            if (event.data === 'AUTH_CHECK_READY') {
                authWindow.postMessage('CHECK_AUTH', 'https://app.cast.io');
            } else if (event.data.type === 'AUTH_STATUS') {
                clearTimeout(timeoutId);
                window.removeEventListener('message', handleMessage);
                resolve(event.data);
                authWindow.close();
            }
        }

        window.addEventListener('message', handleMessage);

        timeoutId = setTimeout(() => {
            window.removeEventListener('message', handleMessage);
            authWindow.close();
            reject(new Error('Auth check timed out'));
        }, 5000);
    });
}

document.getElementById('check-auth').addEventListener('click', async () => {
    try {
        const authStatus = await checkAuthOnAppCastIo();
        if (authStatus.isAuthenticated) {
            showMessage(`Authenticated as: ${authStatus.data.email}`, 'success');
        } else {
            showMessage(authStatus.data.message || 'No token found', 'error');
        }
    } catch (error) {
        showMessage('Error checking auth status: ' + error.message, 'error');
    }
});

function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = type;
    messageElement.style.display = 'block';
}