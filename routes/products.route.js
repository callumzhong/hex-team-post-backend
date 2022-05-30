const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();

router.get(
	'/',
	/**
	 * #swagger.tags = ['products']
	 * #swagger.summary = '取得所有產品'
	 */
	productController.getAll,
);

module.exports = router;
