var express = require('express');
const UsersController=require('../controllers/userController');
const { isAuth } = require('../service/authService');
var router = express.Router();

router.post('/sign-in'
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '使用者登入'
	 */
,UsersController.singin);
router.post('/'
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '註冊使用者'
	 */
, UsersController.CreateUser);

router.post('/forgot_password', function (req, res, next) {
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '忘記密碼'
	 */
	res.status(200).json();
});

router.post('/reset_password',isAuth,
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '重設密碼'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	UsersController.updatePassword
);

router.get('/', function (req, res, next) {
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '取得使用者簡易資訊 - 依分頁'
	 */
	res.status(200).json();
});

router.get('/:id', function (req, res, next) {
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '取得使用者詳細資訊'
	 */
	res.status(200).json();
});

router.delete('/:email', 
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '刪除使用者 (軟刪除)'
	 */
	UsersController.delUser
);

module.exports = router;
