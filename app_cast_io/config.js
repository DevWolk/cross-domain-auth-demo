require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    SECRET_KEY: process.env.SECRET_KEY,
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
    COOKIE_HTTP_ONLY: process.env.COOKIE_HTTP_ONLY,
    COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE,
    TEST_COOKIE_DOMAIN: process.env.TEST_COOKIE_DOMAIN,
    TEST_COOKIE_HTTP_ONLY: process.env.TEST_COOKIE_HTTP_ONLY,
    TEST_COOKIE_SAME_SITE: process.env.TEST_COOKIE_SAME_SITE,
    NODE_ENV: process.env.NODE_ENV,
    CORS_ORIGINS: process.env.CORS_ORIGINS.split(','),
    COOKIE_MAX_AGE: parseInt(process.env.COOKIE_MAX_AGE),
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};
