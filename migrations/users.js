var migration = {};

/** 
 * Creating users table  
 * @param {connection} connection - Database connection that is opened
 */
migration.install = function(connection) {	
	connection.query(`
		CREATE TABLE if not exists users
		(	
			id int AUTO_INCREMENT,
			coins int,
			name varchar(255),
			token varchar(255),
			PRIMARY KEY (ID),
			INDEX user_name (name)
		);`, 
		function (error, results, fields) {
		    if (error) throw error;
			console.log('users table created successfully');
	});
}

module.exports = migration;