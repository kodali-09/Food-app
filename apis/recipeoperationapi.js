const exp = require("express");
const recipeOperationApp = exp.Router();
recipeOperationApp.use(exp.json())
//import dbo from db.js
// const dbo = require("../db");
// dbo.initDb();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt")
const cloudinary=require("cloudinary");
const cloudinaryStorage=require("multer-storage-cloudinary");
const multer=require("multer");

//configure cloudinary
cloudinary.config({
    cloud_name:process.env.cloudname,
    api_key:process.env.apikey,
    api_secret:process.env.apisecret
});

//configure cloudinary storage details

var storageForCloudinary=cloudinaryStorage({
    cloudinary:cloudinary,
    folder:'recipefiles',
    allowedFormats:['jpg','png','jpeg'],
    filename:function(req,file,cb)
    {
        //cb=callback fn
        cb(undefined,file.fieldname +'-'+Date.now());    
    }
});

//configure multer
var upload=multer({storage:storageForCloudinary});





recipeOperationApp.post('/add',upload.single('photo'),(req,res)=>{
    //console.log("recipe obj is",req.body);
    // res.send({message:"user login works"})
    req.body=JSON.parse(req.body.userObj);

    req.body.profileImage=req.file.secure_url; 

    //remove key "photo"
    delete req.body.photo;

    //console.log("req body is", req.body);
    //console.log("cdn link of uploaded image is ",req.file.secure_url);
    // var recipeCollectionObj = dbo.getDb().recipeCollectionObj;
    var recipeCollectionObj = req.app.locals.recipecollection;
    recipeCollectionObj.insertOne(req.body, (err, success) => {
        if (err) {
            console.log('error')
        }
        else {
            res.send({ message: "recipe added successfully" })
        }
    })
});

recipeOperationApp.get('/get-recipe',(req,res)=>{
    // var recipeCollectionObj=dbo.getDb().recipeCollectionObj;
    var recipeCollectionObj = req.app.locals.recipecollection;
    recipeCollectionObj.aggregate(
        [
            {
                '$match': {
                    'endedOn': null
                }
            }, {
                '$addFields': {
                    'recipeId': {
                        '$toString': '$_id'
                    }
                }
            }, {
                '$lookup': {
                    'from': 'likerecipescollection',
                    'localField': 'recipeId',
                    'foreignField': 'recipeid',
                    'as': 'recipeLikeCountArray'
                }
            }, {
                '$addFields': {
                    'recipeLikeCount': {
                        '$size': '$recipeLikeCountArray'
                    }
                }
            }
        ]
    ).sort({ "createdOn": -1 }).toArray(function(err, recipeObj) {
        if(err)
        {
            console.log("error is ", err);
        }
        else
        {
            res.send({message:"Recipe Collections",recipeObj:recipeObj});
        }
    })
});

recipeOperationApp.get('/getRecipeByUsername/:id',(req,res)=>{
    // var recipeCollectionObj=dbo.getDb().recipeCollectionObj;
    var recipeCollectionObj = req.app.locals.recipecollection;
    let userid=req.params.id;
    recipeCollectionObj.aggregate(
        [
            {
                '$match': {
                    'createdById': userid
                }
            }, {
                '$addFields': {
                    'recipeId': {
                        '$toString': '$_id'
                    }
                }
            }, {
                '$lookup': {
                    'from': 'likerecipescollection',
                    'localField': 'recipeId',
                    'foreignField': 'recipeid',
                    'as': 'recipeLikeCountArray'
                }
            }, {
                '$addFields': {
                    'recipeLikeCount': {
                        '$size': '$recipeLikeCountArray'
                    }
                }
            }
        ]
    ).sort({"createdOn":-1}).toArray(function(err,data){
            if (err) {
                console.log(err);
                return res.status(404).end();
            }
            return res.status(200).send({recipeObj:data});
        })
});
recipeOperationApp.delete('/remove/:id',(req,res)=>{
    // var recipeCollectionObj=dbo.getDb().recipeCollectionObj;
    var recipeCollectionObj = req.app.locals.recipecollection;
    let id=req.params.id;
    const {ObjectId}=require("mongodb");
    //console.log("ibj id is ",ObjectId(id));
    recipeCollectionObj.deleteOne({_id:ObjectId(id)},(err,success)=>{
        if(err){
            console.log(err);
            return res.status(404).end(); 
        } else{
            return res.status(200).send({message:"successfully deleted"});
        }
    })
})
recipeOperationApp.put('/delete-many',(req,res)=>{
    // var recipeCollectionObj=dbo.getDb().recipeCollectionObj;
    var recipeCollectionObj = req.app.locals.recipecollection;
    let a=[];
    const {ObjectId}=require("mongodb");
    for(let i=0;i<req.body.length;i++)
    a[i]=ObjectId(req.body[i]);

    var myquery = { _id: { $in: a } };
    recipeCollectionObj.deleteMany(myquery,(err,success)=>{
        if(err)
        {
            console.log(err);
            return res.status(404).end(); }
        else
        {
            return res.status(200).send({message:"successfully deleted"});
        }
    })
})


