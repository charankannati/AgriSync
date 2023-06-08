const express = require('express');
const router = express.Router();
const wholesalerController = require('../controllers/wholesaler');

router.post('/receive-products/:account', wholesalerController.wholesalerReceivedProducts);
//router.post('/create-product', processorController.processorCreatesNewProduct);
router.put('/request-package/:account', wholesalerController.requestPackage);
router.get('/view-received-products/:account', wholesalerController.viewReceivedProducts);
router.get('/view-product', wholesalerController.viewProduct);
router.post('/send-package/:account', wholesalerController.sendPackage);
router.get('/get-all-processors/:account', wholesalerController.getAllProcessors);

module.exports = router;