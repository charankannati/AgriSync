const Web3 = require('web3');
const SupplyChain = require('../../build/contracts/SupplyChain.json')
const Product = require('../../build/contracts/Product.json')
const Crop = require('../../build/contracts/Crop.json')
const Transactions = require('../../build/contracts/Transactions.json')

const web3 = new Web3('http://localhost:7545'); // Replace with your Ethereum node URL

const supplyChainContract = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);

exports.processorReceivedCrops = async (req, res) => {
  async function verifySignature(sellerAddress, signature) {
    let v = '0x' + signature.slice(130, 132).toString();
    let r = signature.slice(0, 66).toString();
    let s = '0x' + signature.slice(66, 130).toString();
    let messageHash = web3.eth.accounts.hashMessage(req.body.address);
    let verificationOutput = await supplyChainContract.methods.verify(sellerAddress, messageHash, v, r, s).call({from: req.params.account});
    
    return verificationOutput;
  }

  try {
    //const result = await supplyChainContract.methods.processorReceivedCrops(req.body.address).send({ from: req.body.sender });
    let txn=0;
    let crop = new web3.eth.Contract(Crop.abi, req.body.address);
    let data = await crop.methods.getSuppliedCrops().call({from: req.params.account});
    console.log("==================================");
    console.log(await crop.methods.getCropStatus().call({from: req.params.account}));
    let events = await supplyChainContract.getPastEvents('sendEvent', {filter: {packageAddr: req.body.address}, fromBlock: 0, toBlock: 'latest'});
    events = events.filter((event) => {
      return event.returnValues.packageAddr == req.body.address;
    });
    let farmer = data[3];
    let signature = events[0]['returnValues'][3];
    let verificationOutput = await verifySignature(farmer, signature);
    if(verificationOutput) {
      console.log("Signature verified!")
      await supplyChainContract.methods.processorReceivedCrops(req.body.address).send({from: req.params.account})
        .once('receipt', async (receipt) => {
          let txnContractAddress = data[6];
          let transporterAddress = data[4];
          let txnHash = receipt.transactionHash;
          const transactions = new web3.eth.Contract(Transactions.abi, txnContractAddress);
          let txns = await transactions.methods.getAllTransactions().call({from: req.params.account});
          let prevTxn = txns[txns.length - 1][0];
          txn = await transactions.methods.createTxnEntry(txnHash, transporterAddress, account, prevTxn, '10', '10').send({from: req.params.account});
        });
    }
    res.status(200).json({
      message:"Received Product Successfully",
      transaction:txn
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to Receive crop' });
  }
};

exports.processorCreatesNewProduct = async (req, res) => {
  try {
    var d = web3.utils.padRight(web3.utils.fromAscii(description), 64);
    await supplyChainContract.methods.processorCreatesNewProduct(req.params.account, d, req.body.crops, req.body.quantity, req.body.transporters).send({ from: req.params.account })
    .once('receipt', async (receipt) => {
      console.log(receipt);
      var productAddresses = await supplyChainContract.methods.getAllCreatedMedicines().call({ from: req.params.account });
      let productAddress = productAddresses[productAddresses.length - 1];
      const product = new web3.eth.Contract(Product.abi, productAddress);
      let data = await product.methods.getProductInfo().call({ from: req.params.account });
      let txnContractAddress = data[7];
      let txnHash = receipt.transactionHash;
      const transactions = new web3.eth.Contract(Transactions.abi, txnContractAddress);
      txn = await transactions.methods.createTxnEntry(txnHash, req.params.account, medicineAddress, txnHash, '10', '10').send({ from: req.params.account }); //TODO: get user location -> (latitude, longitude)
    })
    res.status(200).json({
      message:"Created Product Successfully",
      transaction:txn
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create new product' });
  }
};

exports.requestPackage = async (req,res) => {
    // Create signature for package request using processor private key
    const message = req.body.packageId;
    const signature = web3.eth.accounts.sign(message, req.body.privateKey).signature;
    console.log(signature);
    console.log(req.params.account);
    console.log(req.body.packageId);
    console.log(req.body.farmer);
    try {
    await supplyChainContract.methods.requestProduct(req.params.account, req.body.farmer, req.body.packageId, signature).send({ from: req.params.account });
      res.status(200).json({
        message: 'Request Made to Farmer!'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to request crop' });
    }
}

exports.viewRecievedCrops = async (req, res) => {
  try {
    var cropAddress = await supplyChainContract.methods.processorGetAllCrops().call({
        from: req.params.account
    });
    res.status(200).json({
        cropAddress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
        error: 'Error getting crop addresses'
    });
  }
}

exports.getAllFarmers = async (req, res) => {
  try {
    var farmers = await supplyChainContract.methods.getAllFarmers().call({
        from: req.params.address
    });
    res.status(200).json({
        farmers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
        error: 'Error getting Farmers'
    });
  }
}

exports.viewCreatedProducts = async (req, res) => {
  try {
    var productAddresses = await supplyChainContract.methods.processorGetAllCreatedProducts().call({
        from: req.params.address
    });
    res.status(200).json({
        productAddresses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
        error: 'Error getting Products addresses'
    });
  }
}

exports.viewProduct = async (req, res) => {
  try {
    let product = new web3.eth.Contract(Product.abi, req.body.productAddress);
    let data = await product.methods.getProductInfo().call({ from: req.params.account });
    res.status(200).json({
        data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
        error: 'Error getting Product'
    });
  }
}

exports.sendPackage = async (req,res) => {
  // Create signature for package request using processor private key
  //const message = web3.utils.soliditySha3(req.body.packageId);
  //const signature = web3.eth.accounts.sign(message, req.body.privateKey);
  let product = new web3.eth.Contract(Product.abi, req.body.productAddress);
  try {
    
    supplyChain.methods.sendPackageToEntity(req.body.wholesaler, req.params.account, req.body.productAddress, req.body.signature).send({ from: req.params.account })
      .once('receipt', async (receipt) => {
        let data = await product.methods.getProductInfo().call({ from: req.params.account });
        let txnContractAddress = data[ 7 ];
        let transporterAddress = data[ 4 ][ data[ 4 ].length - 1 ];
        let txnHash = receipt.transactionHash;
        const transactions = new web3.eth.Contract(Transactions.abi, txnContractAddress);
        let txns = await transactions.methods.getAllTransactions().call({ from: req.params.account });
        let prevTxn = txns[ txns.length - 1 ][ 0 ];
        transactions.methods.createTxnEntry(txnHash, req.params.account, transporterAddress, prevTxn, '10', '10').send({ from: req.params.account });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to Send Product' });
  }
}