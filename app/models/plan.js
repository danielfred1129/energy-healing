/**
 * Created by jaran on 7/19/2016.
 */

// load the things we need
var mongoose = require('mongoose');

// define the schema for our class model
var planSchema = mongoose.Schema({
    title: String,
    recommends: Array
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Plan', planSchema);
