# castio.cn

This domain demonstrates authentication checking via the postMessage API.

## Implementation Details

- Uses window.open to create a new window on app.cast.io
- Communicates with the new window using window.postMessage

## Key Files

- `public/script.js`: Opens a new window and handles messages from it

## Authentication Check Process

1. When the check button is clicked, a new window is opened on app.cast.io
2. The new window checks the authentication status
3. The result is sent back via postMessage
4. The main page receives the message and updates the UI

## Notes

- This method works across different domains
- Requires the user to allow pop-ups