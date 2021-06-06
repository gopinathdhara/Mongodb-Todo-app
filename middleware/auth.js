const jwt = require('jsonwebtoken')
const myUser = require('../models/myuser')
const secretkey="My Node Js Secret Key"
const auth = async (req, res, next) => {
    try {
            const token = req.header('Authorization');
            if(!token)
            {
                throw new Error("Please provide Authorization token.")
            }
            var decoded = jwt.verify(token, secretkey);
            if (!decoded) {
                throw new Error("Token expires.Please login again.")
            }
            const user=await myUser.myUserModel.findOne({ _id: decoded._id, 'tokens.token': token })
            if (!user) {
                throw new Error("Token is invalid.")
            }
            req.token = token
            req.user = user
            next()
    } catch (e) {
        //console.log("kkkkkkkkkkk"+e)
        res.send({ status:2, message: e.message})
    }
}

module.exports = auth