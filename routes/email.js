const express = require('express');
const EmailController = require('../controllers/email');
const router = express.Router();

router.post(
	'/',
	/**
	 * #swagger.tags = ['email']
	 * #swagger.description = '發信服務'
	 */
	/* #swagger.parameters['obj'] = {
			in: 'body',
			description: 'Add a email template',
			schema: { $ref: '#/definitions/AddEmail' }
	} */
	EmailController.send,
);

module.exports = router;
