const express = require('express');
const router = express.Router();
const processorController = require('../controllers/processor');

router.post('/processorReceivedCrops', processorController.processorReceivedCrops);
router.post('/processorCreatesNewProduct', processorController.processorCreatesNewProduct);

module.exports = router;
