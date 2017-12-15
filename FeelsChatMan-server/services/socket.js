var db = require('./db.js')
var cache = require('./cache.js')

module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('user connected');

        // if(!cache.checkIfOnline(socket.request._query.username)) {
        // 	console.log("Unlogged access" + JSON.stringify(socket.request._query));
        // 	socket.disconnect(true);
        // }

        socket.on('disconnect', () => {
            console.log('user disconnected ' + socket.username);
            socket.broadcast.emit('user disconnected', {
                username: socket.username,
                channels: socket.channels
            });
            cache.removeOnlineUser(socket.username);
        })

        socket.on('new message', (msg) => {
            console.log(msg);
            db.saveMessage(msg)
                .then(result => {
                    if (result.success) {
                        socket.broadcast.emit('new message', result.message);
                        cache.writeMessageToCache(result.message);
                    }
                });
        })

        socket.on('new channel', (channel) => {
            console.log('new channel created');
            socket.broadcast.emit('new channel created', channel);
        })

        socket.on('logged', (user) => {
            console.log("LOGGED: " + user.username);
            socket.username = user.username;
            socket.channel = user.channel;
            socket.broadcast.emit('user logged', user)
        })

        socket.on('user joined channel', (data) => {
            cache.addParticipantToChannel(data.channel.name, data.user);
            cache.addOnlineUserToChannel(data.channel.name, data.user);
            socket.broadcast.emit('user joined channel', data);
        })

        socket.on('request cache', (channel) => {
            // console.log("sent requested messages")
            socket.emit('request cache', {
                    messages: cache.getLastMsgs(channel),
                    online_users: cache.getOnlineUsers(channel),
                    channel_name: channel
                })
                // socket.emit('request cached msgs', cache.getLastMsgs(channel))
        })

        socket.on('request more msgs', (data) => {
            console.log("MORE MSG SERVER")
            db.loadMessagesForChannel(data.channel, data.numOfMsg, data.numToSkip)
                .then(result => {
                    console.log("MORE MSG RES")
                    console.log(result)
                    socket.emit('test');
                    socket.emit('request more msgs', result.docs);
                })
        })
    })
}