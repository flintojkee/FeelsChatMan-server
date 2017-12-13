var mongoose = require('mongoose');
var User = mongoose.model('User');
var Channel = mongoose.model('Channel');
var Message = mongoose.model('Message');
var util = require('util');

//console.log(util.inspect(User));

module.exports.registerUser = function(r_username, r_password, r_colour) {
    //console.log("Pre-save: " + r_username + r_password + r_colour);

    var newUser = new User({
        _id: r_username,
        password: r_password,
        colour: r_colour,
    });

    //console.log(newUser.username);

    return new Promise((resolve, reject) => {
        newUser.save((err, data) => {
            if (err) {
                if (err.errmsg.includes("duplicate key error"))
                    reject({
                        success: false,
                        msg: "This username is already taken"
                    })
            } else {
                console.log("After save" + data.username);
                resolve({
                    success: true,
                    user: data.toJSON(),
                    msg: "User registered"
                })
            }
        })
    })
}

module.exports.loginUser = function(l_username, l_password) {
    //console.log(l_username)
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: l_username
        }, (err, user) => {
            if (err) reject(err)
            if (user) {
                //console.log(user.username)
                user.comparePassword(l_password, (err, match) => {
                    if (err) reject(err)
                    else {
                        if (match) {
                            resolve({
                                success: true,
                                user: user.toJSON(),
                                msg: "User logged"
                            })
                        } else {
                            reject({
                                success: false,
                                msg: "Incorrect password"
                            })
                        }
                    }
                })
            } else {
                reject({
                    success: false,
                    msg: "No such username"
                })
            }
        })
    })
}

module.exports.createChannel = function(c_name, c_password, c_desc, c_admin) {
    return new Promise((resolve, reject) => {
        var newChannel = new Channel({
            _id: c_name,
            desc: c_desc,
            admin: c_admin
        })
        if (c_password.trim()) {
            newChannel.password = c_password
        }
        newChannel.save((err, data) => {
            if (err) {
                if (err.errmsg.includes("duplicate key error")) {
                    reject({
                        success: false,
                        msg: "This channel name is already taken"
                    })
                } else {
                    reject(err)
                }
            } else {
                console.log("New channel: " + data.name);
                resolve({
                    success: true,
                    channel: data.toJSON(),
                    msg: "Channel created"
                })
            }
        })
    })
}

module.exports.subForChannel = function(s_username, s_channel, s_password) {
    return new Promise((resolve, reject) => {
        Channel.findOne({
            _id: s_channel
        }, (err, channel) => {
            if (err) reject(err)
            else {
                if (channel.password === s_password) {
                    channel.participants.push(s_username)
                    channel.save((err, updatedChannel) => {
                        if (err) reject(err)
                        else {
                            resolve({
                                success: true,
                                msg: "Successfully joined to " + updatedChannel.name
                            })
                        }
                    })
                } else {
                    reject({
                        success: false,
                        msg: "Incorrect password"
                    })
                }
            }
        })
    })
}

module.exports.loadChannels = function() {
    return new Promise((resolve, reject) => {
        Channel.find({}, (err, channels) => {
            if (err) reject(err)
            else {
                resolve(channels)
            }
        })
    })
}

module.exports.loadMessagesForChannel = function(channelName, numOfMsg, numToSkip) {
    return new Promise((resolve, reject) => {
        var query = {
            channel: channelName
        };
        var options = {
            offset: numToSkip,
            limit: numOfMsg
        };
        Message.paginate(query, options, (err, messages) => {
            if (err) reject(err)
            else {
                resolve(messages)
            }
        })
    })
}

module.exports.saveMessage = function(msg) {
    return new Promise((resolve, reject) => {
        var newMessage = new Message({
            text: msg.msg,
            date: msg.date,
            sender: msg.username,
            channel: msg.channel
        })
        newMessage.save((err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve({
                    success: true,
                    message: data.toJSON(),
                    msg: "Message saved"
                })
            }
        })
    })
}