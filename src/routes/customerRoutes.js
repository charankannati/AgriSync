const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');

router.post('/recieve-products', customerController.cutomerReceivedProducts);
//router.post('/create-product', processorController.processorCreatesNewProduct);
router.put('/request-package', customerController.requestPackage);
router.get('/view-received-products', customerController.viewRecievedCrops);



module.exports = router;