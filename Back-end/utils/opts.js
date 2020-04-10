var opts = {
    GENERAL: {
        PRODUCTS_PER_PAGE: 6
    },

    API:{
        HEADER_PARTNERCODE: 'partnercode',
        HEADER_CHECKSUM: 'checksum',
        HEADER_NGAY_CHUYEN_KHOAN: 'ngayck',
        MINUTES: 3
    },

    ACCESS_TOKEN: {
        SECRET_KEY: 'secret',
        LIFETIME: 1000, // in seconds
        HEADER: 'x-access-token'
    },

    REFRESH_TOKEN: {
        SIZE: 80
    },

    CAPTCHA : {
        SECRET_KEY : '6Lca6tgUAAAAALu-FiNSIz34De4EA59U-jlB5Flc'
    },

    DB: {
        HOST: '127.0.0.1',
        PORT: '3306',
        USER: 'root',
        PWD: '',
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
    },

    STATUS_PASSWORD: {
        SUCCESS: 0,
        NEW_PWD_IS_LIKE_OLD_PWD: 1,
        WRONG_PWD: -1,
        FAILED: -2
    },

    SIGNATURE: {
        SECRET_KEY: 'Stay strong',
        PASSPHRASE: '123456',
        RSA: "RSA",
        PGP: "PGP",
    },

    STATUS:{
        CHUA_THANH_TOAN: 0,
        DA_THANH_TOAN: 1
    }
}

module.exports = opts; 