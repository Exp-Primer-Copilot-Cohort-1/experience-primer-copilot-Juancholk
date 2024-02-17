// Create web server that listens on port 8080
// The server should respond with the contents of comments.json when it receives a GET request to /comments
// The server should accept POST requests to /comments and add them to comments.json
// The server should respond with a 404 error for any other requests

var http = require('http');
var fs = require('fs');
var path = require('path');

var server = http.createServer(function(request, response) {
  if (request.method === 'GET' && request.url === '/comments') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    fs.createReadStream(path.join(__dirname, 'comments.json')).pipe(response);
  } else if (request.method === 'POST' && request.url === '/comments') {
    var newComment = '';
    request.on('data', function(data) {
      newComment += data;
    });
    request.on('end', function() {
      fs.readFile(path.join(__dirname, 'comments.json'), function(err, data) {
        var comments = JSON.parse(data);
        comments.push(JSON.parse(newComment));
        fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), function(err) {
          if (err) {
            console.log(err);
            response.writeHead(500);
            response.end('Internal Server Error');
          } else {
            response.writeHead(201);
            response.end();
          }
        });
      });
    });
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
});

server.listen(8080);
console.log('Server is listening on port 8080');