recipeOperationApp.get('/noOfRecipes/:id',(req,res)=>{
    // var recipeCollectionObj=dbo.getDb().recipeCollectionObj;
    var recipeCollectionObj = req.app.locals.recipecollection;
    let userid=req.params.id;
    recipeCollectionObj.countDocuments({createdById:userid},(err,data)=>{
        if(err) {
            console.log(err);
                return res.status(404).end();
        }
        return res.status(200).send({count:data});


    })
})

recipeOperationApp.get('/getCategories/:name',(req,res)=>{
    // var recipeCollectionObj=dbo.getDb().recipeCollectionObj;
    var recipeCollectionObj = req.app.locals.recipecollection;
    let categoryName=req.params.name;
    recipeCollectionObj.find({category:categoryName}).sort({"createdOn":-1}).toArray(function(err,data){
        if(err)
        {
            console.log(err);
            return res.status(404).end(); 
        }
        else{
            return res.status(200).send({recipeObj:data});
        }
    })
    
})

recipeOperationApp.post('/likeRecipe', (req, res) => {
    // var likeRecipesCollectionObj = dbo.getDb().likeRecipesCollectionObj;
    var likeRecipesCollectionObj = req.app.locals.likerecipescollection;
    const query = { recipeid: req.body.recipeid, userid: req.body.userid };
    const update = {
        "$set": {
            recipeid: req.body.recipeid,
            userid: req.body.userid,
            createdBy: req.body.createdBy
        }
    }
    likeRecipesCollectionObj.updateOne(query, update, { upsert: true }, (err, success) => {
        if (err) {
            console.log(err);
            res.status(404).end();
        } else {
            res.status(200).send({ message: "updated like" });
        }
    });
});

recipeOperationApp.post('/dislikeRecipe', (req, res) => {
    // var likeRecipesCollectionObj = dbo.getDb().likeRecipesCollectionObj;
    var likeRecipesCollectionObj = req.app.locals.likerecipescollection;
    const query = { recipeid: req.body.recipeid, userid: req.body.userid };
    likeRecipesCollectionObj.deleteOne(query, (err, success) => {
        if (err) {
            console.log(err);
            res.status(404).end();
        } else {
            res.status(200).send({ message: "deleted like" });
        }
    });
});

recipeOperationApp.get('/noOfLikesToRecipe/:recipeid', (req, res) => {
    // var likeRecipesCollectionObj = dbo.getDb().likeRecipesCollectionObj;
    var likeRecipesCollectionObj = req.app.locals.likerecipescollection;
    likeRecipesCollectionObj.countDocuments({ recipeid: req.params.recipeid }, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        } else {
            return res.status(200).send({ count: data });
        }
    });
});

recipeOperationApp.get('/totalLikesToUserForRecipe/:userid', (req, res) => {
    // var likeRecipesCollectionObj = dbo.getDb().likeRecipesCollectionObj;
    var likeRecipesCollectionObj = req.app.locals.likerecipescollection;
    likeRecipesCollectionObj.countDocuments({ createdBy: req.params.userid }, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        } else {
            return res.status(200).send({ count: data });
        }
    });
});

recipeOperationApp.post('/userLikedRecipe', (req, res) => {
    // var likeRecipesCollectionObj = dbo.getDb().likeRecipesCollectionObj;
    var likeRecipesCollectionObj = req.app.locals.likerecipescollection;
    const query = { recipeid: req.body.recipeid, userid: req.body.userid };
    likeRecipesCollectionObj.findOne(query, (err, success) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        } else {
            return res.status(200).send({ message: "user already liked the recipe" });
        }
    })
})

module.exports = recipeOperationApp;
