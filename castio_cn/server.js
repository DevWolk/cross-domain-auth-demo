const express = require('express');
const cookieParser = require('cookie-parser');
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
        const response = await axios.post('http://app.cast.io/api/checkAuth',
            {token},
            {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(401).json({
            message: 'No token found',
            error: error.response ? error.response.data : error.message
        });
    }
});

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({message: 'Internal server error', error: error.message});
});

app.listen(config.PORT, () => {
    console.log(`castio.cn running on port ${config.PORT}`);
});
