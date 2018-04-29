var express = require('express');
var Currency = require('../models/cryptocurreny');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var apptools = require('../apptools');

module.exports = function (app) {
    var ApiRoutes = express.Router();

    app.use('/api', ApiRoutes);


    ApiRoutes.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, apptools.superSecret, function (err, decoded) {
                if (err) {
                    return res.status(401).send({success: false, message: 'Failed to authenticate token.'});
                } else {
                    req.decoded = decoded;
                    User.findOne({_id: decoded._id}).then(function (user) {
                        // Do something with the user
                        if (user) {
                            req.current_user = user;
                            next();
                        } else {
                            return res.status(403).send({success: false, message: 'Unexpected Error.'});
                        }

                    });
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

    ApiRoutes.post('/AddCurrency', function (req, res) {
        var currenyCode = req.body.currenyCode;

        if (currenyCode) {
            var new_currency = new Currency({
                userId: req.current_user._id,
                currenyCode: currenyCode,
                euroPrice: 0
            });

            Currency.findOne({currenyCode: currenyCode, userId: req.current_user._id}).then(function (rule) {
                if (rule) {
                    res.status(200).json({
                        success: false,
                        error_message: 'You have already added "' + currenyCode + '" on the list before.'
                    });
                } else {
                    apptools.getCurrencyEuroValue(currenyCode, function (euroValue) {
                        if (euroValue) {
                            new_currency.euroPrice = euroValue;
                        }
                        new_currency.save(function (err) {
                            if (err) {
                                res.status(200).json({
                                    success: false,
                                    error_message: 'There was an error please try again.'
                                });
                            } else {
                                res.status(200).json({success: true});
                            }
                        });
                    });


                }

            });

        } else {
            res.status(200);
            res.json({success: false, message: 'Missing Paramaters'});
        }
    });

    ApiRoutes.post('/GetCurrencyList', function (req, res) {
        Currency.find({userId: req.current_user._id}, function (err, currencyList) {
            if (err) {
                res.status(200).json({
                    success: false,
                    error_message: 'There was an error please try again.'
                });
            } else {
                res.status(200).json({success: true, data: currencyList});
            }
        });
    });

    ApiRoutes.post('/DeleteCurrency', function (req, res) {
        var currenyId = req.body.currenyId;

        if (currenyId) {
            Currency.remove({_id: currenyId}, function (err) {
                if (!err) {
                    res.status(200).json({success: true});
                } else {
                    res.status(200).json({
                        success: false,
                        error_message: 'There was an error please try again.'
                    });
                }
            });
        } else {
            res.status(200);
            res.json({success: false, message: 'Missing Paramaters'});
        }
    });

};

