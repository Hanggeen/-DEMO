const pool = require('../pool');

module.exports = function (obj) {
	return new Promise((resolve, reject) => {
		if (!obj.id || !obj.status) {
			return reject('缺少有效参数');
		}

		let sql = 'UPDATE trade SET status = ? WHERE id = ?';
		let params = [obj.status, obj.id];

		if (obj.buy_name && obj.buy_phone && obj.buy_address && obj.buy_time) {
			sql = 'UPDATE trade SET status = ?, buy_name = ?, buy_phone = ?, buy_address = ?, buy_time = ? WHERE id = ?';
			params = [obj.status, obj.buy_name, obj.buy_phone, obj.buy_address, obj.buy_time, obj.id];
		}

		pool.getConnection(function(err, connection) {
			if (err) {
				return reject(err);
			}
			connection.query(sql, params, function (error, rows, fields) {
				connection.release();
				if (error) { 
					return reject(error);
				}
				return resolve(rows);
			})	
		});
	})
}