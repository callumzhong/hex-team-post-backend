const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	host: 'smtp.office365.com',
	port: 587,
	secure: false, // upgrade later with STARTTLS
	auth: {
		user: process.env.OUTLOOK_EMAIL_USER,
		pass: process.env.OUTLOOK_EMAIL_PASS,
	},
});

module.exports = transporter;
