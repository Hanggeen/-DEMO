const updateProduct = require('../../dao/product/updateProduct')

module.exports = async function (ctx, next) {

	const body = ctx.request.body

	if (!body.id || !(body.name || body.picture || body.price || body.term || (body.able != undefined))) {
		ctx.response.body = {
			status: 'fail',
			data: '缺少参数'
		}
		next();
		return;
	}

	let error;
	let ret = await updateProduct(body).catch(err => { error = err})

	if (error) {
		ctx.response.body = {
			status: 'fail',
			data: ret,
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