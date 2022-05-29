const { Success } = require("../service/appError");
const commentServive = require("../service/comment.servive");
const ErrorHandler = require("../service/errorHandler");

module.exports = {	
    created:async (req,res,next) => {
        try{
            /**
             * 
             * #swagger.parameters['obj'] = {
                    in: 'body',
                    description: '資料格式',
                    schema:{
                        $comment:'留言'
                    }
                }*/
            const {comment} = req.body;
            const PostId =req.params.PostId;            
            if(PostId==undefined){
                return ErrorHandler(new Error("文章id有誤"),req,res,next);
            }
            if(comment==undefined){
                return ErrorHandler(new Error("留言內容有誤"),req,res,next);
            }
            const Newcomment=await commentServive.created(req);
            Success(res,Newcomment);
           
      }catch(err){
       return ErrorHandler(err,req,res,next); 
      }
    },
    delete:async (req,res,next) => {
        try{
            const commentid =req.params.id;
            if(commentid==undefined){
                return ErrorHandler(new Error("留言id有誤"),req,res,next);
            }
            const comment=await commentServive.delete(commentid);
            Success(res,comment);
           
      }catch(err){
       return ErrorHandler(err,req,res,next); 
      }
    }
};