const getProduct = require('../../dao/product/getProduct');

module.exports = async function (ctx, next) {
	
	let ret, error;

	ret = await getProduct(ctx.query).catch(err => { error = err})

	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: [],
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