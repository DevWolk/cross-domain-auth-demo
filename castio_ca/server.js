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
    } catch (err) {
        console.error('Token validation error:', err);
        res.status(401).json({message: 'Invalid token'});
    }
});

app.get('/api/checkUserAuth', (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({message: 'Not authenticated'});
    }
    try {
        const decoded = jwt.verify(token, config.SECRET_KEY);
        res.status(200).json({message: 'Authenticated', email: decoded.email});
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({message: 'Invalid token'});
    }
});

app.listen(config.PORT, () => {
    console.log(`castio_ca running on port ${config.PORT}`);
});