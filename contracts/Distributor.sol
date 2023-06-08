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
        address cid,
        address _distributorAddress
        ) public {
            
        uint rtype = Product(_address).receivedProduct(_distributorAddress);
        if(rtype == 2){
            ProductsAtDistributor[_distributorAddress].push(_address);
            if(Product(_address).getWDC()[0] != address(0)){
                ProductW_D(cid).receiveWD(_address, _distributorAddress);
            }
        }
    }


    function transferProductDtoC(
        address _address,
        address transporter,
        address receiver,
        address _distributorAddress
    ) public {
        ProductD_C dp = new ProductD_C(
            _address,
            _distributorAddress,
            transporter,
            receiver
        );
        ProductDtoC[_distributorAddress].push(address(dp));
        ProductDtoCTxContract[_address] = address(dp);
    }

    function getAllProductAtDistributor(address _distributorAddress) public view returns(address[] memory) {
        uint len = ProductsAtDistributor[_distributorAddress].length;
        address[] memory ret = new address[](len);
        for (uint i = 0; i < len; i++) {
            ret[i] = ProductsAtDistributor[_distributorAddress][i];
        }
        return ret;
    }

}