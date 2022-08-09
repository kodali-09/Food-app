const exp = require("express");
const articleOperationApp = exp.Router();
articleOperationApp.use(exp.json())
//import dbo from db.js
// const dbo = require("../db");
// dbo.initDb();
var jwt = require("jsonwebtoken");
var articleId;
articleOperationApp.post('/add', (req, res) => {
    // articleOperationApp.post('/article-operation/add',(req,res)=>{
    // var articleCollectionObj = dbo.getDb().articleCollectionObj;
    var articleCollectionObj = req.app.locals.articlecollection;
    articleCollectionObj.insertOne(req.body, (err, success) => {
        if (err) {
            console.log('error');
        } else {
            res.send({ message: "sucessfully added" });
        }
    })
});

articleOperationApp.get('/get', (req, res) => {
    // var articleCollectionObj = dbo.getDb().articleCollectionObj;
    var articleCollectionObj = req.app.locals.articlecollection;
    // articleCollectionObj.find({
    //     endedOn: null
    // }).sort({ "createdOn": -1 }).toArray(function (err, data) {
    //     if (err) {
    //         console.log(err);
    //         return res.status(404).end();
    //     }
    //     return res.status(200).send(data);
    // });
    articleCollectionObj.aggregate(
        [
            {
                '$match': {
                    'endedOn': null
                }
            }, {
                '$addFields': {
                    'articleId': {
                        '$toString': '$_id'
                    }
                }
            }, {
                '$lookup': {
                    'from': 'likearticlescollection',
                    'localField': 'articleId',
                    'foreignField': 'articleid',
                    'as': 'articleLikeCountArray'
                }
            }, {
                '$addFields': {
                    'articleLikeCount': {
                        '$size': '$articleLikeCountArray'
                    }
                }
            }
        ]
    ).sort({ "createdOn": -1 }).toArray(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(404).end();
        }
        return res.status(200).send(data);
    });
});

articleOperationApp.get('/getArticleByUsername/:id', (req, res) => {
    // var articleCollectionObj = dbo.getDb().articleCollectionObj;
    var articleCollectionObj = req.app.locals.articlecollection;
    let userid = req.params.id;
    articleCollectionObj.aggregate(
        [
            {
                '$match': {
                    'createdById': userid
                }
            }, {
                '$addFields': {
                    'articleId': {
                        '$toString': '$_id'
                    }
                }
            }, {
                '$lookup': {
                    'from': 'likearticlescollection',
                    'localField': 'articleId',
                    'foreignField': 'articleid',
                    'as': 'articleLikeCountArray'
                }
            }, {
                '$addFields': {
                    'articleLikeCount': {
                        '$size': '$articleLikeCountArray'
                    }
                }
            }
        ]
    ).sort({ "createdOn": -1 }).toArray(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(404).end();
        }
        return res.status(200).send(data);
    });
    // articleCollectionObj.find(
    //     {
    //         createdById: userid
    //     }).sort({ "createdOn": -1 }).toArray(function (err, data) {
    //         if (err) {
    //             console.log(err);
    //             return res.status(404).end();
    //         }
    //         return res.status(200).send(data);
    //     });

});

articleOperationApp.get('/noOfArticles/:id', (req, res) => {
    // var articleCollectionObj = dbo.getDb().articleCollectionObj;
    var articleCollectionObj = req.app.locals.articlecollection;
    let userid = req.params.id;
    articleCollectionObj.countDocuments({ createdById: userid }, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        } else {
            return res.status(200).send({ count: data });
        }
    })
})

articleOperationApp.delete('/remove/:id', (req, res) => {
    // var articleCollectionObj = dbo.getDb().articleCollectionObj;
    var articleCollectionObj = req.app.locals.articlecollection;
    let id = req.params.id;
    const { ObjectId } = require("mongodb");
    articleCollectionObj.deleteOne({ _id: ObjectId(id) }, (err, success) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        } else {
            return res.status(200).send({ message: "successfully deleted" });
        }
    })
});

articleOperationApp.put('/removeSelectedArticles', (req, res) => {
    // var articleCollectionObj = dbo.getDb().articleCollectionObj;
    var articleCollectionObj = req.app.locals.articlecollection;
    let idArray = [];
    const { ObjectId } = require("mongodb");
    for (let i = 0; i < req.body.length; i++)
        idArray[i] = ObjectId(req.body[i]);
    var filter = { _id: { $in: idArray } };
    articleCollectionObj.deleteMany(filter, (err, success) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        } else {
            return res.status(200).send({ message: "successfully deleted" });
        }

    })
});

articleOperationApp.post('/likeArticle', (req, res) => {
    var likeArticlesCollectionObj = req.app.locals.likearticlescollection;
    // var likeArticlesCollectionObj = dbo.getDb().likeArticlesCollectionObj;
    const query = { articleid: req.body.articleid, userid: req.body.userid };
    const update = {
        "$set": {
            articleid: req.body.articleid,
            userid: req.body.userid,
            createdBy: req.body.createdBy
        }
    }
    likeArticlesCollectionObj.updateOne(query, update, { upsert: true }, (err, success) => {
        if (err) {
            console.log(err);
            res.status(404).end();
        } else {
            res.status(200).send({ message: "updated like" });
        }
    });
})

articleOperationApp.post('/dislikeArticle', (req, res) => {
    // var likeArticlesCollectionObj = dbo.getDb().likeArticlesCollectionObj;
    var likeArticlesCollectionObj = req.app.locals.likearticlescollection;
    const query = { articleid: req.body.articleid, userid: req.body.userid };
    likeArticlesCollectionObj.deleteOne(query, (err, success) => {
        if (err) {
            console.log(err);
            res.status(404).end();
        } else {
            res.status(200).send({ message: "deleted like" });
        }
    });
});

articleOperationApp.get('/noOfLikesToArticle/:articleid', (req, res) => {
    // var likeArticlesCollectionObj = dbo.getDb().likeArticlesCollectionObj;
    var likeArticlesCollectionObj = req.app.locals.likearticlescollection;
    likeArticlesCollectionObj.countDocuments({ articleid: req.params.articleid }, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        } else {
            return res.status(200).send({ count: data });
        }
    });
});

articleOperationApp.get('/totalLikesToUserForArticle/:userid', (req, res) => {
    // var likeArticlesCollectionObj = dbo.getDb().likeArticlesCollectionObj;
    var likeArticlesCollectionObj = req.app.locals.likearticlescollection;
    likeArticlesCollectionObj.countDocuments({ createdBy: req.params.userid }, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        } else {
            return res.status(200).send({ count: data });
        }
    });
});

articleOperationApp.post('/userLikedArticle', (req, res) => {
    // var likeArticlesCollectionObj = dbo.getDb().likeArticlesCollectionObj;
    var likeArticlesCollectionObj = req.app.locals.likearticlescollection;
    const query = { articleid: req.body.articleid, userid: req.body.userid };
    likeArticlesCollectionObj.findOne(query, (err, success) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        } else {
            return res.status(200).send({ message: "user already liked the article" });
        }
    })
})
module.exports = articleOperationApp;
