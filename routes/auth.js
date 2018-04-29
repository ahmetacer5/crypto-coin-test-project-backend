var express = require('express');
var dateTime = require('node-datetime');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var apptools = require('../apptools');

module.exports = function (app) {
    var AuthRoutes = express.Router();

    app.use('/auth', AuthRoutes);


    var generateTokenForAuth = function (req, res, user_data) {

        var dt = dateTime.create();
        var logintime = dt.format('Y-m-d H:M:S');


        const payload = {
            logintime: logintime,
            _id: user_data._id,
        };

        var token = jwt.sign(payload, apptools.superSecret, {
            expiresIn: 60 * 60 // expires in 24 hours

        });

        res.json(
            {
                success: true,
                token: token,
                name: user_data.name.concat(' ').concat(user_data.surname)
            }
        );

        return token;

    };

    AuthRoutes.post('/authenticate', function (req, res) {

        User.findOne({
            username: req.body.username
        }, function (err, user) {

            if (err) throw err;

            if (!user) {
                res.status(200);
                res.json({success: false, message: 'Authentication failed. User not found.'});
            } else if (user) {
                if (user.password != req.body.password) {
                    res.status(200);
                    res.json({success: false, message: 'Authentication failed. Wrong password.'});
                } else {
                    console.log(req.connection.remoteAddress);
                    generateTokenForAuth(req, res, user, null);
                }

            }

        });
    });

};