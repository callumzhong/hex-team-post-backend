const express = require('express');
const postsController = require('../controllers/posts.controller');
const router = express.Router();
const PostController = require('../controllers/posts.controller');
const { isAuth } = require('../service/auth.service');

/**
 * @typedef {object} AddPost
 * @property {string} tags.required
 * @property {string} image.required
 * @property {string} content.required
 * @property {string} contentType.required
 */

/**
 * @typedef {object} AddPrivatePost
 * @property {string} tags.required
 * @property {string} image.required
 * @property {string} content.required
 * @property {string} contentType.required
 * @property {number} pay.required
 */

/**
 * GET /api/posts
 * @tags posts
 * @summary 取得依分頁取得貼文OK
 * @security apiKeyAuth
 * @param {string} page.query - 分頁數
 * @param {string} q.query - 查詢
 * @param {string} sort.query - 請輸入 asc || desc 兩種排序
 * @param {string} like.query - user id 查看我按讚的文章
 * @return {object} 200 - success response
 * @example response - 200
{
  "data": [
    {
      "_id": "6274caa22a6bd4d1ecd8af05",
      "tags": [
        "旅遊"
      ],
      "type": "group",
      "image": "https://unsplash.com/photos/gKXKBY-C-Dk",
      "content": "今天去看貓",
      "likes": 99,
      "comments": 1
    }
  ],
  "pagination": {
    "total_pages": 1,
    "current_page": 1,
    "has_pre": false,
    "has_next": false
  }
}
 */
router.get('/', isAuth, PostController.getPagination);

/**
 * GET /api/posts/normal
 * @tags posts
 * @summary 取得一般貼文的(前10筆)不須登入 *
 * @param {string} page.query - 分頁數
 * @param {string} q.query - 查詢
 * @param {string} sort.query - 請輸入 asc || desc 兩種排序
 * @param {string} like.query - user id 查看我按讚的文章
 * @return {object} 200 - success response
 * @example response - 200
{
  "data": [
    {
      "_id": "6274caa22a6bd4d1ecd8af05",
      "tags": [
        "旅遊"
      ],
      "type": "group",
      "image": "https://unsplash.com/photos/gKXKBY-C-Dk",
      "content": "今天去看貓",
      "likes": 99,
      "comments": 1
    }
  ],
  "pagination": {
    "total_pages": 1,
    "current_page": 1,
    "has_pre": false,
    "has_next": false
  }
}
 */
router.get('/normal', PostController.getPaginationBynormal);

/**
 * GET /api/posts/diary
 * @tags posts
 * @summary 取得私密日記本貼文依分頁 (已排除登入者私密貼文)
 * @security apiKeyAuth
 * @param {string} page.query - 分頁數
 * @param {string} q.query - 查詢
 * @param {string} sort.query - 請輸入 asc || desc 兩種排序
 * @param {string} like.query - user id 查看我按讚的文章
 * @return {object} 200 - success response
 * @example response - 200
{
  "data": [
    {
      "_id": "6274caa22a6bd4d1ecd8af05",
      "tags": [
        "旅遊"
      ],
      "type": "group",
      "image": "https://unsplash.com/photos/gKXKBY-C-Dk",
      "content": "今天去看貓",
      "likes": 99,
      "comments": 1
    }
  ],
  "pagination": {
    "total_pages": 1,
    "current_page": 1,
    "has_pre": false,
    "has_next": false
  }
}
 */
router.get('/diary', isAuth, PostController.getPaginationByDiary);

/**
 * GET /api/posts/private
 * @tags posts
 * @summary 取得個人私密貼文(前10筆) OK
 * @security apiKeyAuth
 */
router.get('/private/', isAuth, PostController.getPrivatebyAuth);

/**
 * GET /api/posts/{userId}
 * @tags posts
 * @summary 一般帶入使用者ID(前10筆) OK2
 * @param {string} userId.path.required - userId
 */
router.get('/:Userid', PostController.getUserAll);
/**
 * GET /api/posts/getOne/{id}
 * @tags posts
 * @summary 取得指定 ID 貼文 OK
 * @param {string} id.path.required - PostId
 */
