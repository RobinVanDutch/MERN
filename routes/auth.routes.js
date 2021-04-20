const {Router} = require('express')
const bc = require('bcryptjs')
const config = require('config')
const jsonwebtoken = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User') 
const router = Router()


// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символом').isLength({min: 6})

    ],
     async (req,res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Неккоректные данные при регистрации'
            })
        }
        const {email, password} = req.body

        const candit = await User.findOne({ email })
        if (candit){
           return res.status(400).json({message: 'Такой пользователь ужу есть'})
        }

        const hashedPassword = await bc.hash(password, 12)
        
        const user = new User({email, password: hashedPassword})

        await user.save()
        res.status(201).json({
            message: 'Пользователь создан'
        })
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте снова'
        })
    }

})

// /api/auth/login
router.post('/login', 
[
    check('email', 'ВВедите корректный email').normalizeEmail().isEmail(),
    check('password', 'Неправильно введеный пароль').exists()

],
async (reg,res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Неккоректные данные при входе'
            })
        }
  
        const {email, password} = req.body

        const user = await User.findOne({email})

        if(!user) {
            return res.status(400).json({message: 'Пользователь не найден'})

        }

        const isMatch = await bc.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})

        }

        const token = jsonwebtoken.sign(
            { userId: user.id },
            config.get('jwtsecret'),
            {expiresIn: '1h'}

        )

        res.json({token, userId: user.id})

    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте снова'
        })
    }

})

module.exports = router