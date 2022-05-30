const { Types } = require('mongoose');
const { setTradeInfo, getDecryptTradeInfo } = require('../configs/newebpay');
const Order = require('../models/order.model');
const Payment = require('../models/payment.model');
const Product = require('../models/product.model');

module.exports = {
	createdPayment: async (productId, user) => {
		const date = new Date();
		const year = date.toLocaleString('en-US', {
			timeZone: 'asia/taipei',
			year: 'numeric',
		});
		const month = date.toLocaleString('en-US', {
			timeZone: 'asia/taipei',
			month: 'numeric',
		});
		const day = date.toLocaleString('en-US', {
			timeZone: 'asia/taipei',
			day: 'numeric',
		});

		const start = new Date(year, Number(month) - 1, day, 0, 0, 0, 0);
		const end = new Date(year, Number(month) - 1, day, 23, 59, 59, 999);

		const orderCount = await Order.find({
			createdAt: {
				$gte: start,
				$lte: end,
			},
		}).count();
		const serialNumber = [
			year,
			month.padStart(2, '0'),
			day.padStart(2, '0'),
			String(orderCount + 1).padStart(5, '0'),
		].join('');

		const product = await Product.findById(productId);
		if (!product) {
			return false;
		}

		const tradeInfo = setTradeInfo({
			amount: product.price - product.discount,
			desc: product.name,
			email: '',
		});
		const payment = await Payment.create({
			status: false,
			message: '初始化',
			merchantOrderNo: tradeInfo.MerchantOrderNo,
		});
		await Order.create({
			user: user.id,
			payment: payment._id,
			type: 'ADD_CREDIT',
			summary: `購買${product.name}`,
			addCoin: product.coin,
			reduceCoin: 0,
			serialNumber: serialNumber,
		});

		return tradeInfo;
	},

	detectPayment: async (result) => {
		const tradeInfo = getDecryptTradeInfo(result);
		const { MerchantOrderNo, PayTime, TradeNo } = tradeInfo.Result;
		const filter = {
			merchantOrderNo: MerchantOrderNo,
		};
		const update = {
			status: tradeInfo.Status === 'SUCCESS' ? true : false,
			code: tradeInfo.Status,
			message: tradeInfo.Message,
			tradeNo: TradeNo,
			payTime: `${PayTime.slice(0, 10)}T${PayTime.slice(10)}+08:00`,
		};

		return await Payment.findOneAndUpdate(filter, update);
	},
};
