const User = require('../models/users.model');
const ErrorHandler = require('../service/errorHandler');
const PaymentService = require('../service/payment.service');
const CustomizeError = require('../errors/customizeError');
module.exports = {
	getPayment: async (req, res, next) => {
		if (!req.query.orderId) {
			ErrorHandler(new CustomizeError('請輸入訂單編號'), req, res, next);
			return;
		}
		const formParams = await PaymentService.createdPayment(req.query.orderId);
		if (typeof formParams === 'string') {
			ErrorHandler(new CustomizeError(formParams), req, res, next);
			return;
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
	getPaymentBlank: (req, res, next) => {
		return res.render('paymentCallback');
	},
};
