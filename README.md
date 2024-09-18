# Cross-Domain Authentication Demo

## Project Overview

This project demonstrates various methods of cross-domain authentication using JWT cookies, subdomains, shared SSL certificates, iframes, and the postMessage API.

## Sites

1. **https://app.cast.io/**: Main login site
2. **https://cast.io/**: Shared certificate with main domain
3. **https://castio.au/**: iframe authentication check
4. **https://castio.cn/**: postMessage authentication check
5. **https://castio.us/**: Attempt to set additional cookie (expected to fail)

## Setup

1. Generate self-signed SSL certificates running the following script:
   ```bash
   ./nginx/generate_ssl_certs.sh
   ```
   This script will create certificates for all required domains in the `nginx/ssl_certs/` directory.

2. Add the following to `/etc/hosts`:
   ```
   127.0.0.1 app.cast.io cast.io castio.au castio.cn castio.us
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
- **castio.us**: Failed cookie set (different root domain)

## Cleanup

Run `docker compose down` to stop and remove containers