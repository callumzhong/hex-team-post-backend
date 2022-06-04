var express = require('express');
const commentController = require('../controllers/comment.controller');
const { isAuth } = require('../service/auth.service');
var router = express.Router();

/**
 * A comment
 * @typedef {object} Comment
 * @property {string} comment.required - 留言
 */

/**
 * POST /api/comment/{PostId}/comment
 * @tags comment
 * @summary 文章留言 OK
 * @security apiKeyAuth
 * @param {Comment} request.body.required - comment info
 * @param {string} PostId.path.required - 貼文編號
 */
router.post('/:PostId/comment', isAuth, commentController.created);
/**
 * DELETE /api/comment/{id}
 * @tags comment
 * @summary 文章留言刪除 OK
 * @security apiKeyAuth
 * @param {string} id.path.required - 留言編號
 */
router.delete('/:id', isAuth, commentController.delete);
module.exports = router;
