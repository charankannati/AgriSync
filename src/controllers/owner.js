const Web3 = require('web3');
const SupplyChain = require('../../build/contracts/SupplyChain.json');
const SupplyChain2 = require('../../build/contracts/SupplyChain2.json');
require('dotenv').config();

// Initialize web3 object
const web3 = new Web3('http://localhost:7545');

// Connect to the smart contract
const contract = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);
//const contract2 = new web3.eth.Contract(SupplyChain2.abi, SupplyChain2.networks[5777].address);

// Create a new user and assign role
const registerUser = async (req, res) => {
    try {
        // Create a new user object
        const user = req.body;
        const name = web3.utils.padRight(web3.utils.fromAscii(user.name), 64);
        const location = user.location.split();
        const role = Number(user.role);
        const address = user.address;
        // Call the create user function in the smart contract
        // if([4,5,6].includes(role)){
        //     await contract2.methods.registerUser(name, location, role, address).send({ from: process.env.OWNER_ADDRESS, gas:6721975});
        // }else{
        console.log()
        await contract.methods.registerUser(name, location, role, address).send({ from: process.env.OWNER_ADDRESS, gas:6721975});
        //}
        res.status(200).json({
            message: "User registered Successfully"
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
            error: 'Error registering user'
        });
    }
}

// Get a user profile
const getUser = async (req, res) => {
    try {
        // Call the get user function in the smart contract
        const address = req.params.address
        let user = await contract.methods.getUserInfo(address).call()
        // if(user[2]=="0")
        //    user = await contract2.methods.getUserInfo(address).call();
        res.status(200).json({
            details: user
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
            error: 'Error getting user'
        });
    }
}

// Change a user's role
const changeUserRole = async (req, res) => {
    try {
        // Call the change user role function in the smart contract
        const role = req.body.role;
        const address = req.body.address;
        let userRoleChangedMessage;
        // if([4,5,6].includes(role)){
        //     userRoleChangedMessage = await contract2.methods.changeUserRole(role, address).send({ from:process.env.OWNER_ADDRESS })
        // }else{
            userRoleChangedMessage = await contract.methods.changeUserRole(role, address).send({ from:process.env.OWNER_ADDRESS })
        // }
        res.status(200).json({
            message: userRoleChangedMessage
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
            error: 'Error changing user role'
        });
    }
}

// Certify a crop
const certifyCrop = async (req, res) => {
    try {
        // Call the certify crop function in the smart contract
        const cropId = req.cropId;
        const certifyCropMessage = await contract.methods.certifyCrop(cropId).send({ from: process.env.OWNER_ADDRESS })
        res.status(200).json({
            message: certifyCropMessage
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
            error: 'Error certifying crop'
        });
    }
}

module.exports = {
    registerUser,
    getUser,
    changeUserRole,
    certifyCrop
}