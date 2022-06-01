const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { isAuth } = require('../service/auth.service');
const router = express.Router();

router.get(
	'/',
	isAuth,
	/**
	 * #swagger.tags = ['payment']
	 * #swagger.summary = '跳轉付款頁面'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
   * #swagger.parameters['orderId'] = {
				in: 'query',
				description: '訂單ID',
     }
	 */
	paymentController.getPayment,
);

module.exports = router;
