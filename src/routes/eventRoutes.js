const express = require('express');
const router = express.Router();
const eventController = require('../controllers/events');



router.get('/requests/:account', eventController.viewRequests);
router.post('/verifyBuyer/:account', eventController.verifyBuyer);
router.get('/responses/:account', eventController.viewResponses);
router.post('/verifySeller/:account', eventController.verifySeller);

module.exports = router;