router.get('/getOne/:id', PostController.getOne);
/**
 * GET /api/posts/order/likes
 * @tags posts
 * @summary 取得熱門文章
 * @return {object} 200 - success response
 * @example response - 200
 {
  "status": "success",
  "data": [
    {
      "_id": "6298df453b84eb47c3e1a60b",
      "user": {
        "_id": "628e4bbfad29e4c054c9f380",
        "name": "曾",
        "email": "lionmo2391@gmail.com",
        "gender": "male",
        "birthday": "2022-05-13T00:00:00.000Z",
        "delflag": false,
        "createdAt": "2022-05-25T15:31:11.774Z",
        "updatedAt": "2022-06-05T13:59:49.015Z",
        "following": [
          "6291e520cbbe05860f8d8c15",
          "628c84d55e2ce69036fa90aa",
          "6298f3d93b84eb47c3e1a806",
          "6298f3663b84eb47c3e1a7ea",
          "6290d6365f4b4c5971539031"
        ],
        "followers": [
          "6298f3663b84eb47c3e1a7ea"
        ],
        "photo": "https://i.imgur.com/ZSwaVpt.jpg",
        "id": "628e4bbfad29e4c054c9f380"
      },
      "likes": [
        "6290d6365f4b4c5971539031",
        "6298f3663b84eb47c3e1a7ea",
        "628e4bbfad29e4c054c9f380"
      ],
      "likeSize": 3
    }]
  }
 */
router.get('/order/likes',postsController.getOrderlikes);
/**
 * GET /api/posts/order/users
 * @tags posts
 * @summary 取得熱門創作者
 * @return {object} 200 - success response
 * @example response - 200
  {
    "status": "success",
    "data": [
      {
        "_id": {
          "_id": "628e4bbfad29e4c054c9f380",
          "name": "曾",
          "email": "lionmo2391@gmail.com",
          "gender": "male",
          "birthday": "2022-05-13T00:00:00.000Z",
          "delflag": false,
          "createdAt": "2022-05-25T15:31:11.774Z",
          "updatedAt": "2022-06-06T16:30:31.591Z",
          "following": [
            "6291e520cbbe05860f8d8c15",
            "628c84d55e2ce69036fa90aa",
            "6298f3d93b84eb47c3e1a806",
            "6298f3663b84eb47c3e1a7ea",
            "6290d6365f4b4c5971539031"
          ],
          "followers": [
            "6298f3663b84eb47c3e1a7ea"
          ],
          "photo": "https://i.imgur.com/m2Fyea9.jpg",
          "id": "628e4bbfad29e4c054c9f380"
        },
        "totalsum": 10
      },
      {
        "_id": {
          "_id": "6298f3663b84eb47c3e1a7ea",
          "name": "Ray123",
          "email": "tingchun0131@gmail.com",
          "photo": "https://i.imgur.com/734sNQX.jpg",
          "gender": "male",
          "birthday": "2022-06-10T00:00:00.000Z",
          "delflag": false,
          "following": [
            "628c84d55e2ce69036fa90aa",
            "628e4bbfad29e4c054c9f380"
          ],
          "followers": [
            "628e4bbfad29e4c054c9f380"
          ],
          "createdAt": "2022-06-02T17:29:10.599Z",
          "updatedAt": "2022-06-05T10:45:46.459Z",
          "__v": 0,
          "id": "6298f3663b84eb47c3e1a7ea"
        },
        "totalsum": 1
      }
    ]
  }
 */ 
router.get('/order/users',postsController.getOrderUsers);
/**
 * GET /api/posts/getOne/{id}/verified
 * @tags posts
 * @summary 取得指定 ID 貼文 (需登入)
 * @security apiKeyAuth
 * @param {string} id.path.required - PostId
 */
router.get('/getOne/:id/verified', isAuth, PostController.getOneByHasSignIn);

/**
 * GET /api/posts/private/{id}
 * @tags posts
 * @summary 取得一般私密貼文(前10筆) OK
 * @param {string} id.path.required - userId
 */
router.get('/private/:id', PostController.getPrivatebyUserID);

