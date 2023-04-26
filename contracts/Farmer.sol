// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import './Crop.sol';

abstract contract Farmer {
    
    mapping (address => address[]) public farmerCrops;
    
    constructor() {}
    
    function createCropPackage(
        bytes32 _description,
        uint _quantity,
        address _transporterAddr,
        address _processorAddr
    ) public {

        Crop crop = new Crop(
            msg.sender,
            address(bytes20(sha256(abi.encodePacked(msg.sender, block.timestamp)))),
            _description,
            _quantity,
            _transporterAddr,
            _processorAddr
        );
        
        farmerCrops[msg.sender].push(address(crop));
    }
    
    
    function getNoOfPackagesOfFarmer() public view returns(uint) {
        return farmerCrops[msg.sender].length;
    }
    
    
    function getAllPackages() public view returns(address[] memory) {
        uint len = farmerCrops[msg.sender].length;
        address[] memory ret = new address[](len);
        for (uint i = 0; i < len; i++) {
            ret[i] = farmerCrops[msg.sender][i];
        }
        return ret;
    }

}