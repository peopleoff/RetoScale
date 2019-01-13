require('dotenv').config()

module.exports = {
    port: 8081,
    db: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        options: {
            dialect: 'mysql',
            host: process.env.DB_HOST,
            operatorsAliases: false
        }
    },
    authentication: {
        jwtSecret: '*ATb<08pl|$#|1g'
    }
};
