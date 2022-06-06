const User = require('../models/users.model');
const ErrorHandler = require('../service/errorHandler');
const PaymentService = require('../service/payment.service');
const CustomizeError = require('../errors/customizeError');
const { appError } = require('../service/appError');
module.exports = {
	getPayment: async (req, res, next) => {
		if (!req.query.orderId) {
			return appError(400, '請輸入訂單編號', next);
		}
		const formParams = await PaymentService.createdPayment(req.query.orderId);
		if (typeof formParams === 'string') {
			return appError(400, formParams, next);
		}
		return res.render('payment', {
			model: {
				PayGateWay: formParams.PayGateWay,
				MerchantID: formParams.MerchantID,
				TradeInfo: formParams.TradeInfo,
				TradeSha: formParams.TradeSha,
				Version: formParams.Version,
			},
		});
	},
	postPaymentCallback: async (req, res, next) => {
		const payment = await PaymentService.detectPayment(req.body.TradeInfo);
		if (!payment.status && payment.message !== '初始化') {
			console.error(
				'付款錯誤:',
				`編號${payment.merchantOrderNo} 訊息${payment.message}`,
			);
		}
		return res.status(200).json();
	},
	postPaymentBlank: async (req, res, next) => {
		const payment = await PaymentService.detectPayment(req.body.TradeInfo);
		const order = await PaymentService.getPaymentOrder(payment.merchantOrderNo);
		const url = `${process.env.FRONT_END_HOST_URL}/#/order-success?orderId=${order.id}`;
		console.log(url);
		return res.redirect(url);
	},
};
