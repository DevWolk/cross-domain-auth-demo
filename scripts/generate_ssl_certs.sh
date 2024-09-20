#!/bin/bash

# Check if OpenSSL is installed
if ! command -v openssl &> /dev/null; then
    echo "OpenSSL is not installed. Please install it and try again."
    exit 1
fi

# Function to generate a certificate for a single domain
generate_cert() {
    local domain=$1
    echo "Generating certificate for $domain"
    openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 \
        -keyout nginx/ssl_certs/$domain.key \
        -out nginx/ssl_certs/$domain.crt \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=$domain"
}

# Read domains from sites.txt
SITES_FILE="app_cast_io/public/sites.txt"
if [ ! -f "$SITES_FILE" ]; then
    echo "Error: $SITES_FILE not found!"
    exit 1
fi

# Generate certificates for all domains in sites.txt
while IFS= read -r domain
do
    # Skip empty lines and lines starting with #
    [[ -z "$domain" || "$domain" =~ ^#.*$ ]] && continue

    # Skip cast.io and app.cast.io as they will be handled by the wildcard cert
    if [[ "$domain" != "cast.io" && "$domain" != "app.cast.io" ]]; then
        generate_cert "$domain"
    fi
done < "$SITES_FILE"

# Generate a wildcard certificate for *.cast.io
echo "Generating wildcard certificate for *.cast.io"
openssl req -newkey rsa:2048 -nodes \
    -keyout nginx/ssl_certs/cast.io.key \
    -out nginx/ssl_certs/cast.io.csr \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=*.cast.io"

cat > nginx/ssl_certs/cast.io.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = DNS:*.cast.io, DNS:cast.io, DNS:app.cast.io
EOF

# Generate the certificate with SAN
openssl x509 -req -in nginx/ssl_certs/cast.io.csr \
    -signkey nginx/ssl_certs/cast.io.key \
    -out nginx/ssl_certs/cast.io.crt \
    -days 365 \
    -extfile nginx/ssl_certs/cast.io.ext

echo "All certificates have been generated in nginx/ssl_certs/"