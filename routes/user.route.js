var express = require('express');
const UsersController = require('../controllers/users.controller');
const { isAuth } = require('../service/auth.service');
var router = express.Router();

router.get(
	'/check',
	isAuth,
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '登入權限測試'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	UsersController.checkUser,
);
router.get(
	'/',
	isAuth,
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '取得個人頁面-設定(對應設計18頁)
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	UsersController.GetUser,
);

router.post(
	'/sign-in',
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '使用者登入'
	 */
	UsersController.singin,
);
router.post(
	'/',
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '註冊使用者'
	 */
	UsersController.CreateUser,
);

router.post(
	'/forgot_password',
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '忘記密碼'
	 */
	UsersController.forgotPassword,
);

router.post(
	'/reset_password',
	isAuth,
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '重設密碼'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	UsersController.updatePassword,
);




router.get('/:id', 

	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '取得使用者詳細資訊 OK'
	 */
	UsersController.GetUserById
);



router.delete(
	'/:email',
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '刪除使用者 (軟刪除)'
	 */
	UsersController.delUser,
);

router.patch(
	'/',isAuth,
	/**
	 * #swagger.tags = ['user']
	 * #swagger.summary = '修改使用者 OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	UsersController.EditUser,
);

module.exports = router;
