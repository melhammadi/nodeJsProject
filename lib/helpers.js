/*
* helpers for varuis task
*
*/

// Dependencies
const crypto = require('crypto');
const config = require('./config');

// container for all helpers
let helpers = {};

// create a SHA256 hash
helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length > 0){
        let hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }

};


// create part json string to object
helpers.parseJsonToObject = function(str){
    try {
        let obj = JSON.parse(str);
        return obj;
    } catch (error) {
        return {};
    }

};

// export container
module.exports = helpers;