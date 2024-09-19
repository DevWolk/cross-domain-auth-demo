require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    SECRET_KEY: process.env.SECRET_KEY,
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
    COOKIE_HTTP_ONLY: process.env.COOKIE_HTTP_ONLY,
    COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE,
    NODE_ENV: process.env.NODE_ENV,
    COOKIE_MAX_AGE: parseInt(process.env.COOKIE_MAX_AGE),
};
