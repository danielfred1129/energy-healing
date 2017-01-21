/**
 * Created by jaran on 7/19/2016.
 */
var async = require("async");
var Category = require("./category");
var Plan = require("./plan");

// load the things we need
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our class model
var clasSchema = mongoose.Schema({
    title : String,
    link: String,
    owner : ObjectId,
    duration : Number,
    lessonNumber : Number,
    healingMode : String,
    description : String,
    mode : String,
    download: String
}, { collection: 'clases' });

clasSchema.methods.getOwner = function(cb) {
    return this.model('Healer').findOne({ _id: this.owner.toString() }, cb);
};

// create the model for users and expose it to our app
var clasModel = mongoose.model('Clas', clasSchema);

clasModel.getClas = function(clas, callback) {
    clas.getOwner(function(healerErr, healer) {
        if(healerErr) {
            callback(healerErr);
        }
        else {
            clas.healerName = healer.name;
            clas.healerMemo = healer.memo;
            callback(null, clas);
        }
    });
};

clasModel.getClasById = function(clasId, callback) {
    clasModel.findOne({_id: clasId}, function(clasErr, clas) {
        if (clasErr)
            callback(clasErr);
        else {
            clasModel.getClas(clas, callback);
        }
    });
};

clasModel.getClasesAll = function(callback) {
    clasModel.find({}).sort({lessonNumber:1}).exec(function(findErr, clases) {
        if(findErr) {
            callback(findErr);
        }
        else {
            // callback(null, clases);
            async.eachSeries(clases, function iteratee(clas, iterateeCallback) {
                // if (inCache(clas)) {
                //     async.setImmediate(function () {
                //         iterateeCallback(null, cache[clas]);
                //     });
                // } else {
                    clasModel.getClas(clas, iterateeCallback);
                // }
            }, function done(resultErr, result) {
                if(resultErr)
                    callback(resultErr);
                else
                    callback(null, clases);
            });
        }
    });
};

clasModel.getClasesByCategoryId = function(categoryId, callback) {
    Category.findOne({_id: categoryId.toString()}, function(categoryErr, category) {
        if(categoryErr)
            callback(categoryErr);
        else {
            async.mapSeries(category.clases, function iteratee(clasId, iterateeCallback) {
                // if (inCache(clas)) {
                //     async.setImmediate(function () {
                //         iterateeCallback(null, cache[clas]);
                //     });
                // } else {
                    clasModel.getClasById(clasId, iterateeCallback);
                // }
            }, function done(resultErr, result) {
                if(resultErr)
                    callback(resultErr);
                else
                    callback(null, result);
            });
        }
    });
};

clasModel.getClasesByPlanId = function(planId, callback) {
    Plan.findOne({_id: planId.toString()}, function(planErr, plan) {
        if(planErr)
            callback(planErr);
        else {
            async.mapSeries(plan.recommends, function iteratee(clasId, iterateeCallback) {
                // if (inCache(clas)) {
                //     async.setImmediate(function () {
                //         iterateeCallback(null, cache[clas]);
                //     });
                // } else {
                clasModel.getClasById(clasId, iterateeCallback);
                // }
            }, function done(resultErr, result) {
                if(resultErr)
                    callback(resultErr);
                else
                    callback(null, result);
            });
        }
    });
};

module.exports = clasModel;