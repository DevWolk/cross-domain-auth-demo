# app.cast.io

This domain serves as the main site for user login and authentication.

## Implementation Details

- Uses express.js to create the server
- Implements JWT authentication
- Sets cookies for authentication
- Provides an API for checking authentication status

## Key Files

- `server.js`: Main server file
- `config.js`: Application configuration
- `public/script.js`: Client-side JavaScript for handling different authentication methods

## Authentication Process

1. User enters credentials on the login page
2. Server verifies credentials and creates a JWT
3. JWT is set as a cookie
4. On subsequent requests, JWT is used to verify authentication

## Notes

- This domain also handles redirect-based authentication for castio.ca
- Provides iframe and postMessage interfaces for other authentication methods