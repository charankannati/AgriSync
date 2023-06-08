const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions');

router.get('/get-all-txns', transactionsController.getAllTransactions);

module.exports = router;
