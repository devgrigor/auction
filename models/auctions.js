/**
 * Created by Home on 07.10.2017.
 */
var model 	= require('./base-model');
var users_model = require('./users');

/**
 * Getting current auction info
 * @param {callback} callback - Callback function
 */
model.getCurrentAuction = function(callback) {
	var query = 'SELECT *, auctions.id as id, users.name as user_name, auctions.quantity as quantity  FROM auctions ';

	query = model.addJoin(query, 'auctions', 'user_items', {
		first_table_field: 'user_item_id',
		second_table_field: 'id',
		sign: '='
	});

	query = model.addJoin(query, 'auctions', 'users', {
		first_table_field: 'user_id',
		second_table_field: 'id',
		sign: '='
	});

	query += ' where timer > 0';

	// Current auction is only one
	model.selectQuery(query, callback, 0, 1, [], false, 'or');
};

/**
 * Placing a bid on active auction
 * @param {success} callback - Callback function
 * @param {error} callback - Callback function
 * @param {data} object - Callback function
 */
model.placeBid = function(success, error, data) {
	var query = 'SELECT * FROM auctions where timer > 0';

	// Current auction is only one
	model.selectQuery(query, (rows) => {
		if(!rows.length) {
			return error();
		}

		if(rows[0].last_bid > data.bid || rows[0].last_bid > data.bid) {
			return error();
		}

		model.updateQuery('auctions', {
			bidder_id: data.user_id,
			last_bid: data.bid,
			timer: data.timer
		}, {
			field: 'id',
			val: rows[0].id,
			sign: '='
		}, success);
	}, 0, 1, [], false, 'or');
};

/**
 * Creating auction
 * @param {success} callback - Callback function
 * @param {error} callback - Callback function
 * @param {data} object - Callback function
 */
model.createAuction = function(success, error, data) {
	var query = 'SELECT * FROM auctions where timer > 0';
	data = {
		quantity: data.quantity,
		last_bid: data.min_bid,
		user_item_id: data.user_item_id,
		user_id: data.user_id,
		status: 1,
		timer: 100
	};
	
	model.selectQuery(query, (rows) => {
		if (rows.length) {
			model.insertQuery('auctions', data, () => {
				error('Your auction is pending and will be after '+ rows.length + ' auctions');
			});
		} else {
			model.insertQuery('auctions', data, success);
		}

	});
};

/**
 * Updating timer in db
 * @param {lastCallback} callback - Callback function
 * @param {stepCallback} callback - Callback function
 */
model.updateTimer = function(lastCallback, stepCallback) {
	var query = 'SELECT * FROM auctions where timer > 0 ';

	model.selectQuery(query, (rows) => {
		if (!rows.length) {
			return lastCallback();
		}
		var data = rows[0];

		data.timer = parseInt(data.timer) - 1;

		stepCallback(data);

		model.updateQuery('auctions', data, {
			field: 'id',
			val: data.id,
			sign: '='
		}, () => {});
	});
};

model.finalizeUsersAuction = function() {
	var query = "select *, auctions.id as id, auctions.quantity as quantity from auctions ";
	query = model.addJoin(query, 'auctions', 'user_items', {
		first_table_field: 'user_item_id',
		second_table_field: 'id',
		sign: '='
	});

	query += ' where timer = 0 and status = 1';
	model.selectQuery(query, (rows) => {
		var data = rows[0];
		if(!data) {
			return false;
		}

		model.updateQuery('auctions', {status: 2}, {
			field: 'id',
			sign: '=',
			val: data.id
		}, () => {});

		if(!data.bidder_id) {
			return false;
		}

		users_model.updateUserStats({
			coins: data.last_bid,
			quantity: -data.quantity,
			user_item_id: data.user_item_id,
			user_id: data.user_id
		});
		
		var item_rel_query = 'select * from user_items where item_id = '+data.item_id +' and user_id = '+ data.bidder_id;
		
		model.selectQuery(item_rel_query, (rows) => {
			users_model.updateUserStats({
				coins: -data.last_bid,
				quantity: data.quantity,
				user_item_id: rows[0].id,
				user_id: data.bidder_id
			});
		});

	}, 0, 1);
};

module.exports = model;
