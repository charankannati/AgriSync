// var SupplyChain = artifacts.require('SupplyChain');

// module.exports = function(deployer) {
//   deployer.deploy(SupplyChain);
// };
var SupplyChain = artifacts.require('SupplyChain');
var SupplyChain2 = artifacts.require('SupplyChain2');

module.exports = async function(deployer) {
  deployer.then(function() {
    return Promise.all([
      deployer.deploy(SupplyChain),
      deployer.deploy(SupplyChain2)
    ]);
  });
  // await deployer.deploy(SupplyChain);
  // const supplyChainInstance = await SupplyChain.deployed();
  // await deployer.deploy(SupplyChain2, supplyChainInstance.address);
};
