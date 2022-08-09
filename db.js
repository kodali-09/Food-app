 //import mongodb driver
var mc=require("mongodb").MongoClient;
//to hold db object
var dbo;
var userCollectionObj;
var adminCollectionObj;
var articleCollectionObj;
var categoryCollectionObj;
var recipeCollectionObj;
var recent_actions_collectionObj;
var likeArticlesCollectionObj;
var likeRecipesCollectionObj;
//database url
var dbUrl="mongodb+srv://project:project@cluster0-donss.mongodb.net/test?retryWrites=true&w=majority";
//var dbUrl="mongodb+srv://keerthi:keerthi@cluster0-i25dr.mongodb.net/test?retryWrites=true&w=majority";
//function to initialise database
function initDb() {
    mc.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{
        if(err) {
            console.log("error in connecting in db");
        }
        console.log("connected to database");
        dbo=client.db("userdb");
        userCollectionObj = dbo.collection("usercollection");
        adminCollectionObj = dbo.collection("admincollection");
        articleCollectionObj = dbo.collection("articlecollection");
        categoryCollectionObj = dbo.collection("categorycollection");
        recipeCollectionObj=dbo.collection("recipecollection");
        recent_actions_collectionObj=dbo.collection("recent_actions_collections")
        likeArticlesCollectionObj=dbo.collection("likearticlescollection");
        likeRecipesCollectionObj=dbo.collection("likerecipescollection");
    })
}
//function to return db object
function getDb() {
   // console.log(dbo,"db has not been initialised.please call init");
    return {
        userCollectionObj:userCollectionObj,
        adminCollectionObj:adminCollectionObj,
        articleCollectionObj:articleCollectionObj,
        categoryCollectionObj:categoryCollectionObj,
        recipeCollectionObj:recipeCollectionObj,
        recent_actions_collectionObj:recent_actions_collectionObj,
        likeArticlesCollectionObj:likeArticlesCollectionObj,
        likeRecipesCollectionObj:likeRecipesCollectionObj
    }
}
//export 2 functions
module.exports={
    getDb,
    initDb
}