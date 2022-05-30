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
   * #swagger.parameters['prod'] = {
				in: 'query',
				description: '產品ID',
     }
	 */
	paymentController.getPayment,
);

router.post(
	'/callback',
	/**
	 * #swagger.ignore = true
	 */
	paymentController.postPaymentCallback,
);

module.exports = router;
