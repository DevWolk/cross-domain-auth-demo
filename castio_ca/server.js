const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');

const app = express();

app.use(cookieParser());
app.use(express.static('public'));

app.get('/api/checkAuth', (req, res) => {
    const {'app-cookie': appCookie, validation} = req.query;

    if (!appCookie || !validation) {
        return res.redirect('https://app.cast.io/login?auth-redirect=1');
    }

    try {
        jwt.verify(validation, config.SECRET_KEY);

        res.cookie('jwt', appCookie, {
            httpOnly: config.COOKIE_HTTP_ONLY === 'true',
            secure: config.NODE_ENV === 'production',
            sameSite: config.COOKIE_SAME_SITE,
            domain: config.COOKIE_DOMAIN,
            maxAge: config.COOKIE_MAX_AGE
        });
        res.redirect('/?auth=success');
    } catch (error) {
        res.status(401).json({message: 'Invalid token: ' + error.message});
    }
});

app.get('/api/checkUserAuth', (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({message: 'No token found'});
    }
    try {
        const decoded = jwt.verify(token, config.SECRET_KEY);
        res.status(200).json({message: 'Authenticated', email: decoded.email});
    } catch (error) {
        res.status(401).json({message: 'Invalid token: ' + error.message});
    }
});

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({message: 'Internal server error', error: error.message});
});

app.listen(config.PORT, () => {
    console.log(`castio.ca running on port ${config.PORT}`);
});