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

        //
        // send the response
        res.end('hello world\n');

        // log the request 
        //console.log("the request recived on this path: "+ trimmedPath + "\n->request method :" + method + "\n and with this query string paramter:", queryStringObject);
        //console.log("this is the header request : ", headers);
        console.log(" request recived with payload : ", buffer);


    });
});



//stat the Server, and have it listen on port 3000

server.listen(3000, function(){
    console.log("the server is listening on port 3000");
});
