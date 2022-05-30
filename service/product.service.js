const Product = require('../models/product.model');

module.exports = {
	getAll: async () => {
		const products = await Product.find();
		return products;
	},
};
