var db = require('./db.js');

var cache = {
    online_users: []
};

var writeChannelToCache = function(channel) {
    cache[channel.name] = {
        desc: channel.desc,
        password: channel.password,
        admin: channel.admin,
        participants: channel.participants,
        online_users: [],
        last_messages: []
    }
}

var writeMessageToCache = function(msg) {
    cache[msg.channel].last_messages.push(msg);
    console.log("MSG CACHED")
}

var addOnlineUser = function(username) {
    cache.online_users.push(username);
    console.log("CACHED USER: " + username);
};

var removeOnlineUser = function(username) {
    index = cache.online_users.indexOf(username);
    if (index !== -1) {
        cache.online_users.splice(index, 1);
    }
}

var checkIfOnline = function(username) {
    return cache.online_users.includes(username);
};

module.exports = function() {
    db.loadChannels()
        .then(channels => {
            channels.forEach(channel => {
                writeChannelToCache(channel);
                db.loadMessagesForChannel(channel.name, 20, 0)
                    .then(messages => {
                        if (messages.total != 0) {
                            messages.docs.forEach(message => {
                                writeMessageToCache(message);
                            })
                        }
                    })
            })
        })
}

module.exports.cache = cache;
module.exports.writeMessageToCache = writeMessageToCache;
module.exports.writeChannelToCache = writeChannelToCache;
module.exports.addOnlineUser = addOnlineUser;
module.exports.removeOnlineUser = removeOnlineUser;
module.exports.checkIfOnline = checkIfOnline;