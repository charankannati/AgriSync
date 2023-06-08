const express = require('express');
const router = express.Router();
const processorController = require('../controllers/processor');

router.post('/receive-package/:account', processorController.processorReceivedCrops);
router.post('/create-product/:account', processorController.processorCreatesNewProduct);
router.put('/request-package/:account', processorController.requestPackage);
router.get('/view-received-crop-addresses/:account', processorController.viewRecievedCrops);
router.get('/view-productaddresses/:account', processorController.viewCreatedProducts);
router.get('/view-products/:account', processorController.getProducts);
router.get('/view-product/:account', processorController.viewProduct);
router.post('/send-package/:account', processorController.sendPackage);
router.get('/get-all-farmers/:account', processorController.getAllFarmers);
router.get('/view-received-crops/:account', processorController.getReceivedCropDetails);

module.exports = router;
