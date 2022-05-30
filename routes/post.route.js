const express = require('express');
const router = express.Router();
const PostController = require('../controllers/posts.controller');
const { isAuth } = require('../service/auth.service');

router.get(
	'/',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '取得依分頁取得貼文'
	 */
	PostController.getPagination,
);
router.get(
	'/UserAll',
	isAuth,
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '取得指定 ID 貼文 OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	PostController.getUserAll,
);
router.get(
	'/:id',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '取得指定 ID 貼文 OK'
	 */
	PostController.getOne,
);

router.post(
	'/',
	isAuth,
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '新增一般貼文 (對應設計8頁)OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	PostController.created,
);
router.post(
	'/private',
	isAuth,
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '新增私密貼文(對應設計11頁)OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	PostController.createdPrivate,
);
router.put(
	'/:id',
	isAuth,
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '更新貼文OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	PostController.updated,
);
router.delete(
	'/',
	isAuth,
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '刪除全部貼文OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	PostController.deleteAll,
);
router.delete(
	'/:id',
	isAuth,
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '刪除指定 ID 貼文OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	PostController.deleteOne,
);

module.exports = router;
