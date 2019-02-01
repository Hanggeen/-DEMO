const pool = require('../pool');

module.exports = function (openid, avatar, gender, nickname) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection) {
			if (err) {
				return reject(err);
			}
			connection.query('INSERT INTO user (openid, avatar, gender, nickname) VALUES (?,?,?,?)', [openid, avatar, gender, nickname], function (error, rows, fields) {
				connection.release();
				if (error) { 
					return reject(error);
				}
				return resolve(rows);
			})	
		});
	})
}