/*
* this are the request handlers
*/

// Dependencies



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