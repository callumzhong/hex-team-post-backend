const express = require('express');
const router = express.Router();
const PostController = require('../controllers/posts');

router.get(
	'/',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.description = '取得依分頁取得貼文'
	 */
	PostController.getPagination,
);
router.get(
	'/:id',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.description = '取得指定 ID 貼文'
	 */
	PostController.getOne,
);
router.post(
	'/',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.description = '新增貼文'
	 */
	PostController.created,
);
router.patch(
	'/:id',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.description = '更新貼文'
	 */
	PostController.updated,
);
router.delete(
	'/',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.description = '刪除全部貼文'
	 */
	PostController.deleteAll,
);
router.delete(
	'/:id',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.description = 刪除指定 ID 貼文'
	 */
	PostController.deleteOne,
);

module.exports = router;
