/* 
*primary file for the api
*/

//Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');


// instantiate the HTTP server
const httpServer = http.createServer(function(req, res){
    unifiedServer(req,res);
});

//stat the HTTP Server, 
httpServer.listen(config.httpPort, function(){
    console.log("the server is listening on port: "+config.httpPort +"\t Env :" +config.envName+" mode.");
});

// instantiate the HTTPS server
let httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httpsServerOptions, function(req,res){
    unifiedServer(req,res);
});

//stat the HTTPS Server, 
httpsServer.listen(config.httpsPort, function(){
    console.log("the server is listening on port: "+config.httpsPort +"\t Env :" +config.envName+" mode.");
});



// All server logic for both http and https servers

let unifiedServer = function(req,res){
    
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
            'payload' : helpers.parseJsonToObject(buffer)
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
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log(" returning this response : ", statusCode, payloadString );
        });
    });
};




// define request handler

let router = {
    'ping' : handlers.ping,
    'users' : handlers.users,
    'tokens' : handlers.tokens
};
