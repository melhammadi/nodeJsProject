/* 
*primary file for the api
*/


//Dependencies
const http = require('http');
const url = require('url');



// the server should respons to all requests with a string
const server = http.createServer(function(req, res){
    
    // get the url and parse it
    let parsedUrl = url.parse(req.url,true);

    //get the path from url
    let path = parsedUrl.pathname; // untrimed path
    let trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // send the response
    res.end('hello world\n');

    // log the request 
    console.log("the request recived on this path: "+ trimmedPath);



});



//stat the Server, and have it listen on port 3000

server.listen(3000, function(){
    console.log("the server is listening on port 3000");
});