/**
 * POST /api/posts
 * @tags posts
 * @summary 新增一般貼文 (對應設計8頁)OK
 * @security apiKeyAuth
 * @param {AddPost} request.body.required - post info
 * @example request
{
  "tags": "",
  "image": "https://i.imgur.com/ffCSS4H_d.webp?maxwidth=520&shape=thumb&fidelity=high",
  "content": "新增貼文",
  "contentType": "photography ,article"
}
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": true,
  "data": {
    "user": "628f8c9bb1e02d4b681c8fe9",
    "tags": [
      ""
    ],
    "type": "person",
    "image": "https://i.imgur.com/ffCSS4H_d.webp?maxwidth=520&shape=thumb&fidelity=high",
    "content": "https://i.imgur.com/ffCSS4H_d.webp?maxwidth=520&shape=thumb&fidelity=high",
    "likes": 0,
    "comments": 0,
    "_id": "6290ef2bbb78cbd2b7693e5c",
    "createdAt": "2022-05-27T15:32:59.325Z",
    "updatedAt": "2022-05-27T15:32:59.325Z"
  }
}
 */
router.post('/', isAuth, PostController.created);

/**
 * POST /api/posts/private
 * @tags posts
 * @summary 新增私密貼文(對應設計11頁)OK
 * @security apiKeyAuth
 * @param {AddPrivatePost} request.body.required - post info
 * @example request
 {
	 "tags": "",
	 "image": "https://i.imgur.com/ffCSS4H_d.webp?maxwidth=520&shape=thumb&fidelity=high",
	 "content": "新增貼文",
	 "contentType": "photography ,article",
	 "pay": 5
 }
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": true,
  "data": {
    "user": "628f8c9bb1e02d4b681c8fe9",
    "tags": [
      ""
    ],
    "type": "person",
    "image": "https://i.imgur.com/ffCSS4H_d.webp?maxwidth=520&shape=thumb&fidelity=high",
    "content": "https://i.imgur.com/ffCSS4H_d.webp?maxwidth=520&shape=thumb&fidelity=high",
    "likes": 0,
    "comments": 0,
    "_id": "6290ef2bbb78cbd2b7693e5c",
    "createdAt": "2022-05-27T15:32:59.325Z",
    "updatedAt": "2022-05-27T15:32:59.325Z"
  }
}
 */
router.post('/private', isAuth, PostController.createdPrivate);

/**
 * POST /api/posts/like/{id}
 * @tags posts
 * @summary 新增like貼文(對應設計11頁)OK
 * @security apiKeyAuth
 * @param {string} id.path.required - postId
 */
router.post('/like/:id', isAuth, PostController.createdlike);

/**
 * PUT /api/posts/{id}
 * @tags posts
 * @summary 更新貼文OK
 * @security apiKeyAuth
 * @param {string} id.path.required - postId
 * @param {AddPost} request.body.required - post info
 * @example request
{
  "tags": "",
  "image": "https://i.imgur.com/ffCSS4H_d.webp?maxwidth=520&shape=thumb&fidelity=high",
  "content": "新增貼文",
  "contentType": "photography ,article"
}
 */
router.put('/:id', isAuth, PostController.updated);

/**
 * DELETE /api/posts
 * @tags posts
 * @summary 刪除全部貼文OK
 * @security apiKeyAuth
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": "success",
  "data": {
    "message": "刪除全部文章成功!"
  }
}
 * @return {object} 400 - error response
 * @example response - 400
{
  "status": "ERROR",
  "message": "刪除文章失敗"
}
 */
router.delete('/', isAuth, PostController.deleteAll);

/**
 * DELETE /api/posts/{id}
 * @tags posts
 * @summary 刪除指定 ID 貼文OK
 * @security apiKeyAuth
 * @param {string} id.path.required - 貼文編號
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": "success",
  "data": {
    "message": "刪除文章成功!"
  }
}
 * @return {object} 400 - error response
 * @example response - 400
{
  "status": "ERROR",
  "message": "刪除文章失敗"
}
 */
router.delete('/:id', isAuth, PostController.deleteOne);

/**
 * DELETE /api/posts/like/{id}
 * @tags posts
 * @summary 刪除like貼文(對應設計11頁)OK
 * @security apiKeyAuth
 * @param {string} id.path.required - userId
 */
router.delete('/like/:id', isAuth, PostController.unlike);

module.exports = router;
