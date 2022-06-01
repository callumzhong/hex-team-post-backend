const { Success } = require("../service/appError");
const ErrorHandler = require("../service/errorHandler");
const followService = require("../service/follow.service");

module.exports = {	
	getAll: async (req,res,next) => {
        /* #swagger.responses[200] = {
		  	schema: {
  "status": true,
  "data": [
    {
      "_id": "6291e520cbbe05860f8d8c15",
      "user": "628f8c9bb1e02d4b681c8fe9",
      "followuser": [
        {
          "_id": "628f8b08634ef4666583501b",
          "name": "Ray",
          "photo": "1",
          "createdAt": "2022-05-26T14:13:28.064Z"
        }
      ],
      "createdAt": "2022-05-28T09:02:24.177Z",
      "__v": 0
    }
  ]
},
				description: "取得所有個人追蹤" } */
        
       try{
             const follow=await followService.getAll(req.user.id);
             Success(res,follow);
       }catch(err){
        return ErrorHandler(err,req,res,next); 
       }
    },
    getOne: async (req,res,next) => {
         /* #swagger.responses[200] = {
		  	schema: {
  "status": true,
  "data": [
    {
      "_id": "6291e520cbbe05860f8d8c15",
      "user": "628f8c9bb1e02d4b681c8fe9",
      "followuser": [
        {
          "_id": "628f8b08634ef4666583501b",
          "name": "Ray",
          "photo": "1",
          "createdAt": "2022-05-26T14:13:28.064Z"
        }
      ],
      "createdAt": "2022-05-28T09:02:24.177Z",
      "__v": 0
    }
  ]
},
				description: "取得某個人追蹤" } */
        if(req.params.id==undefined){
            return ErrorHandler(new Error("使用者id有誤"),req,res,next);
        }
        try{
             const follow=await followService.getAll(req.params.id);
            
                Success(res,follow);
            
       }catch(err){
        return ErrorHandler(err,req,res,next); 
       }
    },
	created: async (req,res,next) => {
    /* #swagger.parameters['obj'] = {
                    in: 'body',
                    description: '新增貼文',
                    schema:{
                       followuser:'6291e520cbbe05860f8d8c15'
                    }
                }*/
		 /* #swagger.responses[200] = {
		  	schema: {
  "status": true,
  "data": {
    "_id": "6291e520cbbe05860f8d8c15",
    "user": "628f8c9bb1e02d4b681c8fe9",
    "followuser": [
      {
        "_id": "628f8b08634ef4666583501b",
        "name": "Ray",
        "photo": "1",
        "createdAt": "2022-05-26T14:13:28.064Z"
      }
    ],
    "createdAt": "2022-05-28T09:02:24.177Z",
    "__v": 0
  }
},
				description: "建立個人追蹤" } */
        try{
            const {followuser} =req.body;
            if(followuser==undefined){
                return ErrorHandler(new Error("追蹤使用者id有誤"),req,res,next);
            }
            if (followuser === req.user.id) {
              return next(errorHandle(401,'您無法追蹤自己',next));
            }
            const follow=await followService.created(req);
            Success(res,follow);
           
      }catch(err){
       return ErrorHandler(err,req,res,next); 
      }
	},
    delete: async (req,res,next)=>{
         /* #swagger.responses[200] = {
		  	schema: {
  "status": true,
  "data": {
    "_id": "6291e520cbbe05860f8d8c15",
    "user": "628f8c9bb1e02d4b681c8fe9",
    "followuser": [
      {
        "_id": "628f8b08634ef4666583501b",
        "name": "Ray",
        "photo": "1",
        "createdAt": "2022-05-26T14:13:28.064Z"
      }
    ],
    "createdAt": "2022-05-28T09:02:24.177Z",
    "__v": 0
  }
},
				description: "刪除追蹤" } */
        try{
          const userID=req.params.followuser ; 
            if(userID==undefined){
                return ErrorHandler(new Error("追蹤使用者id有誤"),req,res,next);
            }
            if (userID === req.user.id) {
              return next(errorHandle(401,'您無法取消追蹤自己',next));
            }
            
            const follow=await followService.delete(req);
            Success(res,follow);
           
      }catch(err){
       return ErrorHandler(err,req,res,next); 
      }
    },
	getUserFollowCount: async (req,res,next)=>{
        //取得某個人的追蹤數
        try{
            
                if(req.params.id==undefined){
                  return ErrorHandler(new Error("使用者id有誤"),req,res,next);
              }
            const followCount=await followService.getUserFollowCount(req.params.id);
            Success(res,followCount);
           
      }catch(err){
       return ErrorHandler(err,req,res,next); 
      }
    }

};