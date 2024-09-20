#!/bin/bash

# Check if a site name was provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <new-site-name>"
  echo "Example: $0 castio.newdomain"
  exit 1
fi

NEW_SITE=$1
DIR_NAME=$(echo $NEW_SITE | tr '.' '_')
COMPOSE_NAME=$(echo $NEW_SITE | tr '.' '-')

# Function to generate a random string for SECRET_KEY
generate_secret() {
  openssl rand -hex 32
}

# Create necessary directories
mkdir -p "$DIR_NAME/make"
mkdir -p "$DIR_NAME/public"

# Create docker-compose file for the new site
cat <<EOF >"$DIR_NAME/docker-compose.$COMPOSE_NAME.yml"
services:
  $DIR_NAME:
    build: ./$DIR_NAME
    container_name: $DIR_NAME
    expose:
      - "80"
    env_file:
      - ./$DIR_NAME/.env
    networks:
      app-network:
        aliases:
          - $NEW_SITE
EOF

# Create variables.mk for the new site
echo "COMPOSE_FILE += -f ./$DIR_NAME/docker-compose.$COMPOSE_NAME.yml" >"$DIR_NAME/make/variables.mk"

# Add new site to root variables.mk
echo "-include $DIR_NAME/make/variables.mk" >>variables.mk

# Create .env file
cat <<EOF >"$DIR_NAME/.env"
PORT=80
NODE_ENV=production
SECRET_KEY=$(generate_secret)
EOF

# Create package.json
cat <<EOF >"$DIR_NAME/package.json"
{
  "name": "${DIR_NAME}",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "jsonwebtoken": "^8.5.1",
    "axios": "^0.21.1",
    "dotenv": "^10.0.0"
  }
}
EOF

# Create server.js
cat <<EOF >"$DIR_NAME/server.js"
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const config = require('./config');

const app = express();
app.use(cookieParser());
app.use(express.static('public'));

app.post('/api/checkAuth', async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({message: 'No token found'});
    }
    try {
        const decoded = jwt.verify(token, config.SECRET_KEY);
        res.status(200).json({message: 'Authenticated', email: decoded.email});
    } catch (error) {
        res.status(401).json({message: 'No token found'});
    }
});

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({message: 'Internal server error', error: error.message});
});


app.listen(config.PORT, () => {
    console.log(\`${NEW_SITE} running on port \${config.PORT}\`);
});
EOF

# Create config.js
cat <<EOF >"$DIR_NAME/config.js"
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    SECRET_KEY: process.env.SECRET_KEY,
};
EOF

# Create Dockerfile
cat <<EOF >"$DIR_NAME/Dockerfile"
FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD ["node", "server.js"]
EOF

# Create public/index.html
cat <<EOF >"$DIR_NAME/public/index.html"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Landing Page</title>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f4;
        }

        h1 {
            margin-bottom: 20px;
        }

        button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            background-color: #007BFF;
            color: #fff;
            cursor: pointer;
        }

        button:hover {
            background-color: #0056b3;
        }

        #message {
            margin-top: 20px;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
        }

        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
<h1>Welcome to <span id="site-name"></span></h1>

<button id="check-auth">Check Authentication</button>

<div id="message"></div>

<script src="script.js"></script>
</body>
</html>
EOF

# Create public/script.js
cat <<EOF >"$DIR_NAME/public/script.js"
document.getElementById('site-name').textContent = window.location.hostname;

document.getElementById('check-auth').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/checkAuth', {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(\`Authenticated as: \${data.email}\`, 'success');
        } else {
            showMessage(data.message || 'No token found', 'error');
        }
    } catch (error) {
        showMessage('Error checking auth status: ' + error.message, 'error');
    }
});

function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = type;
    messageElement.style.display = 'block';
}
EOF

# Update nginx.conf
NGINX_CONF="nginx/nginx.conf"

# Add new site to the first server_name directive (HTTP redirect)
sed -i "0,/server_name/s/server_name \(.*\);/server_name \1 $NEW_SITE;/" $NGINX_CONF

# Define the new server block
NEW_SERVER_BLOCK="
    server {
        listen 443 ssl;
        server_name $NEW_SITE;

        ssl_certificate /etc/nginx/ssl_certs/$NEW_SITE.crt;
        ssl_certificate_key /etc/nginx/ssl_certs/$NEW_SITE.key;

        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        location / {
            proxy_pass http://${DIR_NAME}:80;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }"

# Find the last server block and append the new server block after it
# Find the line before the last closing brace and insert the new block after it
last_server_line=$(grep -n '}' $NGINX_CONF | tail -1 | cut -d: -f1)
insert_line=$((last_server_line - 1))
sed -i "${insert_line}r /dev/stdin" $NGINX_CONF <<EOF
$NEW_SERVER_BLOCK
EOF

# Regenerate SSL certificates
./scripts/generate_ssl_certs.sh

# Update list of sites
echo "$NEW_SITE" >>app_cast_io/public/sites.txt

echo "New site $NEW_SITE has been added successfully!"
echo "Don't forget to run 'make generate-docker-compose' to update the docker-compose.yml file."
echo "Please review the changes in $NGINX_CONF to ensure everything is correct."
