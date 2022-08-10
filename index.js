/* 
*primary file for the api
*/


//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;



// the server should respons to all requests with a string
const server = http.createServer(function(req, res){
    
    // get the url and parse it
    let parsedUrl = url.parse(req.url,true);

    //get the path from url
    let path = parsedUrl.pathname; // untrimed path
    let trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get query string as object
    let queryStringObject = parsedUrl.query;

    // Get the HTTP Method

    let method = req.method.toLowerCase();

    // Get the request header as object

    let headers = req.headers;

    // Get the payload if there is any

    let decoder = new StringDecoder("utf-8");
    let buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
        
    });

    req.on('end', function(){
        buffer += decoder.end();

        // choose the handler this request should go to if not found goes to notfound handler
        let choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notfound;

        //Constract the data object to send to the handler
        let data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        // route the request to the handler specified in the route
        choosenHandler(data, function(statusCode, payload){
            // use the status code called back by handler, or default
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // use the payload called back by the handler , or default
            path = typeof(payload) == 'object' ? payload : {};

            //convert the payload to a string
            let payloadString = JSON.stringify(payload);

            // return the response

            res.writeHead(statusCode);
            res.end(payloadString);

            console.log(" returning this response : ", statusCode, payloadString );
        });
    });
});

//stat the Server, and have it listen on port 3000

server.listen(3000, function(){
    console.log("the server is listening on port 3000");
});

// define the handlers

let handlers = {};

// sample handler

handlers.sample = function(data, callback){
    //callback a http status code , end a payload object
    callback(406, {'name': 'sample handler'});
};

//my test to check the logique
handlers.tickets = function(data, callback){
    //callback a http status code , end a payload object
    callback(407, {'name': 'tickets handler'});
};


// define the not found handler

handlers.notfound = function(data, callback){
    callback(404, {});
};


// define request handler

let router = {
    'sample' : handlers.sample,
    'tickets' : handlers.tickets
};
