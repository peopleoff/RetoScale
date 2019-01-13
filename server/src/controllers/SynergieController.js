const {
    synergies
} = require('../models');
const {
    items
} = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

items.hasMany(synergies, {
    foreignKey: 'id'
});
synergies.belongsTo(items, {
    foreignKey: 'item_one_id'
});

module.exports = {

    async getSynergies(req, res) {
        try {
            await synergies.findAll({
                include: [items]
            })
            .then(results => {
                res.send(results);
            });
        } catch (err) {
            sendLog('error', err)
            return res.send({
                error: true,
                type: 'error',
                message: err
            })
        }
    },

    async addSyn(req, res) {
        let synergiesArray = req.body;
        synergiesArray.splice(0, 1);
        for (let i = 0; i < synergiesArray.length; i++) {
            const element = synergiesArray[i];
            let item_one_id = 1144;
            let item_two_id = 1144;
            await items.findOne({
                where: {
                    name: {
                        [Op.like]: `%${element.items[0]}%`
                    }
                }
            }).then(project => {
                if (project) {
                    item_one_id = project.id
                }
            })
            await items.findOne({
                where: {
                    name: {
                        [Op.like]: `%${element.items[1]}%`
                    }
                }
            }).then(project => {
                if (project) {
                    item_two_id = project.id
                }
            })
            let synergie = {
                name: element.name,
                item_one_id: item_one_id,
                item_two_id: item_two_id,
                description: element.effect
            }
            synergies.create(synergie)
                .then(console.log('created'));
        }
        try {
            res.sendStatus(200);
        } catch (err) {
            sendLog('error', err)
            return res.send({
                error: true,
                type: 'error',
                message: err
            })
        }
    },

}