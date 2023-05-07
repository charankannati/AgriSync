const express = require('express');
const router = express.Router();
const wholesalerController = require('../controllers/wholesaler');

router.post('/recieve-products', wholesalerController.wholesalerReceivedProducts);
//router.post('/create-product', processorController.processorCreatesNewProduct);
router.put('/request-package', wholesalerController.requestPackage);
router.get('/view-received-products', wholesalerController.viewRecievedCrops);
router.get('/view-product', wholesalerController.viewProduct);
router.post('/send-package', wholesalerController.sendPackage);

module.exports = router;