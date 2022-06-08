const crypto = require('crypto');
const hostURL = process.env.HOST_URL;
const merchantID = process.env.MERCHANT_ID; // 商店編號
const hashKey = process.env.HASH_KEY; // API 金鑰
const hashIV = process.env.HASH_IV; // API 金鑰
const payGateWay = 'https://ccore.newebpay.com/MPG/mpg_gateway'; // 付款網址
const returnURL = `${hostURL}/newebpay/blank`; // 支付完成跳轉網址
const notifyURL = `${hostURL}/newebpay/callback`; // 支付通知網址
const clientBackURL = `${hostURL}`; // 支付取消跳轉網址

const plainTextData = (tradeInfo) => {
	const results = [];
	for (let keyValuePair of Object.entries(tradeInfo)) {
		results.push(`${keyValuePair[0]}=${keyValuePair[1]}`);
	}
	return results.join('&');
};

const encrypt = (tradeInfo) => {
	let encrypt = crypto.createCipheriv('aes256', hashKey, hashIV);
	let enc = encrypt.update(plainTextData(tradeInfo), 'utf8', 'hex');
	return enc + encrypt.final('hex');
};

const decrypt = (encrypted) => {
	let decrypt = crypto.createDecipheriv('aes256', hashKey, hashIV);
	decrypt.setAutoPadding(false);
	let text = decrypt.update(encrypted, 'hex', 'utf8');
	let plainText = text + decrypt.final('utf8');
	let result = plainText.replace(/[\x00-\x20]+/g, '');
	return result;
};

const shaHash = (encrypted) => {
	return crypto
		.createHash('sha256')
		.update(`HashKey=${hashKey}&${encrypted}&HashIV=${hashIV}`)
		.digest('hex')
		.toUpperCase();
};

module.exports = {
	setTradeInfo: ({ amount, desc, email }) => {
		const data = {
			MerchantID: merchantID, // 商店代號
			RespondType: 'JSON', // 回傳格式
			TimeStamp: Date.now(), // 時間戳記
			Version: 2.0, // 串接程式版本
			MerchantOrderNo: +Date.now(), // 商店訂單編號
			Amt: amount, // 訂單金額
			ItemDesc: desc, // 產品名稱
			ReturnURL: returnURL, // 支付完成返回商店網址
			NotifyURL: notifyURL, // 支付通知網址/每期授權結果通知
			ClientBackURL: clientBackURL, // 支付取消返回商店網址
			Email: email, // 交易完成通知付款人電子信箱
			LoginType: 0, // 藍新金流會員 0 不需要登入 1 需要登入
			OrderComment: '此為測試金流，測試用卡號 4000-2211-1111-1111，其餘可亂填', // 商店備註
		};
		const tradeInfo = encrypt(data);
		const tradeSha = shaHash(tradeInfo);

		return {
			MerchantID: merchantID, // 商店代號
			TradeInfo: tradeInfo, // 加密後參數
			TradeSha: tradeSha,
			Version: data.Version, //串接程式版本
			PayGateWay: payGateWay,
			MerchantOrderNo: data.MerchantOrderNo,
		};
	},
	getDecryptTradeInfo: (encryptedData) => {
		return JSON.parse(decrypt(encryptedData));
	},
};
