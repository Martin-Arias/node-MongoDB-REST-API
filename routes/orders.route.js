const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth')
const mongoose = require('mongoose');
const orderControler = require('../controllers/order.controller');

//GET ALL ORDERS
router.get('/',checkAuth,orderControler.getAllOrders);

//CREATE NEW ORDER
router.post('/',checkAuth,orderControler.createNewOrder);

//GET ORDER BY ID
router.get('/:orderId',checkAuth,orderControler.getOrderById);

//DELETE ORDER 
router.delete('/:orderId',checkAuth,orderControler.deleteOrder);

module.exports = router;