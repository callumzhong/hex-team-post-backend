const EmailService = require('../service/email/email.service');

module.exports = {
	send: ({ body }, res, next) => {
		EmailService.send(body, (err, info) => {
			if (err) {
				res.status(400).json({
					status: 'ERROR',
					message: err.message,
				});
				return;
			}
			res.status(200).send('發信成功');
		});
	},
};
