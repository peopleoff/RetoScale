const {
    items
} = require('../models');

module.exports = {
    async addItem(req, res) {
        try {
            await items.create(req.body);
            res.status(200).send({
                error: false,
                type: 'success',
                message: "Item Added"
            })
        } catch (err) {
            res.status(400).send({
                error: false,
                type: 'error',
                message: err
            })
        }
    },
    async updateItem(req, res) {
        if(req.body.tier == 'None'){
            req.body.tier = null
        }
        try {
            await items.update({
                name: req.body.name,
                image: req.body.image,
                description: req.body.description,
                tier: req.body.tier,
                scale: req.body.scale,
                notes: req.body.notes,
            }, {
                where: {
                    id: req.body.id
                }
            })
            res.status(200).send({
                error: false,
                type: 'success',
                message: "Item Updated"
            })
        } catch (err) {
            res.status(400).send({
                type: 'error',
                message: err
            })
        }
    },
    async getItems(req, res) {
        try {
            const allitems = await items.findAll();
            res.send(allitems);
        } catch (err) {
            res.status(400).send({
                error: false,
                type: 'error',
                message: err
            })
        }
    },
    async getLastUpdated(req, res) {
        try {
            items.findOne({
                order: [['updatedAt', 'DESC']],
                attributes: ['updatedAt',]
            }).then(timeStamp => {
                // project will be the first entry of the Projects table with the title 'aProject' || null
                // project.title will contain the name of the project
                res.send(timeStamp);
            })
        } catch (err) {
            res.status(201).send({
                error: true,
                type: 'error',
                message: err
            })
        }
    },
    deleteItem(req, res) {
        try {
            items.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function (result) {
                res.status(200).send({
                    error: false,
                    type: 'success',
                    message: "Item Deleted"
                })
            });
        } catch (err) {
            res.status(201).send({
                error: true,
                type: 'error',
                message: err
            })
        }
    }
};