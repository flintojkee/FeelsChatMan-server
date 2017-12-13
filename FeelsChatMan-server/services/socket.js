var db = require('./db.js')
var cache = require('./cache.js')

module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('user connected');

        if(!cache.checkIfOnline(socket.request._query.username)) {
        	console.log("Unlogged access" + JSON.stringify(socket.request._query));
        	socket.disconnect(true);
        }

        socket.on('disconnect', () => {
            console.log('user disconnected');
            cache.removeOnlineUser(socket.username)
        })

        socket.on('new message', (msg) => {
            console.log(msg);
            socket.broadcast.emit('new message', msg);
            cache.writeMessageToCache(msg);
            db.saveMessage(msg);
        })

        socket.on('new channel', (channel) => {
            console.log('new channel created');
            socket.broadcast.emit('new channel created', channel);
            cache.writeChannelToCache(channel)
        })

        socket.on('logged', (username) => {
            console.log("LOGGED: " + username);
            socket.username = username;
        })
    })
}