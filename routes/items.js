var express = require('express');
var router = express.Router();
var model  = require('../models/items');

router.get('/', function(req, res, next) {
	model.getUserItems((rows) => {
		res.send(JSON.stringify(rows));
	}, req.user.id);
});

router.get('/:id', function(req, res, next) {
	model.findItem(req.params.id, (item) => {
		return res.send(JSON.stringify(item));
	});
});

module.exports = router;
