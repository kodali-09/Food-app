//create mini express appn and handle admin req
const exp = require("express");
const userApp = exp.Router();
userApp.use(exp.json())
//import dbo from db.js
// const dbo = require("../db");
// dbo.initDb();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt")
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

//configure cloudinary
cloudinary.config({
    cloud_name:process.env.cloudname,
    api_key:process.env.apikey,
    api_secret:process.env.apisecret
});

//configure cloudinary storage details

var storageForCloudinary = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'recipefiles',
    allowedFormats: ['jpg', 'png', 'jpeg'],
    filename: function (req, file, cb) {
        //cb=callback fn
        cb(undefined, file.fieldname + '-' + Date.now());
    }
});

//configure multer
var upload = multer({ storage: storageForCloudinary });

userApp.get('/readprofile/:id', (req, res) => {
    var userCollectionObj=req.app.locals.usercollection;
    // var userCollectionObj = dbo.getDb().userCollectionObj;
    var userid = req.params.id;
    const { ObjectId } = require("mongodb");
    userCollectionObj.findOne({ _id: ObjectId(userid) }, (err, userObj) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        }
        return res.status(200).send(userObj);
    })
});

userApp.post('/login', (req, res) => {
    // console.log("user obj is",req.body);
    // res.send({message:"user login works"})

    //verify username
    // var userCollectionObj = dbo.getDb().userCollectionObj;
    var userCollectionObj=req.app.locals.usercollection;
    userCollectionObj.findOne({ username: req.body.username }, (err, userObj) => {
        if (err) {
            console.log("err in read", err);
        }
        else if (userObj == null) {
            res.send({ message: "invalid username" });
        }
        else {
            bcrypt.compare(req.body.password, userObj.password, (err, result) => {
                if (err) {
                    console.log("err in compare", err);
                }
                else if (result == false) {
                    res.send({ message: "invalid password" });
                }
                else {
                    //create a token and send it to client
                    jwt.sign({ username: userObj.username }, 'ssshhh', { expiresIn: 60 }, (err, signedToken) => {
                        if (err) {
                            console.log("err", err);
                        }
                        else {
                            res.send({
                                message: "success",
                                token: signedToken,
                                username: userObj.username,
                                userid: userObj._id,
                                role: userObj.role
                            });
                        }
                    })
                }
            })
        }
    })
});
userApp.post('/register', upload.single('photo'), (req, res) => {
    // console.log(req.body);
    //res.send({message:"user register works"})
    //check for user
    req.body = JSON.parse(req.body.userObj);
    if (req.file != undefined) {
        req.body.imageUrl = req.file.secure_url;
    }
    delete req.body.photo;
    // var userCollectionObj = dbo.getDb().userCollectionObj;
    var userCollectionObj=req.app.locals.usercollection;
    userCollectionObj.findOne({ username: req.body.username }, (err, userObjFromDb) => {
        if (err) {
            console.log("err in register", err)
        }
        else if (userObjFromDb != null) {
            res.send({ message: 'username already existed' })
        }
        else {
            var hashedPassword = bcrypt.hashSync(req.body.password, 7)
            req.body.password = hashedPassword
            delete req.body['passwordCnfrm'];
            userCollectionObj.insertOne(req.body, (err, success) => {
                if (err) {
                    console.log('error')
                }
                else {
                    res.send({ message: "register successful" })
                }
            })
        }
    })
});



userApp.put('/updateprofile/:id', upload.single('photo'), (req, res) => {
    req.body = JSON.parse(req.body.userObj);
    if (req.file != undefined) {
        req.body.imageUrl = req.file.secure_url;
    }
    delete req.body.photo;
    // var userCollectionObj = dbo.getDb().userCollectionObj;
    var userCollectionObj=req.app.locals.usercollection;
    const { ObjectId } = require("mongodb");
    const query = { _id: ObjectId(req.params.id) };
    if (req.body.isHashed == false) {
        var hashedPassword = bcrypt.hashSync(req.body.password, 7)
        req.body.password = hashedPassword;
    }
    const update = {
        "$set": {
            "username": req.body.username,
            "password": req.body.password,
            "email": req.body.email,
            "imageUrl": req.body.imageUrl,
            "createdOn": req.body.createdOn
        }
    };
    userCollectionObj.findOneAndUpdate(query, update, (err, success) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        }
        return res.status(200).send({ message: "updated profile successfully" });
    });
});

userApp.get('/search/:username', (req, res) => {
    // var userCollectionObj = dbo.getDb().userCollectionObj;
    var userCollectionObj=req.app.locals.usercollection;
    userCollectionObj.findOne({ username: req.params.username }, (err, success) => {
        if (err) {
            return res.status(404).end();
        } if (success) {
            return res.status(200).send({ message: "username already exists" });
        } else {
            return res.status(200).send({ message: "valid username" });
        }
    });
});
//export userApp
module.exports = userApp;
