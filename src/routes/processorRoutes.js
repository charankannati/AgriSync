const express = require('express');
const router = express.Router();
const processorController = require('../controllers/processor');

router.post('/receive-package/:account', processorController.processorReceivedCrops);
router.post('/create-product', processorController.processorCreatesNewProduct);
router.put('/request-package/:account', processorController.requestPackage);
router.get('/view-received-crops/:account', processorController.viewRecievedCrops);
router.get('/view-products', processorController.viewCreatedProducts);
router.get('/view-product', processorController.viewProduct);
router.post('/send-package', processorController.sendPackage);
router.get('/get-all-farmers/:account', processorController.getAllFarmers);

module.exports = router;
