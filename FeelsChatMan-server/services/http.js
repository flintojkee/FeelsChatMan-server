var db = require('./db.js')


module.exports = function(app) {

    // TODO Status codes, especially 4XX for forbidden


    app.post('/login', (req, res) => {
        console.log("Login request params: " + req.body.l_username + " " + req.body.l_password)
        db.loginUser(req.body.l_username, req.body.l_password)
            .then(result => {
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
}