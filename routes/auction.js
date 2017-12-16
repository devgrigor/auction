var express = require('express');
var router = express.Router();
var model  = require('../models/auctions');
var socket = require('../sockets');

var interval = setInterval(() => {
	model.updateTimer(() => {
		model.finalizeUsersAuction();
	}, (data) => {
		socket.sendTimerChange(data.timer);
	});
}, 1000);

router.get('/', function(req, res, next) {
	model.getCurrentAuction((rows) => {
		res.send(JSON.stringify(rows));
	}, req.user.id);
});

router.put('/', function(req, res, next) {
	var data = req.body;
	data.user_id = req.user.id;

	model.placeBid(() => {
		res.send(JSON.stringify({
			success: true
		}));
	}, () => {

	}, data);
});

router.post('/', function(req, res, next) {
	var data = req.body;
	data.user_id = req.user.id;

	model.createAuction((rows) => {

		res.send(JSON.stringify({
			id: rows.insertId,
			success: true
		}));
	}, (message) => {
		res.send(JSON.stringify({error: message ? message : 'Error , check if there is no active auction'}));
	}, data);
});

module.exports = router;
