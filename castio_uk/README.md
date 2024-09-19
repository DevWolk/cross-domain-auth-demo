# castio.uk

This domain demonstrates a direct cross-domain request to app.cast.io.

## Implementation Details

- Uses CORS for direct requests to the app.cast.io API
- Demonstrates CORS setup on both server and client

## Key Files

- `public/script.js`: Performs an AJAX request to app.cast.io

## Authentication Check Process

1. When the check button is clicked, an AJAX request is made to app.cast.io
2. The app.cast.io server checks the token and returns the result
3. The client processes the response and updates the UI

## Notes

- This method requires proper CORS configuration on the server
- May be blocked by browser security policies (e.g., CORS, Content Security Policy)