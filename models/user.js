var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('user', new Schema({
    name: String,
    surname: String,
    username: String,
    password: String,
    createTime: Date
}));