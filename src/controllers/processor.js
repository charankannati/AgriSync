const Web3 = require('web3');
const SupplyChain = require('../../build/contracts/SupplyChain.json')

const web3 = new Web3('http://localhost:7545'); // Replace with your Ethereum node URL

const supplyChainContract = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);

exports.processorReceivedCrops = async (req, res) => {
  try {
    const result = await supplyChainContract.methods.processorReceivedCrops(req.body.address).send({ from: req.body.sender });
    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to Receive crop' });
  }
};

exports.processorCreatesNewProduct = async (req, res) => {
  try {
    const result = await cropsContract.methods.processorCreatesNewProduct(req.body.description, req.body.cropAddresses, req.body.quantity, req.body.transporterAddresses, req.body.receiverAddress, req.body.receiverType).send({ from: req.body.sender });
    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create new product' });
  }
};
