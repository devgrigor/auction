var model 	= require('./base-model');

/** 
 * Get user by id
 * @param {callback} function - Callback function
 * @param {int} id - Id of user
*/
model.findUser = function(callback, id) {
	var query = 'SELECT * FROM users where id = '+id;

	model.selectQuery(query, callback, 0, 1, [], false, 'or');
}

/** 
 * Get user by token
 * @param {callback} function - Callback function
 * @param {string} token - Id of user
*/
model.findUserByToken = function(callback, token) {
	var query = 'SELECT * FROM users where token = \'' + token + '\'';

	model.selectQuery(query, callback, 0, 1, [], false, 'or');
}

/**
 * Get user by token
 * @param {callback} function - Callback function
 * @param {string} name - Name of user
 */
model.findUserByNme = function(callback, name) {
	var query = 'SELECT * FROM users where name = \'' + name + '\'';

	model.selectQuery(query, callback, 0, 1, [], false, 'or');
}

/** 
 * Insert user
 * @param {objet} data  - Data of user
 * @param {callback} function - Callback function 
 */
model.insertUser = function(data, callback) {
	model.insertQuery('users', data, callback);
}

model.updateUser = function(user, callback) {
	model.updateQuery('users', user, {
		field: 'id',
		sign: '=',
		val: user.id
	}, callback);
}

model.updateUserStats = function(options) {
	model.findUser((rows) => {
		var user_data = rows[0];

		user_data.coins += options.coins;

		model.updateUser(user_data, () => {});

	}, options.user_id);

	var rel_query = 'select * from user_items where id = '+options.user_item_id;

	model.selectQuery(rel_query, (rows) => {
		var data = rows[0];

		data.quantity += options.quantity;

		model.updateQuery('user_items', data, {
			field: 'id',
			sign: '=',
			val: data.id
		}, () => {});
	});

}

module.exports = model;