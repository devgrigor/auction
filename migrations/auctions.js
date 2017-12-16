var migration = {};

/** 
 * Creating auctions table  
 * @param {connection} connection - Database connection that is opened
 */
migration.install = function(connection) {	
	connection.query(`
		CREATE TABLE if not exists auctions
		(	
			id int AUTO_INCREMENT,
			status int,
			user_item_id int,
			quantity int,
			user_id int,
			last_bid int,
			bidder_id int,
			timer int,
			PRIMARY KEY (ID)
		);`, 
		function (error, results, fields) {
		    if (error) throw error;
			console.log('auctions table created successfully');
	});
}

module.exports = migration;