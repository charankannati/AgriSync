const express = require('express');
const router = express.Router();
const distributorController = require('../controllers/distributor');

router.post('/recieve-products', distributorController.distributorReceivedProducts);
//router.post('/create-product', processorController.processorCreatesNewProduct);
router.put('/request-package', distributorController.requestPackage);
router.get('/view-received-products', distributorController.viewRecievedCrops);
router.get('/view-product', distributorController.viewProduct);
router.post('/send-package', distributorController.sendPackage);

module.exports = router;