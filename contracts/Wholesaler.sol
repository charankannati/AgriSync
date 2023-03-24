// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './ProductW_D.sol';
import './Product.sol';

abstract contract Wholesaler {
    
    mapping(address => address[]) public ProductsAtWholesaler;
    mapping(address => address[]) public ProductWtoD;
    mapping(address => address) public ProductWtoDTxContract;
    
    constructor() {}
    
    function productRecievedAtWholesaler(
        address _address
    ) public {

        uint rtype = Product(_address).receivedProduct(msg.sender);
        if(rtype == 1){
            ProductsAtWholesaler[msg.sender].push(_address);
        }
    }
    
    function transferProductWtoD(
        address _address,
        address transporter,
        address receiver
    ) public {
        
        ProductW_D wd = new ProductW_D(
            _address,
            msg.sender,
            transporter,
            receiver
        );
        ProductWtoD[msg.sender].push(address(wd));
        ProductWtoDTxContract[_address] = address(wd);
    }
}