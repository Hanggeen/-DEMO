module.exports = function (params) {
	console.log(params)

	// 总差价
	let total = params.price - params.floor_price;

	// 期待人数
	let n = params.bargain_count;

	// 当前第几个砍价
	// 当砍价继续的时候，人数超出预算范围内，会出现负数，这里要保护i不能超过期待人数
	let i = params.bargain_num > n ? n : params.bargain_num;

	// 砍价斜率
	let rate = Math.abs(params.bargain_slope)/100;

	if (params.bargain_slope < 0) {
		i = n + 1 - i;
	}

	let ret = (i-1)*(2*total*(1-rate))/(n*(n-1))+total*rate/n;

	let rate2 = 2*(Math.random()-0.5)*params.random_percent/100;
	ret = ret + rate2 * ret;
	return Math.floor(ret * 100) / 100;

}
