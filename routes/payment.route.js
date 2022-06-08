const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { isAuth } = require('../service/auth.service');
const router = express.Router();

/**
 * GET /api/payment
 * @tags payment
 * @summary 跳轉付款頁面
 * @security apiKeyAuth
 * @param {string} orderId.query.required - 訂單ID
 * @return {string} 200 - 跳轉付款頁面 - text/html
 * @return {object} 400 - error response
 * @example response - 400
{
  "status": "error",
  "message": "錯誤訊息"
}
 */
router.get('/', isAuth, paymentController.getPayment);

module.exports = router;
