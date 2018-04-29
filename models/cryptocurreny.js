var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('cryptocurreny', new Schema({
    userId: String,
    currenyCode: String,
    euroPrice: Number
}));