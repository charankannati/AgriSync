const Web3 = require('web3');
const SupplyChain = require('../../build/contracts/SupplyChain.json');
require('dotenv').config();

// Initialize web3 object
const web3 = new Web3('http://localhost:7545');

// Connect to the smart contract
const contract = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);

module.exports = {

    // Create a new user and assign role
    registerUser: async (user) => {
        // Create a new user object
        
        const name = web3.utils.padRight(web3.utils.fromAscii(user.name), 64);
        const location = user.location;
        const role = Number(user.role);
        const address = user.address;
        // Call the create user function in the smart contract
        await contract.methods.registerUser(name, location, role, address).send({ from: process.env.OWNER_ADDRESS, gas:10000000})
            .then(receipt => {
                console.log('User created: ', receipt);
            })
            .catch(error => {
                console.error('Error creating user: ', error);
            });
    },

    // Get a user profile
    getUser: async (address) => {
        // Call the get user function in the smart contract
        const user = contract.methods.getUserInfo(address).call()
            .catch(error => {
                console.error('Error getting user: ', error);
            });
        return user;
    },

    // Change a user's role
    changeUserRole: async (role,address) => {
        // Call the change user role function in the smart contract
        contract.methods.changeUserRole(role, address).send({ from:process.env.OWNER_ADDRESS })
            .then(receipt => {
                console.log('User role changed: ', receipt);
            })
            .catch(error => {
                console.error('Error changing user role: ', error);
            });
    },

    // Certify a crop
    certifyCrop: async (cropId) => {
        // Call the certify crop function in the smart contract
        contract.methods.certifyCrop(cropId).send({ from: process.env.OWNER_ADDRESS })
            .then(receipt => {
                console.log('Crop certified: ', receipt);
            })
            .catch(error => {
                console.error('Error certifying crop: ', error);
            });
    }
}