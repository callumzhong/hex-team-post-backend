const express = require('express');
const OrderController = require('../controllers/order.controller');
const { isAuth } = require('../service/auth.service');
const router = express.Router();

router.post(
	'/',
	isAuth,
	/**
	 * #swagger.tags = ['order']
	 * #swagger.summary = '產生訂單'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	OrderController.created,
);
router.post('/pay/private', isAuth, OrderController.createdPayPrivatePost);

router.get(
	'/status',
	/**
	 * #swagger.tags = ['order']
	 * #swagger.summary = '查詢訂單狀態'
   * #swagger.parameters['orderId'] = {
				in: 'query',
				description: '訂單ID',
     }
	 */
	OrderController.getStatus,
);

module.exports = router;
