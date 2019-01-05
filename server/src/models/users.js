/* jshint indent: 2 */
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

function hashPassword(user, options) {
    const SALT_FACTOR = 8;
    if(!user.changed('user_password')){
        return;
    }
    return bcrypt
        .genSaltAsync(SALT_FACTOR)
        .then(salt => bcrypt.hashAsync(user.user_password, salt, null))
        .then(hash => {
            user.setDataValue('user_password', hash)
        })
}

module.exports = function(sequelize, DataTypes) {

    const users = sequelize.define('users', {
            firstname: {
                type: DataTypes.STRING(250),
                allowNull: true
            },
            lastname: {
                type: DataTypes.STRING(250),
                allowNull: true
            },
            username: {
                type: DataTypes.STRING(250),
                allowNull: true
            },
            password: {
                type: DataTypes.STRING(250),
                allowNull: true
            },
            status_id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                defaultValue: '3',
                references: {
                    model: 'status_types',
                    key: 'id'
                }
            },
            email: {
                type: DataTypes.STRING(250),
                allowNull: true
            }
        },
        {
            hooks: {
                beforeCreate: hashPassword,
                beforeUpdate: hashPassword,
                beforeSave: hashPassword,
            }
        },
        {
            tableName: 'users'
        });

    return users
};
