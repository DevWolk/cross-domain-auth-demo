document.getElementById('site-name').textContent = window.location.hostname;

document.getElementById('check-auth').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/checkAuth', {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(`Authenticated as: ${data.email}`, 'success');
        } else {
            showMessage(data.message || 'Not authenticated', 'error');
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