const { appError, Success } = require('../service/appError');
const OrderService = require('../service/order.service');
module.exports = {
	created: async (req, res, next) => {
		/* #swagger.parameters['obj'] = {
				in: 'body',
				description: '資料格式',
				schema:{
						$productId:'ObjectId',
				}
		}*/
		/* #swagger.responses[201] = {
				schema:{
						status: 'success',
						data: {
								id:'Order Id'
						}
				},
		} 
		*/
		/* #swagger.responses[400] = {
				schema:{
						status: 'error',
						message: '錯誤訊息'
				},
		} 
		*/
		if (!req.body.productId) {
			return res.status(400).send({
				status: 'error',
				message: '請輸入產品編號',
			});
		}
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
				orderId: order._id,
			},
		});
	},
	createdPayPrivatePost: async (req, res, next) => {
		/* #swagger.parameters['obj'] = {
				in: 'body',
				description: '資料格式',
				schema:{
						$postId:'ObjectId',
				}
		}*/
		/* #swagger.responses[200] = {
				schema:{
						status: 'success',
						data: '購買成功'
				},
		} 
		*/
		/* #swagger.responses[400] = {
				schema:{
						status: 'error',
						message: '錯誤訊息'
				},
		} 
		*/
		const { user, body } = req;
		if (!body.postId) {
			return appError(400, '請輸入貼文ID', next);
		}

		const order = await OrderService.createdPayPrivatePost(body.postId, user);
		if (typeof order === 'string') {
			return appError(400, order, next);
		}
		return Success(res, '購買成功');
	},
	createdPaySubscriptionUser: async (req, res, next) => {
		/* #swagger.parameters['obj'] = {
				in: 'body',
				description: '資料格式',
				schema:{
						$subscriptionUserId:'訂閱用戶 ID',
						$productId:'票券類型產品Id'
				}
		}*/
		/* #swagger.responses[200] = {
				schema:{
						status: 'success',
						data: '訂閱成功'
				},
		} 
		*/
		/* #swagger.responses[400] = {
				schema:{
						status: 'error',
						message: '錯誤訊息'
				},
		} 
		*/
		const { subscriptionUserId, productId } = req.body;
		if (!subscriptionUserId) {
			return appError(400, '請輸入被訂閱用戶ID', next);
		}
		if (!productId) {
			return appError(400, '請輸入產品ID', next);
		}

		const order = await OrderService.createdPaySubscriptionUser(
			{
				subscriptionUserId: subscriptionUserId,
				productId: productId,
			},
			req.user,
		);
		if (typeof order === 'string') {
			return appError(400, order, next);
		}
		return Success(res, '訂閱成功');
	},
	getStatus: async (req, res, next) => {
		/* #swagger.parameters['orderId'] = {
				description: '資料格式',
				schema:String
		}*/
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
				status: 'error',
				data: {
					status: false,
					message: '無付款紀錄',
				},
			});
		}
		/* #swagger.responses[200] = {
				schema:{
						status: 'success',
						data: {
							status:true,
							message:'授權成功'
						}
				},
		} 
		*/
		return Success(res, {
			status: order.payment.status,
			message: order.payment.message,
		});
	},
};
