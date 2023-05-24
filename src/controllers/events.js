const Web3 = require('web3');
const SupplyChain = require('../../build/contracts/SupplyChain.json')
const Product = require('../../build/contracts/Product.json')
const Crop = require('../../build/contracts/Crop.json')
const Transactions = require('../../build/contracts/Transactions.json')
const SupplyChain2 = require('../../build/contracts/SupplyChain2.json')

const web3 = new Web3('http://localhost:7545'); // Replace with your Ethereum node URL

///var supplyChainContract = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);


const viewRequests = async (req, res) => {
    try {
        var supplyChainContract = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);
        const data = await supplyChainContract.methods.getUserInfo(req.params.account).call();
        const role = data[2];
        console.log(req.params)
        if ([3, 4, 5, 6].includes(Number(role))) {
            supplyChainContract = new web3.eth.Contract(SupplyChain2.abi, SupplyChain2.networks[5777].address);
        }
        var requests = await supplyChainContract.getPastEvents('buyEvent', {
            filter: {
                packageAddr: req.params.address
            },
            fromBlock: 0,
            toBlock: 'latest'
        });
        requests = requests.filter((event) => {
            return event.returnValues.packageAddr === req.params.address && event.returnValues.seller === req.params.account;
        });
        console.log(requests);
        res.status(200).json({
            requests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error getting Requests'
        });
    }
};

const verifyBuyer = async (req, res) => {
    const signature = req.body.buyerSignature;
    const buyerAddress = req.body.buyer;
    const packageAddr = req.body.packageId;
    var supplyChainContract = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);
    const data = await supplyChainContract.methods.getUserInfo(req.params.account).call();
    console.log(packageAddr);
    const role = data[2];
    if ([3, 4, 5, 6].includes(role)) {
        supplyChainContract = new web3.eth.Contract(SupplyChain2.abi, SupplyChain2.networks[5777].address);
    }
    try {
        var message = 0;
        let v = '0x' + signature.slice(130, 132).toString();
        let r = signature.slice(0, 66).toString();
        let s = '0x' + signature.slice(66, 130).toString();
        let messageHash = web3.eth.accounts.hashMessage(packageAddr);
        console.log(v, r, s, messageHash);
        let verificationOutput = await supplyChainContract.methods.verify(buyerAddress, messageHash, v, r, s).call({
            from: req.params.account
        });
        console.log(verificationOutput);
        if (verificationOutput) {
            console.log('Buyer is verified successfully!');
            await supplyChainContract.methods.respondToEntity(buyerAddress, req.params.account, packageAddr, req.body.sellerSignature).send({
                from: req.params.account
            })
            const data = await supplyChainContract.methods.getUserInfo(req.params.account).call();
            const role = data['role'];
            if (role === "1") {
                const crop = new web3.eth.Contract(Crop.abi, packageAddr);
                await crop.methods.updateProcessorAddress(buyerAddress).send({
                    from: req.params.account
                });
                message = {
                    code: 'Response sent to processor',
                }
            } else if (role === "3") {
                const product = new web3.eth.Contract(Product.abi, packageAddr);
                await product.methods.updateWholesalerAddress(buyerAddress).send({
                    from: req.params.account
                });
                message = 'Response sent to wholesaler';
            } else if (role === "4") {
                const product = new web3.eth.Contract(Product.abi, packageAddr);
                await product.methods.updateDistributorAddress(buyerAddress).send({
                    from: req.params.account
                });
                message = 'Response sent to distributor';
            } else {
                message = 'error with role';
            }
        } else {
            message = 'Buyer is not verified!';
        }
        res.status(200).json({
            message: message
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error verifying buyer!!'
        });
    }
};

const viewResponses = async (req, res) => {
    try {
        var supplyChainContract = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);
        const data = await supplyChainContract.methods.getUserInfo(req.params.account).call();
        const role = data[2];
        if ([4, 5, 6].includes(role)) {
            supplyChainContract = new web3.eth.Contract(SupplyChain2.abi, SupplyChain2.networks[5777].address);
        }
        var responses = await supplyChainContract.getPastEvents('respondEvent', {
            fromBlock: 0,
            toBlock: 'latest'
        });
        responses = responses.filter((response) => {
            return response.returnValues.buyer == req.params.account;
        });
        res.status(200).json({
            responses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error getting Responses'
        });
    }
};

const verifySeller = async (req, res) => {
    var supplyChainContract = new web3.eth.Contract(SupplyChain.abi, SupplyChain.networks[5777].address);
    const signature = req.body.signature;
    const sellerAddress = req.body.seller;
    const packageAddr = req.body.packageId;
    console.log(req.body);
    try {
        let v = '0x' + signature.slice(130, 132).toString();
        let r = signature.slice(0, 66).toString();
        let s = '0x' + signature.slice(66, 130).toString();
        let messageHash = web3.eth.accounts.hashMessage(packageAddr);
        console.log(messageHash, signature);
        let verificationOutput = await supplyChainContract.methods.verify(sellerAddress, messageHash, v, r, s).call({
            from: req.params.account
        });
        var message = 0;
        console.log(verificationOutput)
        if (verificationOutput) {
            message = 'Seller is Verified successfully!'
        } else {
            message = 'Seller is NOT Verified!'
        }
        res.status(200).json({
            message: message
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error verifying seller'
        });
    }
};


module.exports = {
    viewRequests,
    viewResponses,
    verifyBuyer,
    verifySeller
};