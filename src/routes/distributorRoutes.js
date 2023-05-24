const express = require('express');
const router = express.Router();
const distributorController = require('../controllers/distributor');

router.post('/receive-products', distributorController.distributorReceivedProducts);
//router.post('/create-product', processorController.processorCreatesNewProduct);
router.put('/request-package/:account', distributorController.requestPackage);
router.get('/view-received-products/:account', distributorController.viewRecievedCrops);
router.get('/view-product', distributorController.viewProduct);
router.post('/send-package', distributorController.sendPackage);

module.exports = router;