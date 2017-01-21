/**
 * Created by jaran on 7/19/2016.
 */
var async = require("async");

// load the things we need
var mongoose = require('mongoose');

// define the schema for our class model
var categorySchema = mongoose.Schema({
    name : String,
    clases: Array
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Category', categorySchema);
