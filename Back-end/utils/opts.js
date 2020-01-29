var opts = {
    GENERAL: {
        PRODUCTS_PER_PAGE: 6
    },

    ACCESS_TOKEN: {
        SECRET_KEY: 'secret',
        LIFETIME: 600 // in seconds
    },

    REFRESH_TOKEN: {
        SIZE: 80
    },

    DB: {
        HOST: '127.0.0.1',
        PORT: '3306',
        USER: 'root',
        PWD: '123456',
        DB_NAME: 'qlnganhang'
    },

    OTP_PROPERTIES: {
        SECRET_KEY: '12345678@XKVK',
        LIFETIME : 300
    },

    MAIL: {
        HOST: 'smtp.gmail.com',
        PORT: '465',
        USER: 'luattestmail@gmail.com',
        PWD: '12345678@X'
    }
}

module.exports = opts;