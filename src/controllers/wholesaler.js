const Web3 = require('web3');
const SupplyChain2 = require('../../build/contracts/SupplyChain2.json')
const SupplyChain = require('../../build/contracts/SupplyChain.json')
const Product = require('../../build/contracts/Product.json')
//const Crop = require('../../build/contracts/Crop.json')
const Transactions = require('../../build/contracts/Transactions.json')

const web3 = new Web3('http://localhost:7545'); // Replace with your Ethereum node URL

const supplyChainContract = new web3.eth.Contract(SupplyChain2.abi, SupplyChain2.networks[5777].address);

const supplyChain = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);


const db = require('../../config/database');
const Wholesaler = require('../models/Wholesaler');


db();

exports.wholesalerReceivedProducts = async (req, res) => {
    async function verifySignature(sellerAddress, signature) {
        let v = '0x' + signature.slice(130, 132).toString();
        let r = signature.slice(0, 66).toString();
        let s = '0x' + signature.slice(66, 130).toString();
        let messageHash = web3.eth.accounts.hashMessage(req.body.address);
        let verificationOutput = await supplyChainContract.methods.verify(sellerAddress, messageHash, v, r, s).call({from: req.params.account});
        
        return verificationOutput;
    }

    try {
        //const result = await supplyChainContract.methods.distributerReceivedProducts(req.body.address).send({ from: req.body.account });
        let txn=0;
        let product = new web3.eth.Contract(Product.abi, req.body.address);
        let data = await product.methods.getProductInfo().call({from: req.params.account});
        let Contract = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);
        let events = await Contract.getPastEvents('sendEvent', {filter: {packageAddr: req.body.address}, fromBlock: 0, toBlock: 'latest'});
        console.log(data)
        events = events.filter((event) => {
            return event.returnValues.packageAddr == req.body.address;
        });
        console.log(events)
        let processor = data._processorAddr;
        let signature = events[0]['returnValues'][3];
        let verificationOutput = await verifySignature(processor, signature);
        console.log(verificationOutput);
        if(verificationOutput) {
            console.log('Signature verified');
            // wholesalerProducts.push(req.body.address);
            (async () => {
                try {
                  const wholesaler = await Wholesaler.findOne({ wholesaler: req.params.account });
                  console.log("Hello");
                  if (wholesaler) {
                    wholesaler.products.push(req.body.address);
                    //wholesaler.updateOne({products:[...products,req.body.address]});
                    await wholesaler.save();
                    console.log("Hello");
                  } else {
                    const newWholesaler = new Wholesaler({
                      wholesaler: req.params.account,
                      products: [req.body.address]
                    });
                    await newWholesaler.save();
                    console.log("Hello2");
                  }
                } catch (error) {
                  console.error(error);
                }
              })();
            await supplyChainContract.methods.wholesalerReceivedProduct(req.body.address, SupplyChain.networks[5777].address).send({from: req.params.account})
                .once('receipt', async (receipt) => {
                let txnContractAddress = data._txnContract;
                let transporterAddress = data._transporterAddr[0];
                let txnHash = receipt.transactionHash;
                const transactions = new web3.eth.Contract(Transactions.abi, txnContractAddress);
                let txns = await transactions.methods.getAllTransactions().call({from: req.params.account});
                let prevTxn = txns[txns.length - 1][0];
                txn = await transactions.methods.createTxnEntry(txnHash, transporterAddress, req.params.account, prevTxn, '10', '10').send({from: req.params.account, gas:30000000});
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
    // const message = req.body.packageAddress;
    // const signature = web3.eth.accounts.sign(message, req.body.privateKey).signature;
    // console.log(message);
    // console.log(signature);
    try {
        await supplyChainContract.methods.requestProduct(req.params.account, req.body.processor, req.body.packageId, req.body.signature).send({ from: req.params.account });
        res.status(200).json({
            message:"Request Made Successfully"
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to request product' });
    }
}

exports.viewReceivedProducts = async (req, res) => {
    try {
        // var productAddresses = await supplyChainContract.methods.wholesalerGetAllProducts(SupplyChain.networks[5777].address).call({
        //     from: req.params.account
        // });
        var productAddresses = ['0x961D352343D1e4B827BBbD3F8B7B4A8dEBf7E4Ba'];

        // await Wholesaler.find({ wholesaler:String(req.params.account) }).then( (error, wholesaler) => {
        //     if (error) {
        //       console.error(error);
        //     } else {
        //         console.log(wholesaler[0].products);
        //       if (wholesaler) {
        //         // User found, update the hobbies array
        //         productAddresses = wholesaler[0].products;
        //       }
        //     }
        //   });

          const wholesaler = await Wholesaler.find({
              wholesaler: req.params.account
          });
          if (wholesaler.length > 0) {
              //console.log(wholesaler[0].products);
              productAddresses = wholesaler[0].products;
          }
          console.log(productAddresses);

          //productAddresses = ['0x961D352343D1e4B827BBbD3F8B7B4A8dEBf7E4Ba','0x6A8cD63e014EaDb77d58D4dF8825b5431dc9E9b1'];

        //console.log(productAddresses);
  
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
            productDetails
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

exports.transferProduct = async (req,res) => {
    // Create signature for package request using distibuter private key
    //const message = web3.utils.soliditySha3(req.body.packageId);
    //const signature = web3.eth.accounts.sign(message, req.body.privateKey);
    // let product = new web3.eth.Contract(Product.abi, req.body.productAddress);
    try {
    
        await supplyChainContract.methods.transferProductWtoD(req.body.address, req.body.transporterAddress, req.body.distributorAddress,SupplyChain.networks[5777].address).send({ from: req.params.account })
        .once('receipt', async (receipt) => {
            console.log(receipt);
        })
        res.status(200).json({
            message:"Transferred Product from wholesaler to distributor"
        })
    } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to transfer Product' });
    }
}

exports.getAllProcessors = async (req, res) => {
    try {
        
      var processors = await supplyChainContract.methods.getAllProcessors(SupplyChain.networks[5777].address).call({
          from: req.params.account
      });
      console.log(processors)
  
    const processorDetails = [];
  
    for (let i = 0; i < processors.length; i++) {
        const processor = processors[i];
        const products = await supplyChain.methods.processorGetAllCreatedProducts().call({
            from: processor
        });
        processorDetails.push({processorAddr:processor, productCount:products.length});
    }
    
    res.status(200).json({
        processorDetails
    });
    } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'Error getting Processors'
      });
    }
  }