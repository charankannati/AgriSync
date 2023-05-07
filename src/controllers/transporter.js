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
    // const userInfo = await contract.methods.getUserInfo(req.para).call();
    // if (userInfo.role !== '2') {
    //   throw new Error('You do not have the transporter role');
    // }

    // call the 'handlePackage' function on the contract
    const result = await contract.methods.transporterHandlePackage(req.body.address, req.body.Ttype, req.body.cid).send({ from: req.params.account });

    // log the transaction hash if successful
    res.status(200).json({Transaction: result});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error handling package'
  });
  }
}

module.exports = {
  transporterHandlePackage
};
