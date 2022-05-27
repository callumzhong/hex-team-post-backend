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
			max: 10,
		},
		/** 藍新金流交易回傳交易狀態訊息 */
		message: {
			type: String,
			required: [true, '請輸入訊息'],
		},
		/** 藍新金流交易回傳交易序號 */
		tradeNo: {
			type: String,
			max: 20,
		},
		/** 藍新金流交易回傳訂單編號 (可用於找尋資料) */
		merchantOrderNo: {
			type: String,
			required: [true, '請輸入訂單編號'],
			unique: true,
			max: 30,
		},
		/** 藍新金流交易回傳交易完成時間*/
		payTime: {
			type: Date,
			default: '',
		},
	},
	{
		versionKey: false,
		timestamps: true,
	},
);
const Payment = PostConn.model('payment', paymentSchema);
module.exports = Payment;
