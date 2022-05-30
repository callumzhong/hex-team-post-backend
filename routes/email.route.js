const express = require('express');
const EmailController = require('../controllers/email.controller');
const router = express.Router();

router.post(
	'/',
	/**
	 * #swagger.tags = ['email']
	 * #swagger.summary = '發信服務OK'
	 */
	/* #swagger.parameters['obj'] = {
			in: 'body',
			description: 'Add a email template',
			schema: { $ref: '#/definitions/AddEmail' }
	} */
	EmailController.send,
);

module.exports = router;
