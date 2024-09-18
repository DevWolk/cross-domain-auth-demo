const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const config = require('./config');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use(cors({
    origin: config.CORS_ORIGINS,
    credentials: true
}));

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    if (email === config.ADMIN_EMAIL && password === config.ADMIN_PASSWORD) {
        const token = jwt.sign({email}, config.SECRET_KEY, {expiresIn: '1h'});

        res.cookie('jwt', token, {
            httpOnly: config.COOKIE_HTTP_ONLY,
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

        res.status(200).json({message: 'Login successful', email: email});
    } else {
        res.status(401).json({message: 'Invalid credentials'});
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: config.COOKIE_HTTP_ONLY,
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
        return res.status(401).json({message: 'Not authenticated'});
    }
    try {
        const decoded = jwt.verify(token, config.SECRET_KEY);
        res.status(200).json({message: 'Authenticated', email: decoded.email});
    } catch (err) {
        res.clearCookie('jwt');
        res.status(401).json({message: 'Invalid token'});
    }
});

app.get('/api/auth-check-iframe', (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.json({ isAuthenticated: false, message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    res.json({ isAuthenticated: true, message: 'Authenticated', email: decoded.email });
  } catch (err) {
    res.json({ isAuthenticated: false, message: 'Invalid token' });
  }
});

app.listen(config.PORT, () => {
    console.log(`app.cast.io running on port ${config.PORT}`);
});
