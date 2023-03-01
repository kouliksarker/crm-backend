const { request } = require("express")
const User = require("../models/userModel")
const ObjectConverter = require("../utils/objectConverter")

//All the fetch functions of findAll
const fetchAll = async (res) => {
    let users
    try {
        users = await User.find()
    } catch (err) {
        console.err('error while fetching the users')
        res.status(500).send({
            message : "Some internal error occured"
        })
    }
    return users
}

const fetchByName = async (userNameReq, res) => {
    let users
    try {
        users = await User.find({
            name: userNameReq
        });
    } catch (err) {
        console.err("error while fetching the user for userName : ", userNameReq);
        res.status(500).send({
            message: "Some internal error occured"
        })
    }
    return users
}

const fetchByTypeAndStatus = async (userTypeReq, userStatusReq, res) => {
    let users
    try {
        users = await User.find({
            userType: userTypeReq,
            userStatus: userStatusReq
        });
    } catch (err) {
        console.err(`error while fetching the user for userType [${userTypeReq}] and userStatus [${userStatusReq}]`);
        res.status(500).send({
            message: "Some internal error occured"
        })
    }
    return users
}

const fetchByType = async (userTypeReq, res) => {
    let users
    try {
        users = await User.find({
            userType: userTypeReq
        });
    } catch (err) {
        console.err(`error while fetching the user for userType [${userTypeReq}] `);
        res.status(500).send({
            message: "Some internal error occured"
        })
    }
    return users
}

const fetchByStatus = async (userStatusReq, res) => {
    let users
    try {
        users = await User.find({
            userStatus: userStatusReq
        });
    } catch (err) {
        console.err(`error while fetching the user for userStatus [${userStatusReq}] `);
        res.status(500).send({
            message: "Some internal error occured"
        })
    }
    return users
}

//Admin methods

exports.findAll = async (req, res) => {
    let users
    let userTypeReq = req.query.userType
    let userStatusReq = req.query.userStatus
    let userNameReq = req.query.name
    if (userNameReq) {
        users = await fetchByName(userNameReq, res)
    } else if (userTypeReq && userStatusReq) {
        users = await fetchByTypeAndStatus(userTypeReq, userStatusReq, res)
    } else if (userTypeReq) {
        users = await fetchByType(userTypeReq, res)
    } else if (userStatusReq) {
        users = await fetchByStatus(userStatusReq, res)
    } else {
        users = await fetchAll(res)
    }
    res.status(200).send(ObjectConverter.userResponse(users))
/**
 *  flow of the request
 *  1.User token verified as provided in User.routes
 *  2.Found out that user is admin in the middleware
 *  3.Request arrived at the user controller findAll
**/

}

exports.findById = async (req, res) => {

    const userIdReq = req.params.userId
    let user
    try {
        user = await User.find({
            userId: userIdReq
        })
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
    if (user.length > 0) {
        res.status(200).send(ObjectConverter.userResponse(user))
    } else {
        res.status(200).send({
            message: `User with this id [${userIdReq}] is not present`
        })
    }
}

exports.update = async (req, res) => {

    const userIdReq = req.params.userId
    try {
        const user = await User.findOneAndUpdate({
            userId: userIdReq
        }, {
            userStatus: req.body.userStatus
        }).exec()
        if (user) {
            res.status(200).send({
                message: `User record has been updated successfully`
            })
        } else {
            res.status(200).send({
                message: `No user with id found!`
            })
        }
    } catch (err) {
        console.err("Error while updating the record", err.message)
        res.status(500).send({
            message: "Some internal error occured"
        })
    }
}

