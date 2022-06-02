require('dotenv').config({
	path: './test.env',
});

/** 管理 test 執行順序 */
require('./test/products.test');
require('./test/post.test');
require('./test/order.test');
require('./test/wallet.test');
