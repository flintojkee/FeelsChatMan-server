var app = require('express')(); 
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
const util = require('util');
var initializers = require('require-tree')('./initializers')

//run initializers
Object.keys(initializers).forEach((elem) => {
	initializers[elem]();
})

//console.log(util.inspect(initializers));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var port = 3000;

app.get('/', function(req, res){
  res.send('<script src="/socket.io/socket.io.js"></script><script>var socket = io();</script><h1>Hello world</h1>');
});

require('./services/socket.js')(io);
require('./services/http.js')(app);

server.listen(port,"localhost", () => console.log('listening on port ' + port));