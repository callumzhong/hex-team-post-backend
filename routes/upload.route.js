var express = require('express');
const upload = require('../service/image.service');
const uploadImg = require('../controllers/upload.controller');
const { isAuth } = require('../service/auth.service');
var router = express.Router();

/**
 * A Image
 * @typedef {object} Image
 * @property {string} file - image - binary
 */

/**
 * POST /api/upload/image
 * @tags upload
 * @summary 上傳圖片
 * @security apiKeyAuth
 * @param {Image} request.body.required - Image info - multipart/form-data
 * @return {object} 200 - success response
 * @example response - 200
{
  "status": "success",
  "data": {
    "imgUrl": "https://i.imgur.com/w5L5wWI.jpg"
  }
}
 * @return {object} 400 - error response
 * @example response - 400
{
  "status": "error",
  "message": "檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式"
}
 */
router.post('/image', isAuth, upload, uploadImg.upload);
module.exports = router;
