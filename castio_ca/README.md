# castio.ca

This domain demonstrates a redirect-based flow for authentication (SSO).

## Implementation Details

- Uses redirection to app.cast.io for authentication
- Receives the token via URL parameters after successful authentication

## Key Files

- `server.js`: Handles the redirect and sets the cookie with the token
- `public/script.js`: Initiates the authentication process and updates the UI

## Authentication Process

1. User clicks the authentication check button
2. Redirect to app.cast.io occurs for authentication
3. After successful authentication, app.cast.io redirects back to castio.ca with a token
4. castio.ca sets a cookie with the received token
5. UI is updated to show authentication status

## Notes

- This method is secure and widely used for SSO
- Requires additional redirects