// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Crop.sol';
import './Product.sol';

abstract contract Processor {
    
    mapping (address => address[]) public processorCrops;
    mapping (address => address[]) public processorProducts;

    constructor() {}
    
    function processorReceivedPackage(
        address _addr,
        address _processorAddress
        ) public {
            
        Crop(_addr).receivedPackage(_processorAddress);
        processorCrops[_processorAddress].push(_addr);
    }
    
    
    function processorCreatesProduct(
        address _processorAddr,
        bytes32 _description,
        address[] memory _cropsAddr,
        uint _quantity,
        address[] memory _transporterAddr,
        address _recieverAddr,
        uint RcvrType
        ) public {
            
        Product _product = new Product(
            _processorAddr,
            _description,
            _cropsAddr,
            _quantity,
            _transporterAddr,
            _recieverAddr,
            RcvrType
        );
        
        processorProducts[_processorAddr].push(address(_product));
        
    }
    
}