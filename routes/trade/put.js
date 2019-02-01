const updateTrade = require('../../dao/trade/updateTrade')

module.exports = async function (ctx, next) {

	const body = ctx.request.body

	if (!body.id || !body.status) {
		ctx.response.body = {
			status: 'fail',
			data: '缺少参数'
		}
		return next();
	}

	let error

	await updateTrade({
		id: body.id,
		status: body.status || 'timeout',
		buy_name: body.buy_name || null,
		buy_phone: body.buy_phone || null,
		buy_address: body.buy_address || null,
		buy_time: body.buy_time || null
	}).catch(err => {error = err})

	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: '',
			msg: error
		}
	} else {
		ctx.response.body = {
			status: 'ok',
			data: '',
			msg: error
		}
	}
	next();
}