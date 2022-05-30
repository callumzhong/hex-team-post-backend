const OrderService = require('../service/order.service');
module.exports = {
	created: async (req, res, next) => {
		const order = await OrderService.created(req.body.productId, req.user);
		if (!order) {
			return res.status(400).send({
				status: 'error',
				message: '產生訂單失敗',
			});
		}
		return res.status(201).send({
			status: 'success',
			data: {
				id: order._id,
			},
		});
	},
	getStatus: async (req, res, next) => {
		if (!req.query.orderId) {
			return res.status(400).send({
				status: 'error',
				message: '請輸入訂單編號',
			});
		}
		const order = await OrderService.getStatus(req.query.orderId);

		if (!order) {
			return res.status(400).send({
				status: 'error',
				message: '查無訂單',
			});
		}
		if (!order.payment) {
			return res.status(200).send({
				status: 'success',
				data: {
					paymentStatus: false,
					message: '未付款',
				},
			});
		}
		return res.status(200).send({
			status: 'success',
			data: {
				paymentStatus: order.payment.status,
				message: order.payment.message,
			},
		});
	},
};
