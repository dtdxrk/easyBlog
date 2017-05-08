var mongoose = require('mongoose');
var mongodb_config = require('../config/default').mongodb;

mongoose.connect(mongodb_config);

module.exports = mongoose;