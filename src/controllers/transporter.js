const Web3 = require('web3');
const SupplyChain = require('../../build/contracts/SupplyChain.json');
const Transporter = require('../../build/contracts/Transporter.json');
const Crop = require('../../build/contracts/Crop.json');
const Product = require('../../build/contracts/Product.json');
const ProductW_D = require('../../build/contracts/ProductW_D.json');
const ProductD_C = require('../../build/contracts/ProductD_C.json');
require('dotenv').config

// create a new instance of Web3 using a provider (e.g. MetaMask)
const web3 = new Web3('http://localhost:7545');

// get the contract address and ABI from the compiled contract

// define the transporter controller
const transporterHandlePackage = async (req, res) => {
  try {
    // check if the user has the 'transporter' role
    // const userInfo = await contract.methods.getUserInfo(req.para).call();
    // if (userInfo.role !== '2') {
    //   throw new Error('You do not have the transporter role');
    // }

    // call the 'handlePackage' function on the contract
    var result=[];
    if(req.body.Ttype == 1) { 
      /// Supplier -> Manufacturer
      const cropContract = new web3.eth.Contract(Crop.abi, req.body.address);
      result = await cropContract.methods.pickPackage(req.params.account).send({ from: req.params.account });
  } else if(req.body.Ttype == 2) { 
      /// Manufacturer -> Wholesaler
      const productContract = new web3.eth.Contract(Product.abi, req.body.address);
      result = await productContract.methods.pickProduct(req.params.account).send({ from: req.params.account });
  } else if(req.body.Ttype == 3) {   
      // Wholesaler to Distributer
      const productContract = new web3.eth.Contract(ProductW_D.abi, req.body.address);
      result = await productContract.methods.pickWD(req.body.address,req.params.account).send({ from: req.params.account });
  } else if(req.body.Ttype == 4) {   
      // Distrubuter to Customer
      const productContract = new web3.eth.Contract(ProductW_D.abi, req.body.address);
      result = await productContract.methods.pickDC(req.body.address,req.params.account).send({ from: req.params.account });
  }

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
