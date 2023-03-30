const express = require('express');

const router = express.Router();
const farmerController = require('../controllers/farmer');

router.post('/create-crop/:address', async (req, res) => {
    try {
        await farmerController.createCropPackage(req,res);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error Creating the crop package");
    }
});

router.get('/get-crop-count/:address', async (req, res) => {
    try {
        await farmerController.getPackageCount(req,res);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error getting Crop count");
    }
});

router.get('/get-crop-addresses/:address', async (req, res) => {
    try {
        await farmerController.getCropPackageAddresses(req,res);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error getting Crop Addresses");
    }
});


module.exports = router;