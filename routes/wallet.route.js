const express = require('express');
const walletController = require('../controllers/wallet.controller');
const { isAuth } = require('../service/auth.service');
const router = express.Router();

/**
 * GET /api/wallet
 * @tags wallet
 * @summary 取得當前餘額
 * @security apiKeyAuth
 */
router.get('/', isAuth, walletController.getCurrentWallet);

/**
 * GET /api/wallet/record/add-credit
 * @tags wallet
 * @summary 取得儲值紀錄
 * @security apiKeyAuth
 */
router.get('/record/add-credit', isAuth, walletController.getAddCreditRecord);

/**
 * GET /api/wallet/record/pay
 * @tags wallet
 * @summary 取得購買/訂閱紀錄
 * @security apiKeyAuth
 */
router.get('/record/pay', isAuth, walletController.getPayRecord);

/**
 * GET /api/wallet/record/income
 * @tags wallet
 * @summary 取得銷售紀錄
 * @security apiKeyAuth
 */
router.get('/record/income', isAuth, walletController.getIncomeRecord);

module.exports = router;
