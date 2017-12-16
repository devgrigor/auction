var migration = {};

/** 
 * Creating items table  
 * @param {connection} connection - Database connection that is opened
 */
migration.install = function(connection) {	
	connection.query(`
		CREATE TABLE if not exists items
		(	
			id int AUTO_INCREMENT,
			name varchar(255),
			image_url text,
			PRIMARY KEY (ID)
		);
		`, 
		function (error, results, fields) {
		    if (error) throw error;
		    var items = [
			    {
			    	id: 1,
			    	name: 'bread',
			    	image_url: '/images/bread.jpg'
			    },

			    {
			    	id: 2,
			    	name: 'carrot',
			    	image_url: '/images/carrot.jpg'
			    },

			    {
			    	id: 3,
			    	name: 'diamond',
			    	image_url: '/images/diamond.jpg'
			    }
			];

		    for(let i in items) {
		    	connection.query("INSERT INTO items (id,name, image_url) VALUES ("+items[i].id+", '" + items[i].name +"', '" + items[i].image_url +"')", 
		    		function (error, results, fields) {
					    if (error) throw error;
					});
		    }

			console.log('items table created successfully');
	});
}

module.exports = migration;