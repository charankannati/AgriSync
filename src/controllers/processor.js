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
    let verificationOutput = await supplyChainContract.methods.verify(sellerAddress, messageHash, v, r, s).call({from: req.params.sender});
    
    return verificationOutput;
  }

  try {
    //const result = await supplyChainContract.methods.processorReceivedCrops(req.body.address).send({ from: req.body.sender });
    let txn=0;
    let crop = new web3.eth.Contract(Crop.abi, req.body.address);
    let data = await crop.methods.getSuppliedCrops().call({from: req.params.sender});
    let events = await supplyChain.getPastEvents('sendEvent', {filter: {packageAddr: req.body.address}, fromBlock: 0, toBlock: 'latest'});
    events = events.filter((event) => {
      return event.returnValues.packageAddr == req.body.address;
    });

    console.log(events);
    let farmer = data[3];
    let signature = events[0]['returnValues'][3];
    let verificationOutput = await verifySignature(farmer, signature);
    if(verificationOutput) {
      alert('Signature verified');
      await supplyChainContract.methods.processorReceivedPackage(req.body.address, req.params.sender, farmer, signature).send({from: req.params.sender})
        .once('receipt', async (receipt) => {
          let txnContractAddress = data[6];
          let transporterAddress = data[4];
          let txnHash = receipt.transactionHash;
          const transactions = new web3.eth.Contract(Transactions.abi, txnContractAddress);
          let txns = await transactions.methods.getAllTransactions().call({from: account});
          let prevTxn = txns[txns.length - 1][0];
          txn = await transactions.methods.createTxnEntry(txnHash, transporterAddress, account, prevTxn, '10', '10').send({from: req.params.sender});
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
    await supplyChainContract.methods.processorCreatesNewProduct(req.params.sender, d, req.body.crops, req.body.quantity, req.body.transporters).send({ from: req.params.sender })
    .once('receipt', async (receipt) => {
      console.log(receipt);
      var productAddresses = await supplyChainContract.methods.getAllCreatedMedicines().call({ from: req.params.sender });
      let productAddress = productAddresses[productAddresses.length - 1];
      const product = new web3.eth.Contract(Product.abi, productAddress);
      let data = await product.methods.getProductInfo().call({ from: req.params.sender });
      let txnContractAddress = data[7];
      let txnHash = receipt.transactionHash;
      const transactions = new web3.eth.Contract(Transactions.abi, txnContractAddress);
      txn = await transactions.methods.createTxnEntry(txnHash, req.params.sender, medicineAddress, txnHash, '10', '10').send({ from: req.params.sender }); //TODO: get user location -> (latitude, longitude)
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
    const message = web3.utils.soliditySha3(packageId);
    const signature = web3.eth.accounts.sign(message, privateKey);
    try {
    supplyChainContract.methods.requestProduct(req.params.sender, req.body.farmer, req.body.packageAddress, req.body.signature).send({ from: req.params.sender })
    .once('receipt', async (receipt) => {
        alert('Request Made to Farmer!');
        console.log(receipt);
        isLoading(false);
    })
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to request crop' });
    }
}
  

