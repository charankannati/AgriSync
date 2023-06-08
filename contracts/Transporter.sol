// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Crop.sol';
import './Product.sol';
import './ProductW_D.sol';
import './ProductD_C.sol';

abstract contract Transporter {
    
    function handlePackage(
        address _addr,
        uint transportertype,
        address cid
        ) public {

        if(transportertype == 1) { 
            /// Farmer -> Processor
            Crop(_addr).pickPackage(msg.sender);
        } else if(transportertype == 2) { 
            /// Processor -> Wholesaler
            Product(_addr).pickProduct(msg.sender);
        } else if(transportertype == 3) {   
            // Wholesaler to Distributer
            ProductW_D(cid).pickWD(_addr, msg.sender);
        } else if(transportertype == 4) {   
            // Distrubuter to Customer
            ProductD_C(cid).pickDC(_addr, msg.sender);
        }
    }
}