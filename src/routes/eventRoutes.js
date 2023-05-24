const express = require('express');
const router = express.Router();
const eventController = require('../controllers/events');



router.get('/requests/:account/:address', eventController.viewRequests);
router.post('/verifybuyer/:account', eventController.verifyBuyer);
router.get('/responses/:account', eventController.viewResponses);
router.post('/verifyseller/:account', eventController.verifySeller);

module.exports = router;
