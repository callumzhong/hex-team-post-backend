const express = require('express');
const OrderController = require('../controllers/order.controller');
const { isAuth } = require('../service/auth.service');
const router = express.Router();

/**
 * @typedef {object} AddOrder
 * @property {string} productId
 */

/**
 * @typedef {object} payPost
 * @property {string} postId
 */

/**
 * @typedef {object} subscriptionUser
 * @property {string} subscriptionUserId
 * @property {string} productId
 */

/**
 * POST /api/order
 * @tags order
 * @summary 產生訂單
 * @security apiKeyAuth
 * @param {AddOrder} request.body.required - order info
 * @example request
{
  "productId": "product Id"
}
 * @return {object} 201 - success response
 * @example response - 201
{
  "status": "success",
  "data": {
    "id": "Order Id"
  }
}
 * @return {object} 400 - error response
 * @example response - 400
 * {
 * 	"status":"error",
 * 	"message":"錯誤訊息"
 * }
 */
router.post('/', isAuth, OrderController.created);

/**
 * POST /api/order/pay/private
 * @tags order
 * @summary 購買貼文
 * @security apiKeyAuth
 * @param {payPost} request.body.required - order info
 * @example request
{
  "postId": "ObjectId"
}
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": "success",
  "data": "購買成功"
}
 * @return {object} 400 - error response
 * @example response - 400
 * {
 * 	"status":"error",
 * 	"message":"錯誤訊息"
 * }
 */
router.post('/pay/private', isAuth, OrderController.createdPayPrivatePost);

/**
 * POST /api/order/pay/subscription
 * @tags order
 * @summary 訂閱用戶
 * @security apiKeyAuth
 * @param {subscriptionUser} request.body.required - order info
 * @example request
{
  "subscriptionUserId": "訂閱用戶 ID",
  "productId": "票券類型產品Id"
}
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": "success",
  "data": "訂閱成功"
}
 * @return {object} 400 - error response
 * @example response - 400
 * {
 * 	"status":"error",
 * 	"message":"錯誤訊息"
 * }
 */
router.post(
	'/pay/subscription',
	isAuth,
	OrderController.createdPaySubscriptionUser,
);

/**
 * GET /api/order/status
 * @tags order
 * @summary 查詢訂單狀態
 * @param {string} orderId.query.required - 訂單ID
 * @return {object} 200 - success response
 * @example response - 200 - 藍新金流回傳資訊
{
  "status": "success",
  "data": {
    "status": true,
    "message": "授權成功"
  }
}
 * @example response - 200 - 有訂單但未跳轉藍新金流
{
  "status": "error",
  "data": {
    "status": false,
    "message": "無付款紀錄"
  }
}
 * @return {object} 400 - error response
 * @example response - 400
{
  "status": "error",
  "message": "錯誤訊息"
}
 */
router.get('/status', OrderController.getStatus);

module.exports = router;
