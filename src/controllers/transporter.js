const Web3 = require('web3');
const SupplyChain = require('../../build/contracts/SupplyChain.json');
require('dotenv').config

// create a new instance of Web3 using a provider (e.g. MetaMask)
const web3 = new Web3('http://localhost:7545');

// get the contract address and ABI from the compiled contract
const contract = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);

// define the transporter controller
const transporterHandlePackage = async (req, res) => {
  try {
    // check if the user has the 'transporter' role
    const role = await contract.methods.getUserRole(process.env.TRANSPORTER_ADDRESS).call();
    if (role !== 'transporter') {
      throw new Error('You do not have the transporter role');
    }

    // call the 'handlePackage' function on the contract
    const result = await contract.methods.handlePackage(req.body.address, req.body.transporterType, req.body.cid).send({ from: process.env.TRANSPORTER_ADDRESS });

    // log the transaction hash if successful
    res.json({Transaction: result});
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  transporterHandlePackage
};
