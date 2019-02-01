const insertProduct = require('../../dao/product/insertProduct')

module.exports = async function (ctx, next) {

	const body = ctx.request.body

	// 如果缺少任何一个东西，返回缺少参数
	if (!body.name || !body.picture || !body.price || !body.floor_price || !body.introduce || !body.bargain_count || !body.bargain_slope || !body.bargain_range || !body.term || !(body.able!= undefined)) {
		ctx.response.body = {
			status: 'fail',
			data: [],
			msg: '缺少参数'
		}
		return next();
	}

	let error;
	let ret = await insertProduct(body.name, body.picture, body.price, body.introduce, body.floor_price, body.bargain_count, body.bargain_slope, body.bargain_range, body.term, body.able).catch(err => { error = err})

	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: '',
			msg: error
		}
	} else {
		ctx.response.body = {
			status: 'ok',
			data: ret,
			msg: ''
		}
	}

	next();

}