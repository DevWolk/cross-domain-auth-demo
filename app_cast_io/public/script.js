function showMessage(message, isError = false) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = isError ? 'error' : 'success';
    messageElement.style.display = 'block';
}

function hideMessage() {
    document.getElementById('message').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', checkAuthStatus);

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password}),
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            showMessage('Login successful');
            showLogoutSection(data.email);
        } else {
            showMessage(data.message, true);
        }
    } catch (error) {
        console.error('Error during login:', error);
        showMessage('Error during login', true);
    }
});

document.getElementById('logout-button').addEventListener('click', async () => {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            showMessage(data.message);
            showLoginSection();
        } else {
            showMessage(data.message, true);
        }
    } catch (error) {
        console.error('Error during logout:', error);
        showMessage('Error during logout', true);
    }
});

async function checkAuthStatus() {
    try {
        const response = await fetch('/api/checkAuth', {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();

        if (response.ok) {
            showLogoutSection(data.email);
            hideMessage();
        } else {
            showLoginSection();
            hideMessage();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        showLoginSection();
        showMessage('Error checking authentication status', true);
    }
}

function showLoginSection() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('logout-section').style.display = 'none';
}

function showLogoutSection(email) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('logout-section').style.display = 'block';
    document.getElementById('user-email').textContent = email;
}

window.addEventListener('message', async (event) => {
    if (event.origin !== 'https://castio.cn') return;

    if (event.data === 'CHECK_AUTH') {
        try {
            const response = await fetch('/api/checkAuth', {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();

            event.source.postMessage({
                type: 'AUTH_STATUS',
                isAuthenticated: response.ok,
                data: data
            }, event.origin);
        } catch (error) {
            console.error('Error checking auth status:', error);
            event.source.postMessage({
                type: 'AUTH_STATUS',
                isAuthenticated: false,
                error: 'Error checking authentication status'
            }, event.origin);
        }
    }
});