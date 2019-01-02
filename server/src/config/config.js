module.exports = {
    port: 8081,
    db: {
        database: 'retoscale',
        user: 'rbelyy',
        password: 'Ruslan5440!',
        options: {
            dialect: 'mysql',
            host: 'ruslanbelyy.me',
            operatorsAliases: false,
            logging: console.log
        }
    },
    authentication: {
        jwtSecret: '*ATb<08pl|$#|1g'
    }
};
