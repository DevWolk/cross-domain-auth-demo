const express = require('express');
const path = require('path');
const config = require('./config');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({message: 'Internal server error', error: error.message});
});

app.listen(config.PORT, () => {
    console.log(`castio.uk running on port ${config.PORT}`);
});