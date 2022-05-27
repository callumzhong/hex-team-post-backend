const express = require('express');
const walletController = require('../controllers/walletController');
const { isAuth } = require('../service/authService');
const router = express.Router();

router.get(
	'/',
	isAuth,
	/**
	 * #swagger.tags = ['wallet']
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 * #swagger.summary = '取得當前餘額'
	 */
	walletController.getCurrentWallet,
);

module.exports = router;
