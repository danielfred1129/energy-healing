/**
 * Created by jaran on 7/19/2016.
 */

// load the things we need
var mongoose = require('mongoose');

// define the schema for our class model
var faqSchema = mongoose.Schema({
    title : String,
    answer: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Faq', faqSchema);
