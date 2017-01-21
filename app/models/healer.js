/**
 * Created by jaran on 7/19/2016.
 */

// load the things we need
var mongoose = require('mongoose');

// define the schema for our class model
var healerSchema = mongoose.Schema({
    name : String,
    photo : String,
    title : String,
    address1 : String,
    address2 : String,
    memo : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Healer', healerSchema);
