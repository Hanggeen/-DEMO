const pool = require('../pool');

module.exports = function (trade_id) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection) {
			if (err) {
				reject(err)
				return;
			}
			connection.query('SELECT * FROM record WHERE trade_id = ?', [trade_id], function (error, rows, fields) {
				connection.release();
				if (error) { 
					reject(err)
				}
				resolve(rows)
			})	
		});
	})
}