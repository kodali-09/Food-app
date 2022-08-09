const exp = require("express");
const categoryOperationApp = exp.Router();
categoryOperationApp.use(exp.json());
// const dbo = require("../db");
// dbo.initDb();
const { ObjectId } = require("mongodb");

categoryOperationApp.post('/add', (req, res) => {
    // var categoryCollectionObj = dbo.getDb().categoryCollectionObj;
    var categoryCollectionObj = req.app.locals.categorycollection;
    req.body._id.id = new ObjectId();
    categoryCollectionObj.insertOne(req.body, (err, success) => {
        if (err) {
            console.log('error');
        } else {
            res.send({ message: "sucessfully added" });
        }
    })
});

categoryOperationApp.get('/get', (req, res) => {
    // var categoryCollectionObj = dbo.getDb().categoryCollectionObj;
    var categoryCollectionObj = req.app.locals.categorycollection;
    categoryCollectionObj.find({
        endedOn: null
    }).toArray(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(404).end();
        }
        return res.status(200).send(data);
    });
});


categoryOperationApp.get('/getCategoryByUsername/:id', (req, res) => {
    // var categoryCollectionObj = dbo.getDb().categoryCollectionObj;
    var categoryCollectionObj = req.app.locals.categorycollection;
    let userid = req.params.id;
    categoryCollectionObj.find(
        {
            createdById: userid
        }).sort({ "createdOn": -1 }).toArray(function (err, data) {
            if (err) {
                console.log(err);
                return res.status(404).end();
            }
            return res.status(200).send(data);
        });

});

categoryOperationApp.delete('/remove/:id', (req, res) => {
    // var categoryCollectionObj = dbo.getDb().categoryCollectionObj;
    var categoryCollectionObj = req.app.locals.categorycollection;
    let id = req.params.id;
    const { ObjectId } = require("mongodb");
    categoryCollectionObj.deleteOne({ _id: ObjectId(id) }, (err, success) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        } else {
            return res.status(200).send({ message: "successfully deleted" });
        }
    })
});

categoryOperationApp.put('/removeSelectedCategories', (req, res) => {
    // var categoryCollectionObj = dbo.getDb().categoryCollectionObj;
    var categoryCollectionObj = req.app.locals.categorycollection;
    let idArray = [];
    const { ObjectId } = require("mongodb");
    for (let i = 0; i < req.body.length; i++)
        idArray[i] = ObjectId(req.body[i].id);
    var filter = { '_id.id': { $in: idArray } };
    categoryCollectionObj.deleteMany(filter, (err, success) => {
        if (err) {
            console.log(err);
            return res.status(404).end();
        } else {
            return res.status(200).send({ message: "successfully deleted" });
        }

    })
});

module.exports = categoryOperationApp;
