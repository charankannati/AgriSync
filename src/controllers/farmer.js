const Web3 = require('web3');
const SupplyChain = require('../../build/contracts/SupplyChain.json');
const Crop = require('../../build/contracts/Crop.json')
const Transactions = require('../../build/contracts/Transactions.json')
require('dotenv').config

// Initialize web3 object
const web3 = new Web3('http://localhost:7545');

// Connect to the smart contract
const supplyChainContract = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);


const createCropPackage = async (req, res) => {
    try {
        let txn=0;
        console.log(req.body);
        const description = web3.utils.padRight(web3.utils.fromAscii(req.body.description), 64);
        const quantity = req.body.quantity;
        const transporterAddr = req.body.transporterAddr;
        const processorAddr = req.body.processorAddr;
        console.log(req.params.address);
        await supplyChainContract.methods.farmerCreatesCropPackage(description, quantity, transporterAddr, processorAddr).send({
            from: req.params.address, gas:30000000
        }).once('receipt', async (receipt) => {
            var cropAddresses = await supplyChainContract.methods.getAllPackages().call({from: req.params.address});
            let cropAddress = cropAddresses[cropAddresses.length - 1];
            const cropContract = new web3.eth.Contract(Crop.abi, cropAddress);
            let data = await cropContract.methods.getSuppliedCrops().call({from: req.params.address});
            let txnContractAddress = data[6];
            let txnHash = receipt.transactionHash;
            const transactionsContract = new web3.eth.Contract(Transactions.abi, txnContractAddress);
            txn = await transactionsContract.methods.createTxnEntry(txnHash, req.params.address, cropAddress, txnHash, '10', '10').send({ from: req.params.address , gas:3000000});
            console.log(txn);
        });
        res.status(200).json({
            message:"Created Crop Successfully",
            transaction:txn
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error creating crop package'
        });
    }
};

const getPackageCount = async (req, res) => {
    try {
        const count = await supplyChainContract.methods.farmerGetPackageCount().call({from:req.params.address});
        res.status(200).json({
            count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error getting package count'
        });
    }
};

const getCropPackageAddresses = async (req, res) => {
    try {
        const cropAddresses = await supplyChainContract.methods.farmerGetCropPackageAddresses().call({
            from: req.params.address
        });
        res.status(200).json({
            cropAddresses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error getting raw material addresses'
        });
    }
};




module.exports = {
    createCropPackage,
    getPackageCount,
    getCropPackageAddresses,
};