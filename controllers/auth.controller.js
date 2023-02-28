const User = require('../models/userModel')  
const { userTypes, userStatus } = require('../utils/constants')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../configs/auth.config')
const constants = require('../utils/constants')

exports.signup = async (req, res) => {

    let userStatus = req.body.userStatus

        if (req.userType == userTypes.engineer || req.userType == userTypes.admin) {
            userStatus = constants.userStatus.pending
        } else {
            userStatus = constants.userStatus.approved
    }
    
    const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType: req.body.userType,
        password: bcrypt.hashSync(req.body.password, 8),
        userStatus: userStatus
    } 
 
    try {
        const userCreated = await User.create(userObj)
        const postResponse = {
            name: userCreated.name,
            userId: userCreated.userId,
            email: userCreated.email,
            userType: userCreated.userType,
            userStatus: userCreated.userStatus,
            createdAt: userCreated.createdAt,
            updatedAt: userCreated.updatedAt,
        }
        res.status(201).send(postResponse)
    
    } catch (err) {
        console.log('Something went wrong while saving to DB', err.message)
        res.status(500).send({
            message: 'Some internal error while inserting the element'
        })
     }
}

exports.signin = async (req, res) => {
    const user = await User.findOne({ userId: req.body.userId })
    console.log("Signin Reques for ", user)

    if (!user) {
        res.status(400).send({
            message: "Failed! Userid doesn't exist!"
        })
        return
    }

    if (user.userStatus != constants.userStatus.approved) {
        res.status(403).send({
            message: `Can't allow login as user is in status : [${user.userStatus}]`
        })
        return
    }

    let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
    )

    if (!passwordIsValid) {
        res.status(401).send({
            message: "Invalid Password!"
        })
        return
    }

    let token = jwt.sign({ id: user.userId }, config.secret, {
        expiresIn: 86400 // 24 hours
    })

    res.status(200).send({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userTypes: user.userType,
        userStatus: user.userStatus,
        accessToken: token
    })
}