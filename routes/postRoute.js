const express = require('express');
const router = express.Router();
const PostController = require('../controllers/posts');
const { isAuth } = require('../service/authService');

router.get(
	'/',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '取得依分頁取得貼文'
	 */
	PostController.getPagination,
);
router.get(
	'/:id',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '取得指定 ID 貼文'
	 */
	PostController.getOne,
);
router.post(
	'/',
	isAuth,
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '新增貼文'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	PostController.created,
);
router.patch(
	'/:id',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '更新貼文'
	 */
	PostController.updated,
);
router.delete(
	'/',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '刪除全部貼文'
	 */
	PostController.deleteAll,
);
router.delete(
	'/:id',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = 刪除指定 ID 貼文'
	 */
	PostController.deleteOne,
);

module.exports = router;
