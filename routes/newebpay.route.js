const express = require('express');
const paymentController = require('../controllers/payment.controller');
const router = express.Router();

router.post('/callback', paymentController.postPaymentCallback);

router.post('/blank', paymentController.postPaymentBlank);

module.exports = router;
