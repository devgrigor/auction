var express = require('express');
var router = express.Router();
var model  = require('../models/users');
var item_model = require('../models/items');


router.post('/login', function(req, res, next) {
	var data = req.body;
	var token = Date.now();
	model.findUserByNme((rows) => {
		if(!rows.length) {

			model.insertUser({
				name: data.name,
				token: token,
				coins: 1000
			}, (rows) => {

				var user = {
					id: rows.insertId,
					name: data.name,
					token: token,
					coins: 1000
				};
				res.send(JSON.stringify(user));

				item_model.addStartItems(user.id);
			});
		} else {
			var user = rows[0];
			user.token = token;

			model.updateUser(user, (update_res) => {
				res.send(JSON.stringify(user));
			});
		}
	}, data.name);


});

router.get('/logout', function(req, res, next) {
	req.user.token = '';

	model.updateUser(req.user, () => {
		res.send(JSON.stringify({success: true}));
	});
});

router.get('/:id', function(req, res, next){
	model.findUser((rows) => {
		res.send(JSON.stringify(rows[0]));
	}, req.params.id)
});

module.exports = router;
