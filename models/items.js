/**
 * Created by Home on 07.10.2017.
 */
var model 	= require('./base-model');

/**
 * Get items of user by user_id
 * @param {callback} callback - Callback function
 * @param {int} user_id - Id of user
 */
model.getUserItems = function(callback, user_id) {
	var query = 'SELECT *, user_items.id as id FROM user_items ';

	query = model.addJoin(query, 'user_items', 'items', {
		first_table_field: 'item_id',
		second_table_field: 'id',
		sign: '='
	});

	query += ' where user_id = ' + user_id;

	// Item types can't be more than 3 at the moment
	model.selectQuery(query, callback, 0, 3, [], false, 'or');
};

/**
 * Add items at start for user
 * @param {int} user_id - Id of user
 */
model.addStartItems = function(user_id) {
	var insert_data = [
		{
			user_id: user_id,
			item_id: 1,
			quantity: 30
		},

		{
			user_id: user_id,
			item_id: 2,
			quantity: 18
		},

		{
			user_id: user_id,
			item_id: 3,
			quantity: 1
		}
	];

	for(let i in insert_data) {

		model.insertQuery('user_items', insert_data[i], (res) => {
			console.log('item added');
		});
	}
};

model.findItem = function(id, callback) {
	var query = 'SELECT *, user_items.id as id FROM user_items ';
	query = model.addJoin(query, 'user_items', 'items', {
		first_table_field: 'item_id',
		second_table_field: 'id',
		sign: '='
	});

	query += ' where user_items.id = ' + id;

	model.selectQuery(query, callback, 0, 1, [], false, 'or');
};

module.exports = model;
