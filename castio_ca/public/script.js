document.getElementById('site-name').textContent = window.location.hostname;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
        checkAuthStatus();
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

document.getElementById('check-auth').addEventListener('click', () => {
    window.location.href = 'https://app.cast.io/login?auth-redirect=1';
});

async function checkAuthStatus() {
    try {
        const response = await fetch('/api/checkUserAuth', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(`Authenticated as: ${data.email}`, 'success');
        } else {
            showMessage(data.message || 'No token found', 'error');
        }
    } catch (error) {
        showMessage('Error checking auth status: ' + error.message, 'error');
    }
}

function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = type;
    messageElement.style.display = 'block';
}