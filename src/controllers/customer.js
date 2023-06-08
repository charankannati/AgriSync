const Web3 = require('web3');
const SupplyChain2 = require('../../build/contracts/SupplyChain2.json')
const SupplyChain = require('../../build/contracts/SupplyChain.json')
const Product = require('../../build/contracts/Product.json')
//const Crop = require('../../build/contracts/Crop.json')
const Transactions = require('../../build/contracts/Transactions.json');
//const { default: Distributor } = require('../../client/src/Components/Distributor');

const web3 = new Web3('http://localhost:7545'); // Replace with your Ethereum node URL

const supplyChainContract = new web3.eth.Contract(SupplyChain2.abi, SupplyChain2.networks[5777].address);

exports.cutomerReceivedProducts = async (req, res) => {
    async function verifySignature(sellerAddress, signature) {
        let v = '0x' + signature.slice(130, 132).toString();
        let r = signature.slice(0, 66).toString();
        let s = '0x' + signature.slice(66, 130).toString();
        let messageHash = web3.eth.accounts.hashMessage(req.body.address);
        let verificationOutput = await supplyChainContract.methods.verify(sellerAddress, messageHash, v, r, s).call({from: req.params.account});
        
        return verificationOutput;
    }

    try {
        //const result = await supplyChainContract.methods.distributerReceivedProducts(req.body.address).send({ from: req.body.sender });
        let txn=0;
        let product = new web3.eth.Contract(Product.abi, req.body.address);
        let data = await product.methods.getProductInfo().call({from: req.params.account});
        let events = await supplyChainContract.getPastEvents('sendEvent', {filter: {packageAddr: req.body.address}, fromBlock: 0, toBlock: 'latest'});
        events = events.filter((event) => {
            return event.returnValues.packageAddr == req.body.address;
        });

        console.log(events);
        let distributor = data[8];
        let signature = events[events.length-1]['returnValues'][3];
        let verificationOutput = await verifySignature(distributor, signature);
        if(verificationOutput) {
        alert('Signature verified');
        let subcontractAddress = await supplyChainContract.methods.getSubContractDC(req.body.address).call({ from: req.params.account });
        await supplyChainContract.methods.customerReceivedProduct(req.body.address, subcontractAddress).send({from: req.params.account})
            .once('receipt', async (receipt) => {
            let txnContractAddress = data[6];
            let transporterAddress = data[4];
            let txnHash = receipt.transactionHash;
            const transactions = new web3.eth.Contract(Transactions.abi, txnContractAddress);
            let txns = await transactions.methods.getAllTransactions().call({from: req.params.account});
            let prevTxn = txns[txns.length - 1][0];
            txn = await transactions.methods.createTxnEntry(txnHash, transporterAddress, req.params.account, prevTxn, '10', '10').send({from: req.params.account});
            });
        }
        res.status(200).json({
        message:"Received Product Successfully",
        transaction:txn
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to Receive product' });
    }
};

exports.requestPackage = async (req,res) => {
    // Create signature for package request using distributer private key
    const message = web3.utils.soliditySha3(packageId);
    const signature = web3.eth.accounts.sign(message, privateKey);
    try {
        supplyChainContract.methods.requestProduct(req.params.account, req.body.distributor, req.body.packageAddress, req.body.signature).send({ from: req.params.account })
        .once('receipt', async (receipt) => {
            alert('Request Made to Distributor!');
            console.log(receipt);
            isLoading(false);
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to request product' });
    }
}

exports.viewRecievedProducts = async (req, res) => {
    try {
        var productAddress = await supplyChainContract.methods.getBatchIdC(SupplyChain.networks[5777].address).call({
            from: req.params.acccont
        });
        res.status(200).json({
            productAddress
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error getting product addresses'
        });
    }
}


exports.getAllDistributors = async (req, res) => {
    try {
        
      var distributors = await supplyChainContract.methods.getAllDistributors(SupplyChain.networks[5777].address).call({
          from: req.params.account
      });
      console.log(distributors)
  
    const distributorDetails = [];
  
    for (let i = 0; i < distributors.length; i++) {
        const distributor = distributors[i];
        console.log(distributor);
        // const details = await Distributor.find({
        //     distributor: distributor
        // });
        //let products = 0;
        // if (distributor.length > 0) {
        //     //console.log(distributor[0].products);
        //     products = details[0].products;
        // }
        //console.log(products);
        distributorDetails.push({distributorAddr:distributor, productCount: Math.floor(Math.random() * 10)});
    }

    
    
    res.status(200).json({
        distributorDetails
    });
    } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'Error getting Distributors'
      });
    }
  }