const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function (req, res) {
    const {email, password} = req.body
    const candidate = await User.findOne({email})

    if (candidate) {
        const passwordResult = bcrypt.compareSync(password, candidate.password)
        if (passwordResult) {
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60})

            res.status(200).json({
                token: `bearer ${token}`
            })
        } else {
            res.status(401).json({
                message: 'Пароли не совпадают. Попробуйте снова.'
            })
        }
    } else {
        res.status(404).json({
            message: 'Пользователь с таким email не найден.'
        })
    }
}

module.exports.register = async function (req, res) {
    const {email, password} = req.body
    const candidate = await User.findOne({email})

    if (candidate) {
        res.status(409).json({
            message: 'Такой email уже занят. Попробуйте другой.'
        })
    } else {
        const salt = bcrypt.genSaltSync(10)
        const user = User({
            email,
            password: bcrypt.hashSync(password,salt)
        })
        try {
            await user.save()
            res.status(201).json(user)
        } catch (e) {
            errorHandler(res, e)
        }

    }

}