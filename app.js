var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');
var morgan = require('morgan');
const cors = require('cors');
var Currency = require('./models/cryptocurreny');
var apptools = require('./apptools');


var app = express();

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://cryptouser:melanko5@localhost:27017/cryptodb'); // connect to database
app.set('superSecret', 'ldskASDF2fmgnASDFaoAWE3123TMKA222NET'); // secret variable


app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(bodyParser.json());

app.use(
    cors({
        origin: ['http://localhost'],
        methods: ["PUT, GET, POST, DELETE, OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-access-token"],
        credentials: true
    })
);

require('./routes/auth')(app);
require('./routes/api')(app);

function updateCurrencies() {
    Currency.find({}, function (err, currencyList) {
        if (!err) {
            if(currencyList){
                currencyList.map(function (e) {
                    apptools.getCurrencyEuroValue(e.currenyCode, function (euroValue) {
                        if(euroValue){
                            apptools.updateCurrencyEuroValue(e._id, euroValue);
                        }
                    });
                });
            }
        }
    });
}
updateCurrencies();
setInterval(updateCurrencies, 5*60*1000);



app.use(morgan('dev'));

var app_port = 3000;
var server = http.createServer(app);
server.listen(app_port, function () {
    console.log('API running on localhost:' + app_port)
});
