var express = require('express')
const bodyParser = require('body-parser')
let jwt = require('jsonwebtoken')
let config = require('./config')
let middleware = require('./middleware')
let app = require('./index.js')
class HandlerGenerator{
    login(req, res){
        let username = req.body.username
        let password = req.body.password
        let testUsername = "admin"
        let testPassword = "password"
        if(username && password){
            if(username === testUsername && password === testPassword){
                let token = jwt.sign({
                    username: username
                },
                config.secret,
                {
                    expiresIn: "10h"
                })
                res.json({
                    success: true,
                    message: "Authentication successful!",
                    token: token
                })
            }
            else{
                res.json({
                    success: false,
                    message: "Incorrect username or password."
                })
            }
        }
        else{
            res.json({
                success: false,
                message: "Authentication failed! Username and password are required."
            })
        }
    }
    testFunction(req, res){
        res.json({
            success: true,
            message: "Testing successful!"
        })
    }
}
function main(){
    let app = express()
    let handlers = new HandlerGenerator()
    const port = 2000
    app.use(bodyParser.urlencoded({extended : true}))
    app.use(bodyParser.json())
    app.post('/login', handlers.login)
    app.get('/', middleware.checkToken, handlers.testFunction)
    app.listen(port, () => {
        console.log("Server is listening on port: " + port)
    })
}
main()