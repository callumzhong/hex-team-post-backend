const PostHandler = require('../service/postHandler');
module.exports = {
	getPagination: async (req, res, next) => {
		/* #swagger.parameters['page'] = {
				in: 'query',
				description: '分頁數',
    }	*/
		/* #swagger.parameters['q'] = {
				in: 'query',
				description: '查詢',
    }	*/
		/* #swagger.parameters['sort'] = {
				in: 'query',
				description: '排序 ( arc || desc ) ',
    }	*/
		/* #swagger.parameters['like'] = {
				in: 'query',
				description: 'user id 查看我按讚的文章',
    }	*/
		/* #swagger.responses[200] = {
		  	schema: {"$ref": "#/definitions/PostPage"},
				description: "取得分頁資料" } */
		res.status(200).json();
	},
	getOne: (req, res, next) => {
		/* #swagger.responses[200] = {
		  	schema: {"$ref": "#/definitions/Post"},
				description: "取得單筆資料" } */
		res.status(200).json({});
	},
	created: (req, res, next) => {
		/* #swagger.parameters['obj'] = {
				in:'body',
				description: '貼文資料',
				required: true,
		  	schema: {"$ref": "#/definitions/PostBody"},
		} */

		/* #swagger.responses[200] = {
		  	schema: {"$ref": "#/definitions/Post"},
				description: "新增成功"
		} */
		res.status(200).json({});
	},
	updated: (req, res, next) => {
		/* #swagger.parameters['id'] = { description: '貼文 Id' } */
		/* #swagger.parameters['obj'] = {
				in:'body',
				description: '貼文資料',
				required: true,
		  	schema: {"$ref": "#/definitions/PostBody"},
		} */

		/* #swagger.responses[200] = {
		  	schema: {"$ref": "#/definitions/Post"},
				description: "更新成功" 
		}*/

		/* #swagger.responses[404] = {
				schema:"查無貼文",
				description: "更新失敗" 
		}*/
		res.status(200).json({});
	},
	deleteAll: (req, res, next) => {
		/* #swagger.responses[200] = {
				description: "刪除成功" 
		} */
		res.status(200).json({});
	},

	deleteOne: (req, res, next) => {
		/* #swagger.responses[200] = {
				description: "刪除成功" 
		} */
		/* #swagger.responses[404] = {
				schema:"查無貼文",
				description: "刪除失敗" 
		}*/
		res.status(200).json({});
	},
};
