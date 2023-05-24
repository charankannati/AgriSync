// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './ProductD_C.sol';

abstract contract Customer {
    
    mapping(address => address[]) public ProductBatchAtCustomer;
    mapping(address => salestatus) public sale;

    enum salestatus {
        notfound,
        atcustomer,
        sold,
        expired,
        damaged
    }

    event ProductStatus(
        address _address,
        address indexed Customer,
        uint status
    );

    function productRecievedAtCustomer(
        address _address,
        address cid
    ) public {
        ProductD_C(cid).receiveDC(_address, msg.sender);
        ProductBatchAtCustomer[msg.sender].push(_address);
        sale[_address] = salestatus(1);
    }

    function updateSaleStatus(
        address _address,
        uint Status
    ) public {
        sale[_address] = salestatus(Status);
        emit ProductStatus(_address, msg.sender, Status);
    }

    function salesInfo(
        address _address
    ) public
    view
    returns(
        uint Status
    ){
        return uint(sale[_address]);
    }

    function getAllProductsAtCustomer() public view returns(address[] memory) {
        uint len = ProductBatchAtCustomer[msg.sender].length;
        address[] memory ret = new address[](len);
        for (uint i = 0; i < len; i++) {
            ret[i] = ProductBatchAtCustomer[msg.sender][i];
        }
        return ret;
    }

}