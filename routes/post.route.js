const express = require('express');
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
 * GET /api/posts/{id}
 * @tags posts
 * @summary 取得指定 ID 貼文(前10筆) OK
 * @param {string} id.path.required - PostId
 */
router.get('/:id', PostController.getOne);
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
