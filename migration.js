var mongoose = require('mongoose');
var User = require('./models/user');
var CryptoJS = require("crypto-js");
var apptools = require('./apptools');

mongoose.Promise = require('bluebird');
mongoose.connect(apptools.connectionString); // connect to database

function encryptPw(value) {
    var key = CryptoJS.enc.Base64.parse('37KvDCAC11CCXLOKSX4CvjYOh9Y');
    var iv = CryptoJS.enc.Base64.parse('#base64IV#');
    var encryptedpw = CryptoJS.AES.encrypt(value, key, {iv: iv});
    return encryptedpw.toString();
}

var user_data = {
    name: 'Ahmet',
    surname: 'Acer',
    username: 'ahmetacer',
    password: encryptPw('123456'),
    createTime: new Date()
};

User.update({username: user_data.username}, user_data, {upsert: true, setDefaultsOnInsert: true}, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('User Saved');
    }
    process.exit();
});