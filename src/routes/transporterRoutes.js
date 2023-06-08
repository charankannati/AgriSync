const express = require('express');

const router = express.Router();
const transporterController = require('../controllers/transporter');

router.post('/handle-package/:account', async (req, res) => {
    try {
        await transporterController.transporterHandlePackage(req,res);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error picking the crop package");
    }
});


module.exports = router;