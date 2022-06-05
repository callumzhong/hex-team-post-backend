const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();

/**
 * GET /api/products
 * @tags products
 * @summary 取得所有產品
 * @param {string} type.query.required - 請輸入 coin || ticket 其一類型
 */
router.get('/', productController.getAll);

module.exports = router;
