var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	/**
	 * #swagger.tags = ['follow']
	 * #swagger.description = '取得追蹤名單 - 依分頁'
	 */
	/* #swagger.parameters['page'] = {
				in: 'query',
				description: '分頁數',
    }	*/
	/* #swagger.parameters['q'] = {
			in: 'query',
			description: '查詢',
	}	*/
	res.status(200).json();
});

router.delete('/:id', function (req, res, next) {
	/**
	 * #swagger.tags = ['follow']
	 * #swagger.description = '取消追蹤'
	 */
	res.status(200).json();
});

module.exports = router;
