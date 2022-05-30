const OrderService = require('../service/order.service');

module.exports = {
	created: (req, res, next) => {
		const order = OrderService.created(req.body.productId, req.user);
		if (order) {
			return res.status(400).send({
				status: 'error',
				message: '產生訂單失敗',
			});
		}
		return res.status(200).send({
			status: 'success',
			data: order,
		});
	},
};
