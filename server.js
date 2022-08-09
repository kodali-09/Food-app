//install and import express
const exp = require("express");

const bodyParser = require('body-parser');

//import mongodb driver
var mc = require("mongodb").MongoClient;

require("dotenv").config();

//import adminApp and userApp
//get express obj
const app = exp();

//import path module
const path = require("path");

//connect server.js with angular app of dist folder
app.use(exp.static(path.join(__dirname, './dist/food-app')));
app.use(exp.json({ limit: '50mb' }));
app.use(exp.urlencoded({ extended: true, limit: '50mb' }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const adminApp = require("./apis/adminapi")
const userApp = require("./apis/userapi")
const articleOperationApp = require("./apis/articleoperationapi");
const categoryOperationApp = require("./apis/categoryoperationapi");
const fileUploadApp = require("./apis/fileuploadapi");
const recipeOperationApp = require("./apis/recipeoperationapi")
const recentActionsApp = require("./apis/recentactionsapi")

//forwarding req object to apis

app.use("/admin", adminApp);
app.use("/user", userApp);
app.use("/article", articleOperationApp);
app.use("/category", categoryOperationApp);
app.use("/uploadfile", fileUploadApp);
app.use('/recipe', recipeOperationApp);
app.use('/recent-actions', recentActionsApp);

// app.use((req, res, next) => {
//     res.send({ message: `${req.url} and ${req.method} is invalid` });
// });
const url='https://apetite-crush.herokuapp.com';
app.get('*',(req, res, next) => {
    res.redirect(url+req.url);
  res.connection.setTimeout(0);
//     res.send({ message: `${req.url} and ${req.method} is invalid` });
});



// app.get(*, (req, res) => {
//     var fullUrl = req.protocol + '://' + req.get('host') + req.url;
//     console.log(fullUrl);
//   res.redirect(fullUrl);
// }));



//to hold db object
var dbo;
//database url
var dbUrl=process.env.dbUrl;
// console.log(process.env.dbUrl);

mc.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.log("error in connecting in db");
    } else {
    console.log("connected to database");
    dbo = client.db("userdb");
    app.locals.usercollection = dbo.collection("usercollection");
    app.locals.articlecollection = dbo.collection("articlecollection");
    app.locals.categorycollection = dbo.collection("categorycollection");
    app.locals.recipecollection = dbo.collection("recipecollection");
    app.locals.recent_actions_collections = dbo.collection("recent_actions_collections")
    app.locals.likearticlescollection = dbo.collection("likearticlescollection");
    app.locals.likerecipescollection = dbo.collection("likerecipescollection");

    //assign port no
    const port = process.env.PORT;
    app.listen(port||8080, () => { console.log(`server running on port ${port}`) })
    }
})

