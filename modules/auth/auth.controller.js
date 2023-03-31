const bcrypt = require('bcryptjs')
const knex = require('../../config/knex')
const jwt = require('jsonwebtoken')
const User = require('../../models/user.model')

async function login(req, res) {

    const email = req.body.email
    const password = req.body.password

    let user = await User.findOne({email: email})

    if(!user) {
        res.send({
            error: true,
            message: "Invalid email or password"
        })
        return
    }

    let matched = await bcrypt.compare(password, user.password);

    if(!matched) {
        res.send({
            error: true,
            message: "Invalid email or password"
        })
        return
    }

    // Generate JWT
    const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        "secret"
    );


    res.send({
        error: false,
        message: "Login successfull",
        data: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: userJwt
        }
    })

}

async function signup(req, res) {

    const email = req.body.email
    const password = req.body.password
    const firstName = req.body.firstName
    const lastName = req.body.lastName

    let user = await User.findOne({email: email})

    if(user) {
        res.send({
            error: true,
            message: "Email already exists"
        })
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = {
        firstName,
        lastName,
        email,
        password: hashedPassword
    }

    const savedUser = await User.create(newUser)

    const userJwt = jwt.sign(
        {
          id: savedUser.id,
          email: savedUser.email,
        },
        "secret"
    );

    res.send({
        error: false,
        message: "Account created successfully",
        data: {
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
            token: userJwt
        }
    })
}

module.exports = {
    login,
    signup
}