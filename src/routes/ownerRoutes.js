const express = require('express');

const router = express.Router();
const ownerController = require('../controllers/owner');

router.post('/register-user', async (req, res) => {
    try {
        await ownerController.registerUser(req, res);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error calling the owner controller's method to register the user");
    }
});

router.get('/get-user/:address', async (req, res) => {
    try {
        await ownerController.getUser(req, res);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error calling the owner controller's method to get the user's details");
    }
});

router.patch('/change-user-role', async (req, res) => {
    try {
        await ownerController.changeUserRole(req, res);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error calling the owner controller's method to change the user's role");
    }
});

module.exports = router;