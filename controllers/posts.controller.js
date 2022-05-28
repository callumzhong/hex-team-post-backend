const { appError, Success } = require('../service/appError');
const ErrorHandler = require('../service/errorHandler');
const postService = require('../service/post.service');
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
	getOne: async(req, res, next) => {
		/* #swagger.responses[200] = {
		  	schema: {"$ref": "#/definitions/Post"},
				description: "取得單筆資料" } */
				try{
					if(req.params.id==undefined){
						return ErrorHandler(new Error("文章id有誤"),req,res,next);
					}
					const Post=await postService.getOne(req);
					if(Post){
						Success(res,Post);
					}else {
						return ErrorHandler(new Error("取得文章失敗"),req,res,next);
					}
				}
				catch(err){
					return ErrorHandler(err,req,res,next); 
				}
	},
	getUserAll: async(req, res, next) => {
		/* #swagger.responses[200] = {
		  	schema: {"$ref": "#/definitions/Post"},
				description: "取得單筆資料" } */
				try{					
					const Post=await postService.getUserAll(req);
					if(Post){
						Success(res,Post);
					}else {
						return ErrorHandler(new Error("取得文章失敗"),req,res,next);
					}
				}
				catch(err){
					return ErrorHandler(err,req,res,next); 
				}
	},
	created: async (req, res, next) => {
		/* #swagger.parameters['obj'] = {
                    in: 'body',
                    description: '新增貼文',
                    schema:{
                        tags:'',
                        image:'https://i.imgur.com/ffCSS4H_d.webp?maxwidth=520&shape=thumb&fidelity=high',
						$content:'新增貼文'
                    }
                }*/
		/* #swagger.responses[200] = {
		  	schema:{
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
},
				description: "新增成功"
		} */
		try{
		const{content}=req.body;
		if(content==undefined){
			return next(appError(400,"你沒有填寫 content 資料",next));
		}
		const newPost=await postService.AddPost(req);
		Success(res,newPost);
		}
		catch(err){
			return ErrorHandler(err,req,res,next); 
		}
	},
	createdPrivate: async (req, res, next) => {
		/* #swagger.parameters['obj'] = {
                    in: 'body',
                    description: '新增貼文',
                    schema:{
                        tags:'',
                        image:'https://i.imgur.com/ffCSS4H_d.webp?maxwidth=520&shape=thumb&fidelity=high',
						$content:'新增貼文',
						$pay:5
                    }
                }*/
		/* #swagger.responses[200] = {
		  	schema:{
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
},
				description: "新增成功"
		} */
		try{
		const{content,pay}=req.body;
		if(content==undefined){
			return next(appError(400,"你沒有填寫 content 資料",next));
		}
		if(pay==undefined){
			return next(appError(400,"售價未填寫",next));
		}
		const newPost=await postService.addPrivatePost(req);
		Success(res,newPost);
		}
		catch(err){
			return ErrorHandler(err,req,res,next); 
		}
	},		
	updated: async (req, res, next) => {
		/* #swagger.parameters['obj'] = {
                    in: 'body',
                    description: '新增貼文',
                    schema:{
                        tags:'',
                        image:'https://i.imgur.com/ffCSS4H_d.webp?maxwidth=520&shape=thumb&fidelity=high',
						$content:'新增貼文'
                    }
                }*/
			try{
			const{content}=req.body;
			if(content==undefined){
				return next(appError(400,"你沒有填寫 content 資料",next));
			}
			if(req.params.id==undefined){
				return ErrorHandler(new Error("文章id有誤"),req,res,next);
			}
			const Post=await postService.updated(req);
			if(Post){
				Success(res,Post);
			}else {
				return ErrorHandler(new Error("更新文章失敗"),req,res,next);
			}
		}
		catch(err){
			return ErrorHandler(err,req,res,next); 
		}
	},
	deleteAll: async(req, res, next) => {
		/* #swagger.responses[200] = {
				description: "刪除成功",
				schema:{
					"status": true,
					"data": {
						"message": "刪除全部文章成功!"
					}
					} 
		} */
		/* #swagger.responses[404] = {
				schema:{
  "status": "ERROR",
  "message": "刪除文章失敗"
},
				description: "更新失敗" 
		}*/
		try{
			const delPost=await postService.deleteAll(req);
			if(delPost.deletedCount>0){
				Success(res,{message:"刪除全部文章成功!"});
			}else {
				ErrorHandler(new Error("刪除文章失敗"),req,res,next);
			}
		}
		catch(err){
			return ErrorHandler(err,req,res,next); 
		}
	},

	deleteOne: async(req, res, next) => {
		/* #swagger.responses[200] = {
				description: "刪除成功" 
		} */
		/* #swagger.responses[404] = {
				schema:"查無貼文",
				description: "刪除失敗" 
		}*/
		try{
			if(req.params.id==undefined){
				return ErrorHandler(new Error("文章id有誤"),req,res,next);
			}
			const delPost=await postService.deleteOne(req);
			if(delPost.deletedCount>0){
				Success(res,{message:"刪除文章成功!"});
			}else {
				return ErrorHandler(new Error("刪除文章失敗"),req,res,next);
			}
		}
		catch(err){
			return ErrorHandler(err,req,res,next); 
		}
	},
};
