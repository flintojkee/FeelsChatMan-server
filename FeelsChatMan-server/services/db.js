var mongoose = require('mongoose');
var User = mongoose.model('User');
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
                if(err.errmsg.includes("duplicate key error"))
                    reject({
                        success:false,
                        msg: "This username is already taken"
                    })
            } else {
                console.log("After save" +data.username);
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