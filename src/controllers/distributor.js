const Web3 = require('web3');
const SupplyChain2 = require('../../build/contracts/SupplyChain2.json')
const SupplyChain = require('../../build/contracts/SupplyChain.json')
const Product = require('../../build/contracts/Product.json')
//const Crop = require('../../build/contracts/Crop.json')
const Transactions = require('../../build/contracts/Transactions.json')

const web3 = new Web3('http://localhost:7545'); // Replace with your Ethereum node URL

const supplyChainContract = new web3.eth.Contract(SupplyChain2.abi, SupplyChain2.networks[5777].address);


const db = require('../../config/database');
const Wholesaler = require('../models/Wholesaler');


db();

exports.distributerReceivedProducts = async (req, res) => {
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
        let wholesaler = data[8];
        let signature = events[events.length-1]['returnValues'][3];
        let verificationOutput = await verifySignature(wholesaler, signature);
        if(verificationOutput) {
        alert('Signature verified');
        let subcontractAddress = await supplyChainContract.methods.getSubContractWD(address).call({ from: account });
        await supplyChainContract.methods.productRecievedAtDistributor(req.body.address, subcontractAddress,SupplyChain.networks[5777].address).send({from: req.params.account})
            .once('receipt', async (receipt) => {
            let txnContractAddress = data[6];
            let transporterAddress = data[4];
            let txnHash = receipt.transactionHash;
            const transactions = new web3.eth.Contract(Transactions.abi, txnContractAddress);
            let txns = await transactions.methods.getAllTransactions().call({from: account});
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
        res.status(500).json({ success: false, message: 'Failed to Receive product' });
    }
};

exports.requestPackage = async (req,res) => {
    // Create signature for package request using distributer private key
    // const message = web3.utils.soliditySha3(packageId);
    // const signature = web3.eth.accounts.sign(message, privateKey);
    try {
        // supplyChainContract.methods.requestProduct(req.params.account, req.body.wholesaler, req.body.packageAddress, req.body.signature).send({ from: req.params.account })
        // .once('receipt', async (receipt) => {
        //     console.log('Request Made to wholesaler!');
        //     console.log(receipt);
        // })
        // res.status(200).json({
        //     message:"Request made successfully"
        // })
        await supplyChainContract.methods.requestProduct(req.params.account, req.body.processor, req.body.packageId, req.body.signature).send({ from: req.params.account });
        res.status(200).json({
            message:"Request Made Successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to request product' });
    }
}

exports.viewRecievedProducts = async (req, res) => {
    try {
        var productAddress = await supplyChainContract.methods.distributerGetAllProducts(SupplyChain.networks[5777].address).call({
            from: req.params.acccont
        });
        const wholesaler = await Wholesaler.find({
            wholesaler: req.params.account
        });
        if (wholesaler.length > 0) {
            //console.log(wholesaler[0].products);
            productAddresses = wholesaler[0].products;
        }
        console.log(productAddresses);

        const productDetails = [];
  
        for (let i = 0; i < productAddresses.length; i++) {
            const productAddress = productAddresses[i];
            //console.log(productAddress);
            const productContract = new web3.eth.Contract(Product.abi, productAddress);
            var product = await productContract.methods.getProductInfo().call({
                from: req.params.account
            });
            product._productAddr = productAddress;
            productDetails.push(product);
        }
        //console.log(productDetails)
        productDetails[0]._productAddress
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
    // Create signature for package request using distibuter private key
    //const message = web3.utils.soliditySha3(req.body.packageId);
    //const signature = web3.eth.accounts.sign(message, req.body.privateKey);
    let product = new web3.eth.Contract(Product.abi, req.body.productAddress);
    try {
    
    await supplyChainContract.methods.sendPackageToEntity(req.body.distributer, req.params.account, req.body.productAddress, req.body.signature).send({ from: req.params.account })
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

exports.getAllWholesalers = async (req, res) => {
    try {
        
      var wholesalers = await supplyChainContract.methods.getAllWholesalers(SupplyChain.networks[5777].address).call({
          from: req.params.account
      });
      console.log(wholesalers)
  
    const wholesalerDetails = [];
  
    for (let i = 0; i < wholesalers.length; i++) {
        const wholesaler = wholesalers[i];
        console.log(wholesaler);
        const details = await Wholesaler.find({
            wholesaler: wholesaler
        });
        let products = 0;
        if (wholesaler.length > 0) {
            //console.log(wholesaler[0].products);
            products = details[0].products;
        }
        console.log(products);
        wholesalerDetails.push({wholesalerAddr:wholesaler, productCount:products.length});
    }

    
    
    res.status(200).json({
        wholesalerDetails
    });
    } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'Error getting Wholesalers'
      });
    }
  }