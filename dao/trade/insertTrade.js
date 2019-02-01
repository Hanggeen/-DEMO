const pool = require('../pool');

module.exports = function (user_id, product_id, initial_price, current_price, floor_price, buy_name, buy_phone, buy_address, buy_time,  status, deadline) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection) {
			if (err) {
				return reject(err);
			}
			connection.query(
				'INSERT INTO trade (user_id, product_id, initial_price, current_price, floor_price, buy_name, buy_phone, buy_address, buy_time,  status, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
				[user_id, product_id, initial_price, current_price, floor_price, buy_name, buy_phone, buy_address, buy_time, status, deadline],
				function (error, rows, fields) {
					connection.release();
					if (error) { 
						return reject(error);
					}
					connection.query('SELECT LAST_INSERT_ID()', function(error, rows, fields) {
						if (error) {
							return reject(error);
						}
						return resolve(rows);
					})
				}
			)	
		});
	})
}