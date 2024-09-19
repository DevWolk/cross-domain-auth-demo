# Cross-Domain Authentication Demo

## Project Overview

This project demonstrates various methods of cross-domain authentication using JWT tokens, subdomains, shared SSL certificates, iframes, postMessage API, and redirect-based SSO authentication.

## Domains and Authentication Methods

1. **https://app.cast.io/**: Main login site
2. **https://cast.io/**: Shared certificate with main domain
3. **https://castio.au/**: iframe authentication check
4. **https://castio.cn/**: postMessage authentication check
5. **https://castio.us/**: Attempt to set additional cookie
6. **https://castio.uk/**: Direct cross-site request to app.cast.io
7. **https://castio.ca/**: Redirect-based authentication flow with app.cast.io

## Comparison Table of Methods

| Method             | Advantages                               | Disadvantages                               |
|--------------------|------------------------------------------|---------------------------------------------|
| Shared domain      | Simple implementation, reliable          | Limited to domains with shared TLD          |
| iframe             | Works across different domains           | May be blocked by browser security policies |
| postMessage        | Flexible, works across different domains | Requires Browser support                    |
| Setting cookie     | Demonstrates browser limitations         | Doesn't work across different domains       |
| CORS request       | Simple implementation                    | Depends on CORS settings on the server      |
| Redirect-based SSO | Reliable, widely supported               | May be less convenient for development      |

## Setup and Run

1. Generate self-signed SSL certificates:
   ```bash
   ./nginx/generate_ssl_certs.sh
   ```
   This script will create certificates for all required domains in the `nginx/ssl_certs/` directory.

2. Add the following entries to your `/etc/hosts` file:
   ```
   127.0.0.1 app.cast.io
   127.0.0.1 cast.io
   127.0.0.1 castio.au
   127.0.0.1 castio.cn
   127.0.0.1 castio.uk
   127.0.0.1 castio.us
   127.0.0.1 castio.ca
   ```

3. Run the project:
   ```
   docker compose up --build
   ```

## Testing

1. Login at https://app.cast.io/ (username: admin@local.com, password: admin@local.com)
2. Visit each site to check authentication status
3. Note the different methods used by each site

## Expected Results

- **app.cast.io & cast.io**: Successful authentication (shared domain)
- **castio.au**: Successful (iframe method). The iframe loads a page from the main domain, which checks for the token and sends the result back to the parent window.
- **castio.cn**: Successful (postMessage method). When properly implemented with origin checking, it's a fairly secure method.
- **castio.us**: Failed cookie set (different root domain). If you try to set a cookie for `castio.us` when logging in to `app.cast.io`, the browser blocks the cookie setting with an error: `This attempt to set a cookie via a Set-Cookie header was blocked because its Domain attribute was invalid with regards to the current host url`.
- **castio.uk**: Successful (cross-site request)
- **castio.ca**: Successful (redirect-based authentication flow)

## Redirect-based Authentication Flow (castio.ca)

1. User clicks "Check Authentication" on castio.ca
2. User is redirected to app.cast.io/login with an auth-redirect parameter
3. After successful login (or if already logged in), user is redirected back to castio.ca with a JWT and validation parameter
4. castio.ca verifies the JWT and sets it as a cookie, completing the authentication

## Cleanup

Run `docker compose down` to stop and remove containers

## How do I add a new domain to the demo?**
Create a new folder for the domain, add the necessary files (.env, package.json, server.js, config.js, Dockerfile, public/, [favicon.ico](https://favicon.io/emoji-favicons/), etc.), update docker-compose.yml and nginx configuration.
Update generate_ssl_certs.sh to include the new domain and run the script to generate SSL certificates.
Update the README with the new domain and authentication method.