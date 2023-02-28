const User = require("../models/userModel")
const ObjectConverter = require("../utils/objectConverter")

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

exports.findAll = async (req, res) => {
    let users = await fetchAll(res)
    res.status(200).send(ObjectConverter.userResponse(users))
}

