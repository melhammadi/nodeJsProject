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
// required data : phone
// optionale data : none
// @TODO only let authenticated users to access their object. no access to other accounts
handlers._users.get = function(data,callback){
    //check the phone nubmer is valid
    let phone = typeof(data.queryStringObject.phone) == "string" && data.queryStringObject.phone.trim().length ==10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        // lookup the user
        _data.read('users', phone, function(err,data){
            if(!err && data){
                // remove hashpassword from the user object before returning the user
                delete data.hashedPassword;
                callback(200,data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }
};

// Users Put
// required data : phone
// optionale data : firstName, lastName, Password (at least one should be definded)
// @TODO only let an authenticated user to update their object , don't let update any one else
handlers._users.put = function(data,callback){
    //check required filed
    let phone = typeof(data.payload.phone) == "string" && data.payload.phone.trim().length ==10 ? data.payload.phone.trim() : false;
    
    //check optional fileds
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length >= 10 ? data.payload.password.trim() : false;
    
    // error if phone is invalid
    if(phone){
        // error if nothing is sent to update
        if(firstName || lastName || password){
            // Lookup the user
            _data.read('users', phone, function(err,userData){
                if(!err && userData){
                    // update the fileds specified
                    if(firstName){
                        userData.firstName = firstName;
                    }
                    if(lastName){
                        userData.lastName = lastName;
                    }
                    if(password){
                        userData.hashedPassword = helpers.hash(password);
                    }
                    //store the new update
                    _data.update('users',phone,userData,function(err){
                        if(!err){
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error' : 'Could not update the user'});
                        }
                    });
                } else {
                    callback(400, {'Error' : 'the user specified is not found'});
                }
            });
        } else {
            callback(400, {'Error' : 'Missing fileds to update'});
        }
    } else {
        callback(400,{'Error' : 'Missing required filed'})
    }

};

// Users delete
// required filed : phone
// @TODO : only let an authenticated user to delete their object only
// @TODO : cleanup (delete) any other data files associated with the user
handlers._users.delete = function(data,callback){
    // check the required filed
    let phone = typeof(data.queryStringObject.phone) == "string" && data.queryStringObject.phone.trim().length ==10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        // lookup the user
        _data.read('users',phone,function(err,data){
            if(!err && data){
                _data.delete('users',phone,function(err){
                    if(!err){
                        callback(200);
                    } else {
                        console.log(err);
                        callback(500, {'Error' : 'Could not delete the specified user'});
                    }
                });
            } else {
                callback(400, {'Error' : 'Could not find the specified user'});
            }
        });

    } else {
        callback(400, {'Error' : 'Missing required filed'});
    }
};



// 
// Token handler
handlers.tokens = function(data, callback){
    let acceptableMethodes = ['post','get','put','delete'];
    if(acceptableMethodes.indexOf(data.method) > -1){
        handlers._tokens[data.method](data,callback);
    }else {
        callback(405);
    }
};

// Container for the tockens submethods
handlers._tokens = {};

// token post
// required data : phone & password
// optional data : none
handlers._tokens.post = function(data,callback){
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.phone) == 'string' && data.payload.password.trim().length >= 10 ? data.payload.password.trim() : false;
    if(phone && password){
        // lookup the user who match the phone nubmer
        _data.read('users',phone,function(err,userData){
            if(!err && userData){
                // hash the sent password and compare it to the stored hash password
                let hashpassword = helpers.hash(password);
                
                if(hashpassword == userData.hashedPassword){
                    // create new token with random name , set expiration date with 1hour
                    let tokenId = helpers.createRandomString(20);
                    let expires = Date.now() + 1000 * 60 * 60;
                    let tokenObject = {
                        'phone' : phone,
                        'id' : tokenId,
                        'expires' : expires
                    };

                    // store the token
                    _data.create('tokens',tokenId,tokenObject,function(err){
                        if(!err){
                            callback(200,tokenObject);
                        } else {
                            console.log(err);
                            callback(500, 'Error while saving the token');
                        }
                    });

                } else {
                    callback(400, {'Error' : 'Password did not match the specified user password'})
                }
            } else {
                callback(404, {'Error': 'Could not found the specified user'});
            }
        });
    } else {
        callback(400,{'Error' : 'Missing required fileds'});
    }
};

// token get
// required data : Id
// optional data : none
handlers._tokens.get = function(data,callback){
    // check the sent id is valid
    let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        _data.read('tokens',id,function(err,tockenData){
            if(!err && tockenData){
                callback(200, tockenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required filed'});
    }

};

// token put
handlers._tokens.put = function(data,callback){

};

// token delete
handlers._tokens.delete = function(data,callback){

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