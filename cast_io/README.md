# cast.io

This domain demonstrates the use of a shared certificate with the main domain for authentication.

## Implementation Details

- Uses the same SSL certificate as app.cast.io
- Can read cookies set by app.cast.io due to the shared top-level domain

## Key Files

- `server.js`: Simple server for serving static files and checking authentication
- `public/script.js`: Client-side JavaScript for checking authentication status

## Authentication Check Process

1. Client sends a request to `/api/checkAuth`
2. Server checks for the presence and validity of the JWT in cookies
3. Returns authentication status to the client

## Notes

- This method only works for domains with a shared TLD
- It's the simplest and most reliable method for subdomains