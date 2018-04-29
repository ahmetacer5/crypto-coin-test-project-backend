var request = require('request');
var Currency = require('./models/cryptocurreny');


var self = module.exports = {
    getCurrencyEuroValue: function (currencyCode, callback) {
        var url = 'https://min-api.cryptocompare.com/data/price?fsym=' + currencyCode + '&tsyms=EUR';

        request({
            url: url,
            json: true
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                if (body && body.EUR) {
                    callback(body.EUR);
                } else {
                    callback(null);
                }
            } else {
                callback(null);
            }
        })
    },

    updateCurrencyEuroValue: function (currencyId, euroValue) {
        Currency.findOneAndUpdate({
            _id: currencyId
        }, {$set: {euroPrice: euroValue}}, {new: true}, function (err, doc) {
        });
    }

};