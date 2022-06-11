const multer = require('multer');
const path = require('path');
const upload = multer({
	limits: {
		fileSize: 2 * 1024 * 1024,
	},
	fileFilter(req, file, cb) {
		const reqfileSize = parseInt(req.headers["content-length"]);
		const ext = path.extname(file.originalname).toLowerCase();
		if(2 * 1024 * 1024 < reqfileSize){
			cb(new Error(`小於2M以下檔案。`));
		}
		if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg' && fileSize <= 1282810) {
			cb(new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。'));
		}
		cb(null, true);
	},
}).any();

module.exports = upload;
