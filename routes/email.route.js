const express = require('express');
const EmailController = require('../controllers/email.controller');
const router = express.Router();
/**
 * A email
 * @typedef {object} Email
 * @property {string} to.required - 收信人 email
 * @property {string} subject.required - 信件主旨
 * @property {string} html.required - html 內容
 */

/**
 * POST /api/email
 * @tags email
 * @summary 發信服務 OK
 * @param {Email} request.body.required - email info
 * @example request
 * {
 *  "to": "test@gmail.com",
 *  "subject": "主旨",
 *  "html": "<b>Hello world?</b>"
 * }
 * @return {string} 200 - success response
 * @example response - 200
 * "發信成功"
 * @return {object} 400 - error response
 * @example response - 400
 * {
 * 	"status":"ERROR",
 * 	"message":"失敗訊息"
 * }
 */
router.post('/', EmailController.send);

module.exports = router;
