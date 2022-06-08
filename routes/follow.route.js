var express = require('express');
const followController = require('../controllers/follow.controller');
const { isAuth } = require('../service/auth.service');
var router = express.Router();

/**
 * @typedef {object} AddFollow
 * @property {string} followuser - userId
 */

/**
 * GET /api/follow
 * @tags follow
 * @summary 取得個人追蹤名單OK
 * @security apiKeyAuth
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": true,
  "data": [
    {
      "_id": "6291e520cbbe05860f8d8c15",
      "user": "628f8c9bb1e02d4b681c8fe9",
      "followuser": [
        {
          "_id": "628f8b08634ef4666583501b",
          "name": "Ray",
          "photo": "1",
          "createdAt": "2022-05-26T14:13:28.064Z"
        }
      ],
      "createdAt": "2022-05-28T09:02:24.177Z",
      "__v": 0
    }
  ]
}
 */
router.get('/', isAuth, followController.getAll);

/**
 * GET /api/follow/{id}
 * @tags follow
 * @summary 取得某人追蹤名單OK
 * @param {string} id.path.required - userId
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": true,
  "data": [
    {
      "_id": "6291e520cbbe05860f8d8c15",
      "user": "628f8c9bb1e02d4b681c8fe9",
      "followuser": [
        {
          "_id": "628f8b08634ef4666583501b",
          "name": "Ray",
          "photo": "1",
          "createdAt": "2022-05-26T14:13:28.064Z"
        }
      ],
      "createdAt": "2022-05-28T09:02:24.177Z",
      "__v": 0
    }
  ]
}
 */
router.get('/:id', followController.getOne);

/**
 * GET /api/follow/{id}/Follows
 * @tags follow
 * @summary 取得某人追蹤數OK
 * @param {string} id.path.required - userId
 */
router.get('/:id/Follows', followController.getUserFollowCount);

/**
 * GET /api/follow/orders/followers
 * @tags follow
 * @summary 取得追蹤前10排名(追蹤推薦)
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": "success",
  "data": [
    {
      "_id": "628c84d55e2ce69036fa90aa",
      "name": "Ray",
      "photo": "",
      "followers": [
        "628e4bbfad29e4c054c9f380",
        "6298f3663b84eb47c3e1a7ea"
      ],
      "followersSize": 2
    }]
 }
 */
router.get('/orders/followers', followController.getUserFollowOrder);

/**
 * POST /api/follow
 * @tags follow
 * @summary 加入追蹤(對應設計4頁)OK
 * @security apiKeyAuth
 * @param {AddFollow} request.body.required - follow info
 * @example request
{
  "followuser": "6291e520cbbe05860f8d8c15"
}
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": true,
  "data": {
    "_id": "6291e520cbbe05860f8d8c15",
    "user": "628f8c9bb1e02d4b681c8fe9",
    "followuser": [
      {
        "_id": "628f8b08634ef4666583501b",
        "name": "Ray",
        "photo": "1",
        "createdAt": "2022-05-26T14:13:28.064Z"
      }
    ],
    "createdAt": "2022-05-28T09:02:24.177Z",
    "__v": 0
  }
}
 */
router.post('/', isAuth, followController.created);

/**
 * DELETE /api/follow/{followuser}
 * @tags follow
 * @summary 取消追蹤OK
 * @security apiKeyAuth
 * @param {string} followuser.path.required - userId
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": true,
  "data": {
    "_id": "6291e520cbbe05860f8d8c15",
    "user": "628f8c9bb1e02d4b681c8fe9",
    "followuser": [
      {
        "_id": "628f8b08634ef4666583501b",
        "name": "Ray",
        "photo": "1",
        "createdAt": "2022-05-26T14:13:28.064Z"
      }
    ],
    "createdAt": "2022-05-28T09:02:24.177Z",
    "__v": 0
  }
}
 */
router.delete('/:followuser', isAuth, followController.delete);

module.exports = router;
