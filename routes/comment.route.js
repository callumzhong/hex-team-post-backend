var express = require('express');
const commentController = require('../controllers/comment.controller');
const { isAuth } = require('../service/authService');
var router = express.Router();

router.post('/:PostId/comment',isAuth,
/**
	 * #swagger.tags = ['comment']
	 * #swagger.summary = '文章留言 OK'
     * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
    /**
             * 
             * #swagger.parameters['obj'] = {
                    in: 'body',
                    description: '資料格式',
                    schema:{
                        $comment:'留言'
                    }
                }*/
commentController.created
);
router.delete('/:id',isAuth,
/**
	 * #swagger.tags = ['comment']
	 * #swagger.summary = '文章留言刪除 OK'
     * #swagger.security = [{ "apiKeyAuth": [] }]
	 */
commentController.delete
);
module.exports = router;