//create mini express appn and handle admin req
const exp = require("express");
const adminApp = exp.Router();
adminApp.use(exp.json());
//import dbo from db.js
// const dbo = require("../db");
// dbo.initDb();
var bcrypt = require("bcrypt");
//localhost:port/admin/login (POST)
//localhost:port/admin/readprofile/username (GET)

//adminApp.get('/readprofile/:username',(req,res)=>{
//  res.send({message:"admin profile works"})
//});

// adminApp.post('/login',(req,res)=>{
//     res.send({message:"admin login works"})
// });
adminApp.post('/addAdmin', (req, res) => {
  // var userCollectionObj = dbo.getDb().userCollectionObj;
  var userCollectionObj=req.app.locals.usercollection;
  userCollectionObj.findOne({ username: req.body.username }, (err, dataObjFromDb) => {
    if (err) {
      console.log("err in register", err);
    } else if (dataObjFromDb != null) {
      res.send({ message: 'username already existed' });
    } else {
      var hashedPassword = bcrypt.hashSync(req.body.password, 7);
      req.body.password = hashedPassword;
      userCollectionObj.insertOne(req.body, (err, success) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ message: "registered successfully" });
        }
      })
    }
  })

})


//export adminApp
module.exports = adminApp;
