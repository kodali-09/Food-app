const exp = require("express");
const recentActionsApp = exp.Router();
recentActionsApp.use(exp.json())
//import dbo from db.js
// const dbo = require("../db");
// dbo.initDb();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt")
recentActionsApp.post('/add-action',(req,res)=>{
   // console.log("recent action obj is",req.body);
    // var recent_actions_collectionObj = dbo.getDb().recent_actions_collectionObj;
    var recent_actions_collectionObj =req.app.locals.recent_actions_collections;
    recent_actions_collectionObj.insertOne(req.body, (err, success) => {
        if (err) {
            console.log('error',err)
        }
        else {
            res.send({ message: "recent action added successfully" })
        }
    })
});

recentActionsApp.get('/get-action',(req,res)=>{
    // var recentActionsObj=dbo.getDb().recent_actions_collectionObj
    var recent_actions_collectionObj =req.app.locals.recent_actions_collections;
    recent_actions_collectionObj.find({}).sort({"createdOn":-1}).toArray(function(err, recentObj) {
        if(err)
        {
            console.log("error is ", err);
        }
        else
        {
            res.send({message:"Recent Actions",recentObj:recentObj});
        }
    })
});



module.exports = recentActionsApp;
