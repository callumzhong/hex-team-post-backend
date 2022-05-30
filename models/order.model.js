const mongoose = require('mongoose');
const PostConn = require('../connections/post.connection');
const OrderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'user',
			required: [true, '請輸入用戶'],
		},
		payment: {
			type: mongoose.Types.ObjectId,
			ref: 'payment',
			select: 'status',
		},
		product: {
			type: mongoose.Types.ObjectId,
			ref: 'product',
		},
		serialNumber: {
			type: String,
			required: [true, '請輸入流水號'],
			unique: true,
			max: 20,
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

OrderSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'product',
		select: 'name price discount',
	});

	next();
});

const Order = PostConn.model('order', OrderSchema);
module.exports = Order;
