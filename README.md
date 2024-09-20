# Cross-Domain Authentication Demo

## Project Overview

This project demonstrates various methods of cross-domain authentication using JWT tokens, subdomains, shared SSL certificates, iframes, postMessage API, and redirect-based SSO authentication. It showcases different approaches to handling authentication across multiple domains, highlighting the advantages and challenges of each method.

## Domains and Authentication Methods

1. **https://app.cast.io/**: Main login site and authentication server
2. **https://cast.io/**: Shared certificate with main domain
3. **https://castio.au/**: iframe authentication check
4. **https://castio.ca/**: Redirect-based authentication flow with app.cast.io
5. **https://castio.cn/**: postMessage authentication check
6. **https://castio.uk/**: Direct cross-site request to app.cast.io
7. **https://castio.us/**: Attempt to set additional cookie (demonstrating limitations)

## Comparison Table of Methods

| Method             | Advantages                               | Disadvantages                               |
|--------------------|------------------------------------------|---------------------------------------------|
| Shared domain      | Simple implementation, reliable          | Limited to domains with shared TLD          |
| iframe             | Works across different domains           | May be blocked by browser security policies |
| Redirect-based SSO | Secure, widely supported                 | Requires additional redirects               |
| postMessage        | Flexible, works across different domains | Requires proper origin checking             |
| CORS request       | Simple implementation                    | Depends on CORS settings on the server      |
| Setting cookie     | Demonstrates browser limitations         | Doesn't work across different domains       |

## Setup and Run

1. Generate self-signed SSL certificates:
   ```bash
   make generate-ssl-certs
   ```
   This script will create certificates for all required domains in the `nginx/ssl_certs/` directory.

2. Add the following entries (based on the app_cast_io/public/sites.txt file) to your `/etc/hosts` file:
   ```txt
   127.0.0.1 app.cast.io
   127.0.0.1 cast.io
   127.0.0.1 castio.au
   127.0.0.1 castio.ca
   127.0.0.1 castio.cn
   127.0.0.1 castio.uk
   127.0.0.1 castio.us
   ```

3. Start the project:
   ```bash
   make up
   ```

## Testing

1. Open https://app.cast.io/ in your browser and log in with:
   - Username: admin@local.com
   - Password: admin@local.com

2. Visit each of the other domains to test their authentication methods and status.
3. Observe how each site handles authentication and communicates with the main authentication server.

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


## Adding a New Domain

To add a new domain to the demo:

1. Run the command:
   ```bash
   make install
   ```
2. Update the /etc/hosts configuration to include the new domain.
3. Proceed tho the new folder in the public/ directory, and add the files [favicon.ico](https://favicon.io/emoji-favicons/).
4. Update the main README.md with information about the new domain and its authentication method.

## Cleanup

To stop and remove all containers:

```bash
make down
```

