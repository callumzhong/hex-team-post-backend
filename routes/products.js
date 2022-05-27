const express = require('express');
const productController = require('../controllers/productController');
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
