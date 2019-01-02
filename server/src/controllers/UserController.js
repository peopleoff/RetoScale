const {
    users
} = require('../models');
const {
    status_types
} = require('../models');
const bcrypt = require('bcryptjs');
const salt = '$2a$10$Q/AH0MPPKyMVNzshASojgO';
const registerKey = "RetroFunTimes"

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
        .catch(err =>{
            console.log(err);
        });
    },
    signIn(req, res) {
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
        }).then(project => {
            if (!project) {
                return res.send({
                    error: true,
                    message: "Username or Password is incorrect",
                    type: "error"
                })
            } else {
                if (bcrypt.compareSync(req.body.password, project.password) && project.status_id == 2) {
                    project.password = null;
                    return res.status(200).send(project);
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
        try {
            await users.update({
                status_id: req.body.status_id
            }, {
                where: {
                    id: req.body.id
                }
            })
            res.status(200).send({
                type: 'success',
                message: "User Updated"
            })
        } catch (err) {
            res.status(201).send({
                type: 'error',
                message: 'Error editing user'
            })
        }
    },
    async updateUser(req, res) {
        if (req.body.password) {
            if (req.body.password !== req.body.confirmPassword) {
                return res.send({
                    error: true,
                    message: "Passwords do not match",
                    type: "error"
                })
            }else{
                req.body.password = bcrypt.hashSync(req.body.password, salt);
            }
        }
        try {
            await users.update({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }, {
                where: {
                    id: req.body.id
                }
            })
            res.status(200).send({
                type: 'success',
                message: "User Updated"
            })
        } catch (err) {
            res.status(201).send({
                type: 'error',
                message: 'Error editing user'
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
            res.status(201).send({
                type: 'error',
                message: err
            })
        }
    },
    async getUser(req, res) {
        try {
            users.findOne({
                where: {
                    id: req.body.id
                },
                attributes: ['id', 'firstname', 'lastname', 'username', 'email']
            }).then(user => {
                // project will be the first entry of the Projects table with the title 'aProject' || null
                // project.title will contain the name of the project
                res.send(user);
            })
        } catch (err) {
            res.status(201).send({
                type: 'error',
                message: err
            })
        }
    },
}