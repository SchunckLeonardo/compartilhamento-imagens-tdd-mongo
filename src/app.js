let express = require('express')
let app = express()
let mongoose = require('mongoose')
let userSchema = require('./models/User')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let secret = "anfiaunfuawnfiuawnfioawnfiawnfiawni"

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/guiapics").then(() => {

}).catch(err => {
    console.log(err)
})

let UserModel = mongoose.model("users", userSchema)

app.get('/', (req, res) => {
    res.json({})
})

app.post('/user', async (req, res) => {
    let { name, email, password } = req.body

    try {
        let hashPassword = await bcrypt.hash(password, 10)

        let newUser = new UserModel({
            name,
            email,
            password: hashPassword
        })

        if (name == "" || email == "" || password == "") {
            res.sendStatus(400)
            return
        }
        let user = await UserModel.findOne({ email })
        if (user != undefined) {
            res.statusCode = 400
            res.json({ error: "E-mail já cadastrado" })
            return
        }
        await newUser.save()
        res.json({ email })
    } catch (err) {
        res.sendStatus(500)
    }
})

app.delete('/user/:email', async (req, res) => {
    await UserModel.deleteOne({ email: req.params.email })
    res.sendStatus(200)
})

app.post('/auth', async (req, res) => {
    let { email, password } = req.body
    try {

        let user = await UserModel.findOne({ email })
        if (user != undefined) {
            let passTruth = await bcrypt.compare(password, user.password)
            if (passTruth) {
                jwt.sign({ email, password }, secret, { expiresIn: '48h' }, (err, token) => {
                    if (err) {
                        res.statusCode = 400
                        console.log(err)
                    } else {
                        res.statusCode = 200
                        res.json({ token })
                    }
                })
            } else {
                res.statusCode = 400
                res.json({ errors: {password: "Senha incorreta"} })
            }
        } else {
            res.statusCode = 403
            res.json({ errors: {email: "E-mail não cadastrado"} })
        }

    } catch (err) {
        console.log(err)
    }
})

module.exports = app