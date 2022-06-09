const mongoose = require('mongoose');
const PostConn = require('../connections/post.connection');
const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, '請輸入品名'],
		},
		type: {
			type: String,
			enum: ['coin', 'ticket'],
			required: [true, '類型 type 未填寫'],
		},
		coin: {
			type: Number,
			required: [true, '請輸入代幣'],
		},
		price: {
			type: Number,
			required: [true, '請輸入價錢'],
		},
		discount: {
			type: Number,
			required: [true, '請輸入折扣'],
			default: 0,
		},
		tag: {
			type: String,
			default: '',
		},
		effectiveOfMonthNumber: {
			type: Number,
			default: 999,
		},
	},
	{
		versionKey: false,
	},
);
const Product = PostConn.model('product', productSchema);
module.exports = Product;
