const mongoose = require('mongoose');
const PostConn = require('../connections/postConn');
const paymentSchema = new mongoose.Schema(
	{
		/** 判斷 code 錯誤代碼定義 true or false */
		status: {
			type: Boolean,
			required: [true, '請輸入交易狀態'],
		},
		/** 藍新金流交易回傳 status 欄位 */
		code: {
			type: String,
			required: [true, '請輸入錯誤代碼'],
		},
		/** 藍新金流交易回傳交易狀態訊息 */
		message: {
			type: String,
			required: [true, '請輸入訊息'],
		},
		/** 藍新金流交易回傳交易序號 */
		tradeNo: {
			type: Boolean,
			required: [true, '請輸入交易序號'],
		},
		/** 藍新金流交易回傳訂單編號 (可用於找尋資料) */
		merchantOrderNo: {
			type: Date,
			required: [true, '請輸入訂單編號'],
		},
		/** 藍新金流交易回傳交易完成時間*/
		payTime: {
			type: Number,
			required: [true, '請輸入交易完成時間'],
		},
	},
	{
		versionKey: false,
		timestamps: true,
	},
);
const Payment = PostConn.model('payment', paymentSchema);
module.exports = Payment;
