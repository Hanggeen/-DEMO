const pool = require('../pool');

module.exports = function (params) {
	return new Promise((resolve, reject) => {

		// 需要一个id，还有除id之外的一个参数
		if (!params.id || !(params.name || params.picture || params.price || params.floor_price || params.bargain_count || params.bargain_slope || params.bargain_range || params.term || params.able != undefined)) {
			return reject('缺少有效参数');
		}

		let sql = '';
		let sqlparams = [];

		// 以下为 根据条件，拼接sql语句
		if (params.name) {
			sql += 'name = ?,'
			sqlparams.push(params.name)
		}
		if (params.picture) {
			sql += 'picture = ?,'
			sqlparams.push(params.picture)
		}
		if (params.price) {
			sql += 'price = ?,'
			sqlparams.push(params.price)
		}
		if (params.floor_price) {
			sql += 'floor_price = ?,'
			sqlparams.push(params.floor_price)
		}
		if (params.bargain_count) {
			sql += 'bargain_count = ?,'
			sqlparams.push(params.bargain_count)
		}
		if (params.bargain_slope) {
			sql += 'bargain_slope = ?,'
			sqlparams.push(params.bargain_slope)
		}
		if (params.bargain_range) {
			sql += 'bargain_range = ?,'
			sqlparams.push(params.bargain_range)
		}
		if (params.term) {
			sql += 'term = ?,'
			sqlparams.push(params.term)
		}
		if (params.able != undefined) {
			sql += 'able = ?,'
			sqlparams.push(params.able)
		}

		sqlparams.push(params.id)
		sql = sql.slice(0, -1)

		pool.getConnection(function(err, connection) {
			if (err) {
				return reject(err);
			}
			connection.query('UPDATE product SET ' + sql + ' WHERE id = ?', sqlparams, function (error, rows, fields) {
				connection.release();
				if (error) { 
					return reject(error);
				}
				return resolve(rows);
			})	
		});
	})
}