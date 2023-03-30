// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import './ProductW_D.sol';
import './Product.sol';
import './ProductD_C.sol';

abstract contract Distributor {
    
    mapping(address => address[]) public ProductsAtDistributor;
    mapping(address => address[]) public ProductDtoC;
    mapping(address => address) public ProductDtoCTxContract;
    
    function productRecievedAtDistributor(
        address _address, 
        address cid
        ) public {
            
        uint rtype = Product(_address).receivedProduct(msg.sender);
        if(rtype == 2){
            ProductsAtDistributor[msg.sender].push(_address);
            if(Product(_address).getWDC()[0] != address(0)){
                ProductW_D(cid).receiveWD(_address, msg.sender);
            }
        }
    }


    function transferProductDtoC(
        address _address,
        address transporter,
        address receiver
    ) public {
        ProductD_C dp = new ProductD_C(
            _address,
            msg.sender,
            transporter,
            receiver
        );
        ProductDtoC[msg.sender].push(address(dp));
        ProductDtoCTxContract[_address] = address(dp);
    }

}