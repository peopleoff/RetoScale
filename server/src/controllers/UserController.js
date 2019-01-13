const {
    users
} = require('../models');
const {
    status_types
} = require('../models');
const bcrypt = require('bcryptjs');
const salt = '$2a$10$Q/AH0MPPKyMVNzshASojgO';
const jwt = require('jsonwebtoken');
const registerKey = "RetroFunTimes"
const ONE_WEEK = 60 * 60 * 24 * 7;
const ONE_SECOND = 60;
const {sendLog} = require('../config/logging');

const {
    errorHandler
} = require('../common/common');

//jwt config
const jwtSecret = require('../config/config').authentication.jwtSecret;
const {
    signUser,
    decodeToken
} = require('../config/auth');

users.belongsTo(status_types, {
    foreignKey: 'status_id'
});

module.exports = {
    register(req, res) {
        if (!req.body) {
            return res.send({
                error: true,
                message: "Error",
                type: "error"
            })
        }
        if (req.body.password !== req.body.confirmPassword) {
            return res.send({
                error: true,
                message: "Passwords do not match",
                type: "error"
            })
        }
        if (req.body.registerKey !== registerKey) {
            return res.send({
                error: true,
                message: "Invalid Register Key",
                type: "error"
            })
        }
        users.findOne({
                where: {
                    username: req.body.username
                }
            }).then(project => {
                if (project) {
                    return res.send({
                        error: true,
                        message: "User already exsists",
                        type: "error"
                    })
                } else {
                    req.body.password = bcrypt.hashSync(req.body.password, salt);
                    req.body.status = 3;
                    users.create(req.body).then(response => {
                        return res.send({
                            error: false,
                            message: "Thank you for registering, Please wait for your account to be approved.",
                            type: "success"
                        })
                    });
                }
            })
            .catch(err => {
                sendLog('error', err)
                return res.send({
                    error: true,
                    type: 'error',
                    message: err
                })
            });
    },
    signIn(req, res) {
        if (req.body.token) {
            try {
                decoded = jwt.verify(req.body.token, jwtSecret).user;
                return res.send({
                    token: req.body.token,
                    username: decoded.username
                })
            } catch (err) {
                sendLog('error', err)
                return res.send({
                    error: true,
                    type: 'error',
                    message: err
                })
            }
        }
        if (!req.body) {
            return res.send({
                error: true,
                message: "Please fill in all fields",
                type: "error"
            })
        }
        users.findOne({
                where: {
                    username: req.body.username
                }
            })
            .then(user => {
                if (!user) {
                    return res.send({
                        error: true,
                        message: "Username or Password is incorrect",
                        type: "error"
                    })
                } else {
                    if (bcrypt.compareSync(req.body.password, user.password) && user.status_id == 2) {
                        delete user.password
                        let token = signUser(user);
                        res.send({
                            token: token,
                            username: user.username
                        });
                    } else {
                        return res.send({
                            error: true,
                            message: 'Username or Password incorrect',
                            type: "error"
                        });
                    }
                }
            });
    },
    async updateUserStatus(req, res) {
        let user = req.body.user;
        try {
            await users.update({
                status_id: user.status_id
            }, {
                where: {
                    id: user.id
                }
            })
            res.status(200).send({
                type: 'success',
                message: "User Updated"
            })
        } catch (err) {
            sendLog('error', err)
            return res.send({
                error: true,
                type: 'error',
                message: err
            })
        }
    },
    async updateUser(req, res) {
        let user = req.body.user;
        if (user.password) {
            if (user.password !== user.confirmPassword) {
                return res.send({
                    error: true,
                    message: "Passwords do not match",
                    type: "error"
                })
            } else {
                user.password = bcrypt.hashSync(user.password, salt);
            }
        }
        try {
            await users.update({
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                password: user.password
            }, {
                where: {
                    id: user.id
                },
            }).then(result => {
                //Result returns number of affected rows.
                //0 means no rows were effected and the update failed.
                if(result == 0){
                    return res.send({
                        error: true,
                        type: 'error',
                        message: 'Error editing user'
                    })
                }else{
                   return res.send({
                        error: false,
                        type: 'success',
                        message: 'User Updated'
                    })
                }
            })
        } catch (err) {
            sendLog('error', err)
            return res.send({
                error: true,
                type: 'error',
                message: err
            })
        }
    },
    async getUsers(req, res) {
        try {
            const allitems = await users.findAll({
                attributes: ['id', 'firstname', 'lastname', 'username', 'status_id'],
                include: [status_types]
            });
            res.send(allitems);
        } catch (err) {
            sendLog('error', err)
            return res.send({
                error: true,
                type: 'error',
                message: err
            })
        }
    },
    async getUser(req, res) {
        let decoded = decodeToken(req);
        try {
            users.findOne({
                where: {
                    id: decoded.user.id
                },
                attributes: ['id', 'firstname', 'lastname', 'username', 'email']
            }).then(user => {
                // project will be the first entry of the Projects table with the title 'aProject' || null
                // project.title will contain the name of the project
                res.send(user);
            })
        } catch (err) {
            sendLog('error', err)
            return res.send({
                error: true,
                type: 'error',
                message: err
            })
        }
    },
    async isAuth(req, res) {
        let token = req.body.token;
        //ICheck for null/undefined token in the request
        if (!req.body.token) {
            return res.send({
                error: true,
                color: 'error',
                message: "Token must be provided"
            })
        }
        try {
            //Valid token, call next
            var decoded = jwt.verify(token, jwtSecret);
            return res.send({
                error: false
            })
        } catch (err) {
            //If error send back error message
            switch (err.name) {
                case 'TokenExpiredError':
                    return res.send({
                        error: true,
                        color: 'error',
                        message: 'Your Login has expired.'
                    });
                    break;
                case 'JsonWebTokenError':
                    return res.send({
                        error: true,
                        color: 'error',
                        message: 'Invalid Token'
                    });
                    break;
                default:
                    res.send({
                        error: true,
                        color: 'error',
                        message: err
                    })
            }
        }
    },
}