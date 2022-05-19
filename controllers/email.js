const EmailHandler = require('../service/email/emailHandler');

module.exports = {
	send: ({ body }, res, next) => {
		console.log(body);
		EmailHandler.send(body, (err, info) => {
			if (err) {
				/* #swagger.responses[400] = {
					schema:"{
						status:'ERROR',
						message:'smtp 錯誤訊息'
        	}",
					description: "發信失敗" 
				}*/
				res.status(400).json({
					status: 'ERROR',
					message: err.message,
				});
				return;
			}
			/* #swagger.responses[200] = {
				description: "發信成功" 
			} */
			res.status(200).send('發信成功');
		});
	},
};