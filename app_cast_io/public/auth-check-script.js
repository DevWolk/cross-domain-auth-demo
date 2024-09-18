async function checkAuthStatus() {
    try {
        const response = await fetch('/api/checkAuth', {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        return {isAuthenticated: response.ok, data: data};
    } catch (error) {
        console.error('Error checking auth status:', error);
        return {isAuthenticated: false, error: 'Error checking authentication status'};
    }
}

window.addEventListener('message', async (event) => {
    if (event.origin !== 'https://castio.cn') return;

    if (event.data === 'CHECK_AUTH') {
        const authStatus = await checkAuthStatus();
        event.source.postMessage({
            type: 'AUTH_STATUS',
            ...authStatus
        }, event.origin);
    }
});

window.opener.postMessage('AUTH_CHECK_READY', 'https://castio.cn');