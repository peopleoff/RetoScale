const Joi = require('joi');

module.exports = {
    addItem(req, res, next) {
        const schema = {
            name: Joi.string().required(),
            image: Joi.string().allow(null).allow(''),
            description: Joi.string().allow(null).allow(''),
            tier: Joi.string().allow(null).allow(''),
            type: Joi.string().allow(null).allow(''),
            scale: Joi.number().less(11),
            notes: Joi.string().allow(null).allow(''),
        };

        const {error, value} = Joi.validate(req.body, schema);

        if (error) {
            console.log(error);
            switch (error.details[0].context.key) {
                case 'name':
                    res.status(201).send({
                        error: true,
                        type: 'error',
                        message: 'Name is required'
                    });
                    break;
                case 'scale':
                    res.status(201).send({
                        error: true,
                        type: 'error',
                        message: `Scale must be a number`
                    });
                    break;
                case 'notes':
                    res.status(201).send({
                        error: true,
                        type: 'error',
                        message: `Notes must be a string`
                    });
                    break;
                default:
                    res.status(201).send({
                        error: true,
                        type: 'error',
                        message: error.data.details
                    })
            }
        } else {
            next()
        }
    },
    updateItem(req, res, next) {
        const schema = {
            id: Joi.number(),
            name: Joi.string().required(),
            image: Joi.string().allow(null).allow(''),
            description: Joi.string().allow(null).allow(''),
            tier: Joi.string().allow(null).allow(''),
            type: Joi.string().allow(null).allow(''),
            scale: Joi.number().less(16),
            notes: Joi.string().allow(null).allow(''),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
        };

        const {error, value} = Joi.validate(req.body, schema);

        if (error) {
            console.log(error);
            switch (error.details[0].context.key) {
                case 'name':
                    res.status(201).send({
                        error: true,
                        type: 'error',
                        message: "Item Updated"
                    });
                    break;
                case 'scale':
                    res.status(201).send({
                        error: true,
                        type: 'error',
                        message: `Scale must be a number between 0 - 15`
                    });
                    break;
                default:
                    res.status(201).send({
                        error: true,
                        type: 'error',
                        message: error.data.details
                    })
            }
        } else {
            next()
        }
    }
};