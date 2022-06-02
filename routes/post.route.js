const express = require('express');
const router = express.Router();
const PostController = require('../controllers/posts.controller');
const { isAuth } = require('../service/auth.service');

router.get(
	'/', isAuth,
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '取得依分頁取得貼文OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	PostController.getPagination,
);
router.get(
	'/normal',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '取得一般貼文的(前10筆)不須登入'	 *
	 */
	PostController.getPaginationBynormal,
);
router.get(
	'/private/',
	isAuth,
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '取得個人私密貼文(前10筆) OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	PostController.getPrivatebyAuth,
);
router.get(
	'/:Userid',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '一般帶入使用者ID(前10筆) OK2'
	 * 
	 */
	PostController.getUserAll,
);
router.get(
	'/:id',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '取得指定 ID 貼文(前10筆) OK'
	 */
	PostController.getOne,
);
router.get(
	'/private/:id',
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '取得一般私密貼文(前10筆) OK'
	 */
	PostController.getPrivatebyUserID,
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
router.post(
	'/like/:id', 
	isAuth,
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '新增like貼文(對應設計11頁)OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	 PostController.createdlike
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
router.delete(
	'/like/:id', 
	isAuth,
	/**
	 * #swagger.tags = ['posts']
	 * #swagger.summary = '刪除like貼文(對應設計11頁)OK'
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
	 PostController.unlike
);

module.exports = router;
