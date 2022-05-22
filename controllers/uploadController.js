const {ImgurClient } = require("imgur");
const { Success } = require("../service/appError");
const ErrorHandler = require("../service/errorHandler");

const uploadImg={
    async upload(req,res,next){
        try{           
            if(!req.files.length) {
                return ErrorHandler(new Error('尚未上傳檔案'),req,res,next);                
              }
            //const dimensions =sizeOf(req.files[0].buffer);
            //   if(dimensions.width !== dimensions.height) {
            //     return ErrorHandler(new Error('圖片長寬不符合 1:1 尺寸。'),req,res,next); 
            //   }
            
            const client=new ImgurClient({
                clientId: process.env.IMGUR_ClientID,
                clientSecret: process.env.IMGUR_Clientsecret,
                refreshToken: process.env.IMGUR_refreshToken
            });
            const response=await client.upload({
                image:req.files[0].buffer.toString('base64'),
                type: 'base64'
            })
            /* #swagger.responses[200] = {
                schema: {"$ref": "#/definitions/UploadImage"},
                description: "上傳成功"
            } */
            Success(res,{imgUrl:response.data.link});
        }catch(err){
            return ErrorHandler(err,req,res,next);            
        }
    },
}

module.exports=uploadImg;