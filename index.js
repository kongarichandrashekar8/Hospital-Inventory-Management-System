var express = require('express')
var app = express()
const bodyparser = require('body-parser')
var MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
const dbName = "InventoryManagement"
let db
let server = require('./server')
let middleware = require('./middleware')
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client)=>{
    if(err) return console.log(err)
    db = client.db(dbName)
    console.log("Connected to database: " + dbName)
})
app.get('/hospitaldetails', middleware.checkToken, function(req, res){
    var result = db.collection('hospital').find().toArray()
    .then(result=>{
        console.log("Getting the hospital details")
        res.json(result)
    })
})
app.get('/ventilatordetails', middleware.checkToken, function(req, res){
    var result = db.collection('ventilator').find().toArray()
    .then(result=>{
        console.log("Getting the ventilator details")
        res.json(result)
    })
})
app.post('/searchventilatorsbystatus', middleware.checkToken, function(req, res){
    if(req.body.status == undefined){
        res.json("Enter ventilator status.")
    }
    else{
        var result = db.collection('ventilator').find({"status": req.body.status}).toArray()
        .then(result=>{
            if(result.length != 0){
                console.log("Searching ventilators by status: " + req.body.status)
                res.json(result)
            }
            else{
                res.json("Ventilators not found.")
            }
        })
    }
})
app.post('/searchventilatorsbyname', middleware.checkToken, function(req, res){
    if(req.body.name == undefined){
        res.json("Enter hospital name.")
    }
    else{
        var result = db.collection('ventilator').find({"name": new RegExp(req.body.name, 'i')}).toArray()
        .then(result=>{
            if(result.length != 0){
                console.log("Searching ventilators by name: " + req.body.name)
                res.json(result)
            }
            else{
                res.json("Hospital not found.")
            }
        })
    }
})
app.post('/searchhospitalsbyname', middleware.checkToken, function(req, res){
    if(req.body.name == undefined){
        res.json("Enter hospital name.")
    }
    else{
        var result = db.collection('hospital').find({"name": new RegExp(req.body.name, 'i')}).toArray()
        .then(result=>{
            if(result.length != 0){
                console.log("Searching hospitals by name: " + req.body.name)
                res.json(result)
            }
            else{
                res.json("Hospital not found.")
            }
        })
    }
})
app.put('/updateventilatordetails', middleware.checkToken, function(req, res){
    if(req.body.ventilatorid == undefined || req.body.status == undefined){
        res.json("Enter ventilator id, and status")
    }
    else{
        var result = db.collection('ventilator').updateOne({"ventilatorId": req.body.ventilatorid},{$set:{"status": req.body.status}})
        .then(result=>{
            if(result.matchedCount == 1 && result.modifiedCount == 1){
                console.log(`Status of ventilator with ventilator ID: ${req.body.ventilatorid} updated to ${req.body.status}`)
                res.json("Ventilator updated.")
            }
            else if(result.matchedCount == 1 && result.modifiedCount == 0){
                console.log(`Status of ventilator with ventilator ID: ${req.body.ventilatorid} is already updated`)
                res.json("Already updated.")
            }
            else{
                res.json("Ventilator not found.")
            }
        })
    }
})
app.post('/addventilator', middleware.checkToken, function(req, res){
    if(req.body.ventilatorid == undefined || req.body.hid == undefined || req.body.name == undefined || req.body.status == undefined){
        res.json("Enter valid data.")
    }
    else{
        db.collection('ventilator').insertOne({"hId": req.body.hid, "ventilatorId": req.body.ventilatorid, "status": req.body.status, "name": req.body.name})
        console.log(`Adding ventilator with ID: ${req.body.ventilatorid}, hospital ID: ${req.body.hid}, name: ${req.body.name} and status: ${req.body.status}`)
        res.json("Data saved.")
    }
})
app.delete('/deleteventilator', middleware.checkToken, function(req, res){
    if(req.body.ventilatorid == undefined){
        res.json("Enter ventilator id.")
    }
    else{
        var result = db.collection('ventilator').deleteOne({"ventilatorId": req.body.ventilatorid})
        .then(result=>{
            if(result.deletedCount == 1){
                console.log("Deleting ventilator with ID: " + req.body.ventilatorid)
                res.json("Ventilator deleted.")
            }
            else{
                res.json("Ventilator not found.")
            }
        })
    }
})
app.listen(1000, () => {
    console.log("Listening on port: 1000")
})