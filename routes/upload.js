var express = require('express');
var router = express.Router();

router.post('/image', function (req, res, next) {
	/**
	 * #swagger.tags = ['upload']
	 * #swagger.description = '上傳圖片'
	 */
	res.status(200).json();
});

module.exports = router;
