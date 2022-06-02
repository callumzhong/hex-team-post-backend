const express = require('express');
const walletController = require('../controllers/wallet.controller');
const { isAuth } = require('../service/auth.service');
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

router.get(
	'/record/add-credit',
	isAuth,
	/**
	 * #swagger.tags = ['wallet']
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 * #swagger.summary = '取得儲值紀錄'
	 */
	walletController.getAddCreditRecord,
);

router.get(
	'/record/pay',
	isAuth,
	/**
	 * #swagger.tags = ['wallet']
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 * #swagger.summary = '取得購買/訂閱紀錄'
	 */
	walletController.getPayRecord,
);

router.get(
	'/record/income',
	isAuth,
	/**
	 * #swagger.tags = ['wallet']
	 * #swagger.security = [{ "apiKeyAuth": [] }]
	 * #swagger.summary = '取得銷售紀錄'
	 */
	walletController.getIncomeRecord,
);

module.exports = router;
