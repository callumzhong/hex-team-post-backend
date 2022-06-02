const WalletService = require('../service/wallet.service');
module.exports = {
	getCurrentWallet: async (req, res, next) => {
		const wallet = await WalletService.getCurrentWallet(req.user.id);
		res.status(200).json({
			status: 'success',
			data: wallet,
		});
	},
	getAddCreditRecord: async (req, res, next) => {
		const records = await WalletService.getAddCreditRecord(req.user.id);
		res.status(200).json({
			status: 'success',
			data: records,
		});
	},
	getPayRecord: async (req, res, next) => {
		const records = await WalletService.getPayRecord(req.user.id);
		res.status(200).json({
			status: 'success',
			data: records,
		});
	},
	getIncomeRecord: async (req, res, next) => {
		const records = await WalletService.getIncomeRecord(req.user.id);
		res.status(200).json({
			status: 'success',
			data: records,
		});
	},
};
