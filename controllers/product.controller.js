const ProductService = require('../service/product.service');
module.exports = {
	getAll: async (req, res, next) => {
		const { query } = req;
		const products = await ProductService.getAll(query.type);
		res.status(200).json({
			status: 'success',
			data: products,
		});
	},
};
