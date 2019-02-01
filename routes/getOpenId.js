const axios = require('axios');
const config = require('../config');
module.exports = async function (ctx, next) {
	console.log({
		appid: config.appid,
		secret: config.secret,
		js_code: ctx.request.body.code,
		grant_type: 'authorization_code'
	})
	let openid = await new Promise((resolve, reject) => {
		axios.get('https://api.weixin.qq.com/sns/jscode2session', {
			params: {
				appid: config.appid,
				secret: config.secret,
				js_code: ctx.request.body.code,
				grant_type: 'authorization_code'
			}
		})
		.then(function (response) {
			console.log(response.data)
			resolve(response.data.openid)
		})
		.catch(function (error) {
			console.log(error);
		});
	})


	ctx.response.body = {
		status: 'ok',
		data: openid
	}

	next();
}