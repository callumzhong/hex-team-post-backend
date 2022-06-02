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
router.post(
	'/pay/private',
	isAuth,
	/**
	 * #swagger.tags = ['order']
	 * #swagger.summary = '購買貼文'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	OrderController.createdPayPrivatePost,
);
router.post(
	'/pay/subscription',
	isAuth,
	/**
	 * #swagger.tags = ['order']
	 * #swagger.summary = '訂閱貼文'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	OrderController.createdPaySubscriptionUser,
);

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
