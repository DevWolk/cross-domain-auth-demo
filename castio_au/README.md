# castio.au

This domain demonstrates authentication checking via iframe.

## Implementation Details

- Uses a hidden iframe to load a page from app.cast.io
- Communicates with the iframe using window.postMessage

## Key Files

- `public/script.js`: Creates the iframe and handles messages from it
- `public/index.html`: Contains the iframe element

## Authentication Check Process

1. A hidden iframe is created with a URL to app.cast.io
2. The iframe loads a page that checks the authentication status
3. The result is sent back via postMessage
4. The main page receives the message and updates the UI

## Notes

- This method may be blocked by browser security policies (e.g., X-Frame-Options)
- Works across different domains with proper setup