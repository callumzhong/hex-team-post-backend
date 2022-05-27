const User = require('../models/usersModel');
const PaymentService = require('../service/paymentService');
module.exports = {
	getPayment: async (req, res, next) => {
		if (!req.query.prod) {
			res.redirect(process.env.FroneEndUrl);
			return;
		}
		const formParams = await PaymentService.createdPayment(
			req.query.prod,
			req.user,
		);
		if (!formParams) {
			res.redirect(process.env.FroneEndUrl);
			return;
		}
		res.render('payment', {
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
		if (req.query.from === 'ReturnURL') {
			return res.redirect(process.env.FroneEndUrl);
		}
		const payment = await PaymentService.detectPayment(req.body.TradeInfo);
		if (!payment.status && payment.message !== '初始化') {
			console.error(
				'付款錯誤:',
				`編號${payment.merchantOrderNo} 訊息${payment.message}`,
			);
		}
		return res.redirect(process.env.FroneEndUrl);
	},
};
