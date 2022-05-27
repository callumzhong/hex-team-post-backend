const Product = require('../models/productModel');

module.exports = {
	getAll: async () => {
		const products = await Product.find();
		return products;
	},
};
