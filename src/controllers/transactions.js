const Web3 = require('web3');
const Transactions = require('../../build/contracts/Transactions.json');
require('dotenv').config

const web3 = new Web3('http://localhost:7545'); // Replace with your Ethereum node URL
const txnContract = new web3.eth.Contract(Transactions.abi, process.env.OWNER_ADDRESS);

exports.getAllTransactions = async (req, res) => {
  try {
    const txns = await txnContract.methods.getAllTransactions().call({from: "0x0caFCb220586A29255fAe3b169A59256b539E134", gas:200000000});
    res.json({ success: true, txns });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to get transactions' });
  }
};
