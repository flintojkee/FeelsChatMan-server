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
                cache.addOnlineUser(req.body.l_username);
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
                res.send(result)
            })
            .catch(err => {
                res.send(err)
            })
    })

    app.post('/subForChannel', (req, res) => {
        if (!cache.checkIfOnline(req.body.s_username)) {
            res.send({
                success: false,
                msg: "Must be logged in first"
            })
        }
        db.subForChannel(req.body.s_username, req.body.s_channel, req.body.s_password)
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                res.send(err)
            })
    })
}