const ProductService = require('../service/productService');
module.exports = {
	getAll: async (req, res, next) => {
		/* #swagger.responses[200] = {
     		schema: { $ref: '#/definitions/Product' }
    } 
    */
		const products = await ProductService.getAll();
		res.status(200).json({
			status: 'success',
			data: products,
		});
	},
};
