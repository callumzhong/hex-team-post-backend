const Product = require('../models/product.model');

module.exports = {
	getAll: async (type) => {
		if (type && type !== 'coin' && type !== 'ticket') {
			return '搜尋類型錯誤';
		}
		const filter = type ? { type: type } : {};
		const products = await Product.find(filter);
		return products;
	},
};
