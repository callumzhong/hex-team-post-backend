var express = require('express');
const followController = require('../controllers/follow.controller');
const { isAuth } = require('../service/auth.service');
const { route } = require('./user.route');
var router = express.Router();

router.get(
	'/',
	isAuth,
	/**
	 * #swagger.tags = ['follow']
	 * #swagger.summary = '取得個人追蹤名單OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	followController.getAll
	);
	router.get('/:id',
/**
	 * #swagger.tags = ['follow']
	 * #swagger.summary = '取得某人追蹤名單OK'
	 */
	followController.getOne,
);
router.get('/:id/Follows',
	/**
	 * #swagger.tags = ['follow']
	 * #swagger.summary = '取得某人追蹤數OK'
	 */
	followController.getUserFollowCount
	);


router.post('/',isAuth,
/**
	 * #swagger.tags = ['follow']
	 * #swagger.summary = '加入追蹤(對應設計4頁)OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	followController.created,
);

router.delete(
	'/:followuser',
	isAuth,
	/**
	 * #swagger.tags = ['follow']
	 * #swagger.summary = '取消追蹤OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	followController.delete,
);

module.exports = router;
