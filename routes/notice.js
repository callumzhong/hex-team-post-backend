var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	/**
	 * #swagger.tags = ['notice']
	 * #swagger.description = '通知訊息'
	 */
	res.status(200).json();
});

module.exports = router;
