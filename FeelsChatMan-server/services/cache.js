var db = require('./db.js');

var cache = {
    online_users: {},
};

var writeChannelToCache = function(channel) {
    cache[channel.name] = {
        desc: channel.desc,
        password: channel.password,
        admin: channel.admin,
        participants: channel.participants,
        online_users: {},
        last_messages: []
    }
}

var writeMessageToCache = function(msg) {
    var cachedMsg = cache[msg.channel].last_messages;
    if (cachedMsg.length >= 20) {
        cachedMsg.shift();
    }
    cachedMsg.push(msg);
    console.log("MSG CACHED")
}

var addOnlineUser = function(user) {
    // console.log(JSON.stringify(cache, null, 2))
    cache.online_users[user.username] = {
        colour: user.colour,
        channels: user.channels
    }
    //console.log(JSON.stringify(cache, null, 2))
    user.channels.forEach((channel) => {
        addOnlineUserToChannel(channel.name, user)
    })
    console.log("CACHED USER: " + user.username);
    // console.log(JSON.stringify(cache, null, 2))
    // console.log(cache.online_users);
};

var removeOnlineUser = function(username) {
    if (cache.online_users[username]) {
        cache.online_users[username].channels.forEach((channel) => {
            removeOnlineUserFromChannel(channel._id, username)
        })
        delete cache.online_users[username];
    }
}

var addChannelToOnlineUser = function(username, channel) {
    cache.online_users[username].channels.push(channel);
}

var addOnlineUserToChannel = function(channel, user) {
    cache[channel].online_users[user.username] = user.colour;
}

var addParticipantToChannel = function(channel, user) {
    cache[channel].participants.push(user.username);
}

var removeOnlineUserFromChannel = function(channel, username) {
    // console.log(JSON.stringify(cache, null, 2))
    // console.log("WUT " + channel + " - " + cache[channel])
    delete cache[channel].online_users[username];
}

var checkIfOnline = function(username) {
    // if(cache.online_users[username])
    return cache.online_users[username];
};

var getLastMsgs = function(channel) {
    // console.log(JSON.stringify(cache, null, 2))
    return cache[channel].last_messages;
}

var getOnlineUsers = function(channel) {
    return cache[channel].online_users;
}

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
module.exports.getLastMsgs = getLastMsgs;
module.exports.addChannelToOnlineUser = addChannelToOnlineUser;
module.exports.addOnlineUserToChannel = addOnlineUserToChannel;
module.exports.removeOnlineUserFromChannel = removeOnlineUserFromChannel;
module.exports.getOnlineUsers = getOnlineUsers;
module.exports.addParticipantToChannel = addParticipantToChannel;
