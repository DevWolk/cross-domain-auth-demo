const express = require('express');
const path = require('path');
const config = require('./config');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(config.PORT, () => {
    console.log(`castio_cn running on port ${config.PORT}`);
});