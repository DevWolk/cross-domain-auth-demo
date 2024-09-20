document.getElementById('site-name').textContent = window.location.hostname;

function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = type;
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
            if (data.redirect) {
                showMessage('Login successful. Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 2000);
            } else {
                showMessage(`Authenticated as: ${data.email}`, 'success');
                showLogoutSection(data.email);
            }
        } else {
            showMessage(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage('Error during login: ' + error.message, 'error');
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
            showMessage(data.message, 'success');
            showLoginSection();
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Error during logout: ' + error.message, 'error');
    }
});

document.getElementById('refresh-button').addEventListener('click', function() {
    location.reload();
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
        showLoginSection();
        showMessage('Error checking auth status: ' + error.message, 'error');
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
            event.source.postMessage({
                type: 'AUTH_STATUS',
                isAuthenticated: false,
                error: 'Error checking auth status: ' + error.message
            }, event.origin);
        }
    }
});