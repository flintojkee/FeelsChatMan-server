module.exports = function(io) {
	io.on('connection', (socket) => {
		console.log('user connected');

		socket.on('disconnect', () => {
			console.log('user disconnected');
		})

		socket.on('new message', (msg) => {
			console.log(msg);
			socket.broadcast.emit('new message', msg);
		})

		socket.on('logged', (username) => {
			console.log("LOGGED: " + username)
		})
	})
}