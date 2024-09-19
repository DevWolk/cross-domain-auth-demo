# castio.us

This domain demonstrates an attempt to set an additional cookie for different domains.

## Implementation Details

- Attempts to set a cookie from another domain during authentication in app.cast.io
- Demonstrates browser limitations on setting cookies

## Key Files

- `server.js`: Attempts to set a cookie during authentication
- `public/script.js`: Checks for the presence of the cookie on the client side

## Authentication Check Process

1. During login on app.cast.io, an attempt is made to set a cookie for castio.us
2. When checking authentication on castio.us, the cookie is not found

## Notes

- This method doesn't work due to browser security policies
- Serves to demonstrate the limitations of cross-domain cookie handling