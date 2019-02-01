const pool = require('../pool');

module.exports = function (name, picture, price, introduce, floor_price, bargain_count, bargain_slope, bargain_range, term, able) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection) {
			if (err) {
				return reject(err);
			}
			connection.query('INSERT INTO product (name, picture, price, introduce, floor_price, bargain_count, bargain_slope, bargain_range, term, able ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, picture, price, introduce, floor_price, bargain_count, bargain_slope, bargain_range, term, able], function (error, rows, fields) {
				connection.release();
				if (error) { 
					return reject(error);
				}
				return resolve(rows);
			})	
		});
	})
}