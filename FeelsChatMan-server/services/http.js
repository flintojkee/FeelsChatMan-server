var db = require('./db.js')
var cache = require('./cache.js')


module.exports = function(app) {

    // TODO Status codes, especially 4XX for forbidden

    app.post('/login', (req, res) => {
        if (cache.checkIfOnline(req.body.l_username)) {
            res.send({
                success: false,
                msg: "User already logged from another client"
            })
        }
        console.log("Login request params: " + req.body.l_username + " " + req.body.l_password)
        db.loginUser(req.body.l_username, req.body.l_password)
            .then(result => {
                cache.addOnlineUser(result.user);
                res.send(result)
            })
            .catch(err => {
                res.send(err)
            })
    })

    app.post('/register', (req, res) => {
        console.log("Request: " + req.body.r_username + req.body.r_password + req.body.r_colour);
        db.registerUser(req.body.r_username, req.body.r_password, req.body.r_colour)
            .then(result => {
                res.send(result)
            })
            .catch(err => {
                res.send(err)
            })
    })

    app.post('/logout', (req, res) => {
        
    })

    app.post('/createChannel', (req, res) => {
        console.log("Request: " + req.body.c_name + req.body.c_password + req.body.c_desc + req.body.c_admin);
        db.createChannel(req.body.c_name, req.body.c_password, req.body.c_desc, req.body.c_admin)
            .then(result => {
                cache.writeChannelToCache(result.channel);
                // cache.addParticipantToChannel(result.channel.name, result.user);
                res.send(result)
            })
            .catch(err => {
                res.send(err)
            })
    })

    app.post('/subForChannel', (req, res) => {
        console.log("Join request: " + req.body.j_username + req.body.j_name);
        // console.log(cache.cache.online_users);
        if (!cache.checkIfOnline(req.body.j_username)) {
            res.send({
                success: false,
                msg: "Must be logged in first"
            })
            return;
        }
        db.subForChannel(req.body.j_username, req.body.j_name, req.body.j_password)
            .then(result => {
                cache.addChannelToOnlineUser(result.user.username, result.channel);
                cache.addOnlineUserToChannel(result.channel.name, result.user);
                res.send(result);
            })
            .catch(err => {
                res.send(err)
            })
    })
}