const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getByCategoryId = async function (req, res) {
    try {
        const {categoryId} = req.params
        const position = await Position.find({
            category: categoryId,
            user: req.user.id
        })
        res.status(200).json(position)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        const {name, cost, category} = req.body
        const position = await new Position({
            name,
            cost,
            category,
            user: req.user.id
        }).save()
        res.status(201).json(position)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.remove = async function (req, res) {
    try {
        await Position.remove({_id: req.params.id})
        res.status(200).json({
            message: 'Позиция была удалена'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    try {
        const position = await Position.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
            )
        res.status(200).json(position)
    } catch (e) {
        errorHandler(res, e)
    }
}