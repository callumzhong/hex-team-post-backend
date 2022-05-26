const mongoose = require('mongoose');
const PostConn = require('../connections/postConn');
const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'user',
			required: [true, '請輸入用戶'],
		},
		payment: {
			type: mongoose.Types.ObjectId,
			ref: 'payment',
		},
		type: {
			type: String,
			enum: ['ADD_CREDIT', 'REDUCE_CREDIT', 'INCOME'],
			required: [true, '請輸入訂單種類'],
		},
		summary: {
			type: String,
			required: [true, '請輸入摘要'],
		},
		addCoin: {
			type: Number,
			required: [true, '請輸入增加代幣數量'],
		},
		reduceCoin: {
			type: Number,
			required: [true, '請輸入減少代幣數量'],
		},
	},
	{
		versionKey: false,
		timestamps: true,
	},
);
const Order = PostConn.model('order', orderSchema);
module.exports = Order;
