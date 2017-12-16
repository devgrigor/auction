var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// This module will handle all the sockets throughout the application
// Socket is emitting different socket name so there will be no confusion between those
var socket_handler = {};

socket_handler.init = function () {
	socket_handler.sendTimerChange = function(timer) {
		io.emit('timer', {timer: timer});
	};

	io.on('connection', (socket) => {
		console.log('user connected');

		socket.on('disconnect', function(){
			console.log('user disconnected');
		});

		// this socket must be emitted to single user
		socket.on('user-logged', (data) => {
			console.log('user is logged', data);
			io.emit('logged', {id: data.id, token:data.token});
		});
	});

	console.log('sockets inited');

	http.listen(5002, '0.0.0.0', () => {
	  console.log('started on port 5002');
	});
};


module.exports = socket_handler;