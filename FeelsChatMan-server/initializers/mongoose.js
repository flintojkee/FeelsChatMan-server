var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection)

var models = require('require-tree')('../models/');

require('../models/user.js')
require('../models/message.js')
require('../models/channel.js')
    
module.exports = function() {

    console.log("Init mongo");
    
    mongoose.connection.on('open', function() {
        console.log('Connected to mongo server!');
        //autoIncrement.initialize(mongoose.connection);
    });

    mongoose.connection.on('error', function(err) {
        console.log('Could not connect to mongo server!');
        console.log(err.message);
    });

    try {
        mongoose.connect("mongodb://localhost:27017/FeelsChatMan_dev");
    } catch (err) {
        console.log(err);
    }
};