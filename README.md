# Cross-Domain Authentication Demo

## Project Overview

This project demonstrates various methods of cross-domain authentication using JWT cookies, subdomains, shared SSL certificates, iframes, and the postMessage API.

## Sites

1. **https://app.cast.io/**: Main login site (expected to succeed)
2. **https://cast.io/**: Shared certificate with main domain (expected to succeed)
3. **https://castio.au/**: iframe authentication check (expected to succeed)
4. **https://castio.cn/**: postMessage authentication check (expected to succeed)
5. **https://castio.us/**: Attempt to set additional cookie (expected to fail)
6. **https://castio.uk/**: Attempt to make a direct cross-site request to app.cast.io. (expected to succeed)

## Setup

1. Generate self-signed SSL certificates running the following script:
   ```bash
   ./nginx/generate_ssl_certs.sh
   ```
   This script will create certificates for all required domains in the `nginx/ssl_certs/` directory.

2. Add the following to `/etc/hosts`:
   ```
   127.0.0.1 app.cast.io
   127.0.0.1 cast.io
   127.0.0.1 castio.au
   127.0.0.1 castio.cn
   127.0.0.1 castio.uk
   127.0.0.1 castio.us
   ```

3. Run the following command to start the project:
   ```
   docker compose up --build
   ```

## Testing

1. Login at https://app.cast.io/ (admin@local.com / admin@local.com)
2. Visit each site to check authentication status
3. Note the different methods used by each site

## Expected Results

- **app.cast.io & cast.io**: Successful authentication (shared domain)
- **castio.au**: Successful (iframe method)
- **castio.cn**: Successful (postMessage method)
- **castio.us**: Failed cookie set (different root domain). If you try to set a cookie for `castio.us` when logging in to `app.cast.io`, the browser blocks the cookie setting with an error: `This attempt to set a cookie via a Set-Cookie header was blocked because its Domain attribute was invalid with regards to the current host url`.
- **castio.uk**: Successful (cross-site request)

## Cleanup

Run `docker compose down` to stop and remove containers