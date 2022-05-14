var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
	/**
	 * #swagger.tags = ['send_email']
	 * #swagger.description = '發信服務'
	 */
	res.status(200).json();
});

module.exports = router;
