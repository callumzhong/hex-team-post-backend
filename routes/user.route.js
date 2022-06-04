var express = require('express');
const UsersController = require('../controllers/users.controller');
const { isAuth } = require('../service/auth.service');
var router = express.Router();

/**
 * @typedef {object} SignIn
 * @property {string} email.required
 * @property {string} password.required
 */
/**
 * @typedef {object} SignUp
 * @property {string} name.required
 * @property {string} email.required
 * @property {string} photo
 * @property {string} birthday
 * @property {string} gender
 * @property {string} password.required
 * @property {string} confirmPassword.required
 * @property {string} memo
 */

/**
 * @typedef {object} ForgotPassword
 * @property {string} email.required
 */

/**
 * @typedef {object} ResetPassword
 * @property {string} password.required
 * @property {string} confirmPassword.required
 */

/**
 * @typedef {object} DeleteUser
 * @property {string} email.required
 */

/**
 * GET /api/user/check
 * @tags user
 * @summary 登入權限測試
 * @security apiKeyAuth
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": "success",
  "data": {
    "message": "已經授權!"
  }
}
 * @return {object} 400 - error response
 * @example response - 400
{
  "status": "success",
  "message": "尚未授權"
}
 */
router.get('/check', isAuth, UsersController.checkUser);

/**
 * GET /api/user/subscribed
 * @tags user
 * @summary 取得已訂閱用戶
 * @security apiKeyAuth
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": "success",
  "data": [
    {
      "id": "userId",
      "name": "username"
    }
  ]
}
 * @return {object} 400 - error response
 * @example response - 400
{
  "status": "success",
  "message": "尚未授權"
}
 */
router.get('/subscribed', isAuth, UsersController.getSubscribedUsers);

/**
 * GET /api/user
 * @tags user
 * @summary 取得個人頁面-設定(對應設計18頁)
 * @security apiKeyAuth
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": true,
  "data": {
    "user": {
      "_id": "628f8c9bb1e02d4b681c8fe9",
      "name": "Ray",
      "email": "123@123.com",
      "photo": "123",
      "gender": "male",
      "birthday": "2022-01-01T00:00:00.000Z",
      "delflag": false,
      "createdAt": "2022-05-26T14:20:11.616Z",
      "updatedAt": "2022-05-26T14:20:11.616Z"
    },
    "postCount": 0,
    "follow": 0,
    "privatepost": 0,
    "order": 0
  }
}
 */
router.get('/', isAuth, UsersController.GetUser);

/**
 * POST /api/user/sign-in
 * @tags user
 * @summary 使用者登入
 * @security apiKeyAuth
 * @param {SignIn} request.body.required - SignIn info
 * @example request
{
  "email": "123@123.com",
  "password": "12345678"
}
 */
router.post('/sign-in', UsersController.singin);

/**
 * POST /api/user
 * @tags user
 * @summary 註冊使用者
 * @security apiKeyAuth
 * @param {SignUp} request.body.required - SignUp info
 * @example request
{
  "name": "Ray",
  "email": "123@123.com",
  "photo": "",
  "birthday": "2022-01-01",
  "gender": "male || female",
  "password": "12345678",
  "confirmPassword": "12345678",
  "memo": "test"
}
 */
router.post('/', UsersController.CreateUser);

/**
 * POST /api/user/forgot_password
 * @tags user
 * @summary 忘記密碼
 * @security apiKeyAuth
 * @param {ForgotPassword} request.body.required - ForgotPassword info
 * @example request
{
  "email": "123@12333.com"
}
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": "true",
  "data": {
    "message": "忘記密碼，發送mail成功!"
  }
}
 * @return {object} 400 - error response
 * @example response - 400
{
  "status": "ERROR",
  "message": "smtp 錯誤訊息"
}
 */
router.post('/forgot_password', UsersController.forgotPassword);

/**
 * POST /api/user/reset_password
 * @tags user
 * @summary 重設密碼
 * @security apiKeyAuth
 * @param {ResetPassword} request.body.required - ForgotPassword info
 * @example request
{
  "password": "12345678",
  "confirmPassword": "12345678"
}
 */
router.post('/reset_password', isAuth, UsersController.updatePassword);

/**
 * GET /api/user/{id}
 * @tags user
 * @summary 取得使用者詳細資訊 OK
 * @param {string} id.path.required - userId
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": true,
  "data": {
    "user": {
      "_id": "628f8c9bb1e02d4b681c8fe9",
      "name": "Ray",
      "email": "123@123.com",
      "photo": "123",
      "gender": "male",
      "birthday": "2022-01-01T00:00:00.000Z",
      "delflag": false,
      "createdAt": "2022-05-26T14:20:11.616Z",
      "updatedAt": "2022-05-26T14:20:11.616Z"
    },
    "postCount": 0,
    "follow": 0,
    "privatepost": 0,
    "order": 0
  }
}
 */
router.get('/:id', UsersController.GetUserById);

/**
 * DELETE /api/user/{email}
 * @tags user
 * @summary 刪除使用者 (軟刪除)
 * @param {string} email.path.required - user email
 */
router.delete('/:email', UsersController.delUser);
/**
	 * PATCH /api/user/
   * @tags user
   * @summary 修改使用者 OK   
   * @security apiKeyAuth
   * @param {SignIn} request.body.required - SignIn info
   * @example request
    {
      "name":"123",
      "photo": "",
      "birthday": "2022-01-01",
      "gender": "male",
      "memo": "test"
    }
    * @return {object} 200 - success response
    * @example response - 200
    {
      "status": "success",
      "data": {
        "followers": [],
        "_id": "628f8c9bb1e02d4b681c8fe9",
        "name": "123",
        "email": "123@123.com",
        "photo": "",
        "gender": "male",
        "birthday": "2022-01-01T00:00:00.000Z",
        "delflag": false,
        "createdAt": "2022-05-26T14:20:11.616Z",
        "updatedAt": "2022-06-03T16:21:04.073Z",
        "following": [
          "628f8b08634ef4666583501b"
        ],
        "memo": "test",
        "id": "628f8c9bb1e02d4b681c8fe9"
      }
    }
	 */
router.patch('/', isAuth, UsersController.EditUser);

module.exports = router;
