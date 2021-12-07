let jwt = require('jsonwebtoken')
const config = require('./config')
let checkToken = (req, res, next) => {
    let token = req.headers["authorization"]
    if(token){
        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length)
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if(err){
                return res.json({
                    success: false,
                    message: "Invalid token."
                })
            }
            else{
                req.decoded = decoded
                next()
            }
        })
    }
    else{
        return res.json({
            success: false,
            message: "Authentication token is required."
        })
    }
}
module.exports = {
    checkToken: checkToken
}