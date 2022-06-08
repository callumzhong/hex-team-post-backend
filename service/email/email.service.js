const transporter = require('./transporter');

module.exports = {
	/**
	 * @param {object} template - email 內容物件
	 * @param {string} template.to - 收信人 email
	 * @param {string} template.subject - 主旨
	 * @param {string} template.text - 文字內容 (權重低於 html)
	 * @param {string} template.html - html 內容 (權重高於 text)
	 * @param {function} callback -  參數參考文件 https://nodemailer.com/transports/sendmail/
	 */
	send: async (template, callback) => {
		transporter.verify((error, success) => {
			if (error) {
				console.error(error);
			}
		});

		transporter.sendMail(
			{
				from: `"MetaWall " <${process.env.EMAIL_USER}>`, // sender address
				to: template.to, // list of receivers
				subject: template.subject, // Subject line
				html: template.html,
			},
			callback,
		);
	},
};
