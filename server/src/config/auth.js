const jwt = require('jsonwebtoken');
const ONE_WEEK = 60 * 60 * 24 * 7;
const {
    users
} = require('../models');
const {sendLog} = require('./logging');

//jwt config
const jwtSecret = require('./config').authentication.jwtSecret;

module.exports = {
    isAuthenticated: function (req, res, next) {
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
            var decoded = jwt.verify(token, jwtSecret).user;
            users.findOne({
                    where: {
                        id: decoded.id
                    }
                }).then(user => {
                    //If user is not active
                    if(user.status_id !== 2){
                        return res.send({
                            error: true,
                            color: 'error',
                            message: 'User is not active'
                        });
                    }else{
                        next();
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
                        message: 'Error, Please try again'
                    })
            }
        }
    },
    decodeToken(req, res, next) {
        let token = req.body.token;
        try {
            var decoded = jwt.verify(token, jwtSecret);
            return decoded;
        } catch (err) {
            // err
            sendLog('error', err)
            return res.send({
                error: true,
                type: 'error',
                message: err
            })
        }
    },
    signUser(user) {
        return jwt.sign({
            user: user
        }, jwtSecret, {
            expiresIn: ONE_WEEK
        })
    }
}