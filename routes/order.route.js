const express = require('express');
const OrderController = require('../controllers/order.controller');
const { isAuth } = require('../service/auth.service');
const router = express.Router();

router.post('/', isAuth, OrderController.created);
router.get('/status', OrderController.getStatus);

module.exports = router;
