const express = require('express');

const router = express.Router();
const ownerController = require('../controllers/owner');

router.post('/register-user', async (req, res) => {
    try {
        await ownerController.registerUser(req.body);
        res.send('User registered successfully');
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error registering the user");
    }
});

router.get('/get-user', async (req, res) => {
    try {
        const user = await ownerController.getUser(req.body.address);
        res.send(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error getting user details");
    }
});

router.patch('/change-user-role', async (req, res) => {
    try {
        await ownerController.changeUserRole(req.body.role,req.body.address);
        res.send("User role changed");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error getting user details");
    }
});

module.exports = router;