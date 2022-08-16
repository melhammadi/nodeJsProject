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


// Create Random string generator
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength){
        // define all the possible characters that could go into the random
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // strt the final string
        let str = '';
        for(i = 1; i <= strLength; i++){
            // get a random character from possible characters
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

            // apend the character to finel srting
            str += randomCharacter;
        };
        return str;
    } else {
        return false;
    }
};

// export container
module.exports = helpers;