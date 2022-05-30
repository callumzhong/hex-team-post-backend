const WalletService = require('../service/wallet.service');
module.exports = {
	getCurrentWallet: async (req, res, next) => {
		const wallet = await WalletService.getCurrentWallet(req.user.id);
		res.status(200).json({
			status: 'success',
			data: wallet,
		});
	},
};
