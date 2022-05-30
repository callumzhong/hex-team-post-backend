const { setTradeInfo, getDecryptTradeInfo } = require('../configs/newebpay');

const Order = require('../models/order.model');
const Payment = require('../models/payment.model');
const Product = require('../models/product.model');

module.exports = {
	createdPayment: async (orderId) => {
		const order = await Order.findById(orderId);
		if (!order) {
			return '查無訂單';
		}
		if (order.payment) {
			return '已有付款紀錄';
		}
		const tradeInfo = setTradeInfo({
			amount: order.product.price - order.product.discount,
			desc: order.product.name,
			email: '',
		});

		const payment = await Payment.create({
			status: false,
			message: '初始化',
			merchantOrderNo: tradeInfo.MerchantOrderNo,
		});

		await Order.findByIdAndUpdate(order._id, {
			payment: payment._id,
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
