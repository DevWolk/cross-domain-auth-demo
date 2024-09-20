const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const config = require('./config');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const corsOptions = {
    origin: function (origin, callback) {
        if (config.CORS_ORIGINS.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));
app.get('/login', (req, res) => {
    const authRedirect = req.query['auth-redirect'];
    const token = req.cookies.jwt;

    if (token) {
        try {
            jwt.verify(token, config.SECRET_KEY);
            if (authRedirect) {
                const validationParam = jwt.sign({token}, config.SECRET_KEY, {expiresIn: '5m'});
                return res.redirect(`https://castio.ca/api/checkAuth?app-cookie=${encodeURIComponent(token)}&validation=${encodeURIComponent(validationParam)}`);
            }
            return res.sendFile(__dirname + '/public/index.html');
        } catch (error) {
            console.error('Token verification error:', error);
            res.clearCookie('jwt');
        }
    }

    if (authRedirect) {
        res.cookie('auth_redirect', '1', {maxAge: 300000, httpOnly: true, secure: config.NODE_ENV === 'production'});
    }
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }

    if (email === config.ADMIN_EMAIL && password === config.ADMIN_PASSWORD) {
        const token = jwt.sign({email}, config.SECRET_KEY, {expiresIn: '1h'});

        res.cookie('jwt', token, {
            httpOnly: config.COOKIE_HTTP_ONLY === 'true',
            secure: config.NODE_ENV === 'production',
            sameSite: config.COOKIE_SAME_SITE,
            domain: config.COOKIE_DOMAIN,
            maxAge: config.COOKIE_MAX_AGE
        });

        res.cookie('jwt', token, {
            httpOnly: config.TEST_COOKIE_HTTP_ONLY,
            secure: config.NODE_ENV === 'production',
            sameSite: config.TEST_COOKIE_SAME_SITE,
            domain: config.TEST_COOKIE_DOMAIN,
            maxAge: config.COOKIE_MAX_AGE
        });

        if (req.cookies.auth_redirect) {
            res.clearCookie('auth_redirect');
            const validationParam = jwt.sign({token}, config.SECRET_KEY, {expiresIn: '5m'});
            const redirectUrl = `https://castio.ca/api/checkAuth?app-cookie=${encodeURIComponent(token)}&validation=${encodeURIComponent(validationParam)}`;
            res.status(200).json({
                message: 'Login successful',
                redirect: redirectUrl
            });
        } else {
            res.status(200).json({message: 'Login successful', email: email});
        }
    } else {
        res.status(401).json({message: 'Invalid credentials'});
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: config.COOKIE_HTTP_ONLY === 'true',
        secure: config.NODE_ENV === 'production',
        sameSite: config.COOKIE_SAME_SITE,
        domain: config.COOKIE_DOMAIN
    });

    res.clearCookie('jwt', {
        httpOnly: config.TEST_COOKIE_HTTP_ONLY,
        secure: config.NODE_ENV === 'production',
        sameSite: config.TEST_COOKIE_SAME_SITE,
        domain: config.TEST_COOKIE_DOMAIN
    });

    res.status(200).json({message: 'Logged out successfully'});
});

app.post('/api/checkAuth', (req, res) => {
    const token = req.cookies.jwt || req.body.token;
    if (!token) {
        return res.status(401).json({message: 'No token found'});
    }
    try {
        const decoded = jwt.verify(token, config.SECRET_KEY);
        res.status(200).json({message: 'Authenticated', email: decoded.email});
    } catch (error) {
        res.clearCookie('jwt');
        res.status(401).json({message: 'Invalid token: ' + error.message});
    }
});

app.get('/api/auth-check-iframe', (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.json({isAuthenticated: false, message: 'No token found'});
    }
    try {
        const decoded = jwt.verify(token, config.SECRET_KEY);
        res.json({isAuthenticated: true, message: 'Authenticated', email: decoded.email});
    } catch (error) {
        res.json({isAuthenticated: false, message: 'Invalid token: ' + error.message});
    }
});

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({message: 'Internal server error', error: error.message});
});

app.listen(config.PORT, () => {
    console.log(`app.cast.io running on port ${config.PORT}`);
});
