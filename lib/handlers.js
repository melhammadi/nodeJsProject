/*
* this are the request handlers
*/

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');



// define the handlers

let handlers = {};

// users handler
handlers.users = function(data, callback){
    let acceptableMethodes = ['post','get','put','delete'];
    if(acceptableMethodes.indexOf(data.method) > -1){
        handlers._users[data.method](data,callback);
    }else {
        callback(405);
    }
};

// Container for the users submethods
handlers._users = {};

// Users Post
// required data: firstName, lastName, phone, password, tosAgreement
// optional data: none
handlers._users.post = function(data,callback){
    //check that all required fields are felling out
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone =  typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length >= 10 ? data.payload.password.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if(firstName && lastName && phone && password && tosAgreement){
        // make sur the user phone number doesn't exist
        _data.read('users', phone, function(err,data){
            if(err){
                // hashing the password
                let hashedPassword = helpers.hash(password);

                // create the user object
                if(hashedPassword){
                    let userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : true
                    };
    
                    // store the user
                    _data.create('users',phone,userObject,function(err){
                        if(!err){
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'could not create the new user'})
                        }
                    });
                } else {
                    callback(500, {'Error' : 'could not hash the password'});
                }
            } else {
                callback(400, {'Error' : 'A user with that phone number already exist'});
            }

        });
    } else {
        callback(400, {'Error' : 'missing required fields'});
    }
       

};

// Users get
handlers._users.get = function(data,callback){

};

// Users Put
handlers._users.put = function(data,callback){

};

// Users delete
handlers._users.delete = function(data,callback){

};










// ping handler

handlers.ping = function(data, callback){
    //callback a http status code , end a payload object
    callback(200);
};

// define the not found handler

handlers.notfound = function(data, callback){
    callback(404, {});
};





// export the handlers
module.exports = handlers;