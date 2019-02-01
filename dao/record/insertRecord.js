const pool = require('../pool');

module.exports = function(trade_id, bargain_id, baigain_price, current_price){
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection) {
			if (err) {
				return reject(err);
			}

			// 砍价需要修改两个表，一个是交易表，一个是砍价表，两者不能改一个而不改一个
			// 使用事务操作，确保业务是原子性的
			connection.beginTransaction(function(err){
				if (err) {
					return reject(err);
				}

				// 更新交易表的当前价格
				connection.query(
					'UPDATE trade SET current_price = ? WHERE id = ?',
					[current_price, trade_id],
					function(err, rows, fields){
						if (err) {
							connection.rollback();
							return reject(err);
						}

						// 插入砍价记录
						connection.query(
							'INSERT INTO record (trade_id, bargainer_id, bargain_price) VALUES (?,?,?);',
							[trade_id, bargain_id, baigain_price],
							function(err, rows, fields){
								if (err) {
									connection.rollback();
									return reject(err);
								}
								connection.commit(function(err){
									if (err) {
										connection.rollback();
										return reject(err);
									}
									connection.release();
									return resolve(rows);
								})
							}
						)
					}
				)
			})
		})
	})
}