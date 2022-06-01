const express = require('express');
const paymentController = require('../controllers/payment.controller');
const router = express.Router();

router.post(
	'/callback',
	/**
	 * #swagger.ignore = true
	 */
	paymentController.postPaymentCallback,
);

router.post(
	'/blank',
	/**
	 * #swagger.ignore = true
	 */
	paymentController.postPaymentBlank,
);

module.exports = router;
