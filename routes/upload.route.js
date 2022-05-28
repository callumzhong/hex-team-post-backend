var express = require('express');
const upload = require('../service/imageService');
const uploadImg = require('../controllers/upload.controller');
const { isAuth } = require('../service/authService');
const { Success } = require('../service/appError');
var router = express.Router();

router.post('/image', upload,
	/**
	 * #swagger.tags = ['upload']
	 * #swagger.summary = '上傳圖片'
	 *
	 * #swagger.description='表單上傳<br/>  <pre>  <code>  &lt;form action=\"/api/thisismycourse2/admin/upload\" enctype=\"multipart/form-data\"  method=\"post\"&gt;<br/>  &lt;input type=\"file\" name=\"file-to-upload\"&gt;<br/>  &lt;input type=\"submit\" value=\"Upload\"&gt;<br/>  &lt;/form&gt;  </code>  </pre>'
	 */
	uploadImg.upload
);
module.exports = router;
