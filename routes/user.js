var express = require('express');
var router = express.Router();

router.post('/sign-in', function (req, res, next) {
	/**
	 * #swagger.tags = ['user']
	 * #swagger.description = '登入請求'
	 */
	res.status(200).json();
});

router.post('/forgot_password', function (req, res, next) {
	/**
	 * #swagger.tags = ['user']
	 * #swagger.description = '忘記密碼'
	 */
	res.status(200).json();
});

router.post('/reset_password', function (req, res, next) {
	/**
	 * #swagger.tags = ['user']
	 * #swagger.description = '重設密碼'
	 */
	res.status(200).json();
});

router.get('/', function (req, res, next) {
	/**
	 * #swagger.tags = ['user']
	 * #swagger.description = '取得使用者簡易資訊 - 依分頁'
	 */
	res.status(200).json();
});

router.get('/:id', function (req, res, next) {
	/**
	 * #swagger.tags = ['user']
	 * #swagger.description = '取得使用者詳細資訊'
	 */
	res.status(200).json();
});

router.post('/', function (req, res, next) {
	/**
	 * #swagger.tags = ['user']
	 * #swagger.description = '使用者註冊'
	 */
	res.status(200).json();
});

router.delete('/:id', function (req, res, next) {
	/**
	 * #swagger.tags = ['user']
	 * #swagger.description = '刪除使用者 (軟刪除)'
	 */
	res.status(200).json();
});

module.exports = router;
