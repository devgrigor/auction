var migration = {};

/** 
 * Creating items table  
 * @param {connection} connection - Database connection that is opened
 */
migration.install = function(connection) {	
	connection.query(`
		CREATE TABLE if not exists user_items
		(	
			id int AUTO_INCREMENT,
			item_id int,
			user_id int,
			quantity int,
			PRIMARY KEY (ID)
		);
		`, 
		function (error, results, fields) {
		    if (error) throw error;
			console.log('user items table created successfully');
	});
}

module.exports = migration;