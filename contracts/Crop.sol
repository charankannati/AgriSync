// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import './Transactions.sol';

contract Crop {
    
    address Owner;

    enum packageStatus { atCreator, picked, delivered }
    
    event ShippmentUpdate(
        address indexed CropID,
        address indexed Transporter,
        address indexed Processor,
        uint TransporterType,
        uint Status
    );

    address cropid;
    bool forSale;
    bytes32 description;
    uint quantity;
    address transporter;
    address processor;
    address farmer;
    packageStatus status;
    bytes32 packageReceiverDescription;
    address txnContractAddress;
    
    constructor (
        address _creatorAddr,
        address _cropid,
        bytes32 _description,
        uint _quantity,
        address _transporterAddr,
        address _processorAddr
    ) public {
        Owner = _creatorAddr;
        cropid = _cropid;
        description = _description;
        quantity = _quantity;
        transporter = _transporterAddr;
        processor = _processorAddr;
        farmer = _creatorAddr;
        status = packageStatus(0);
        Transactions txnContract = new Transactions(_processorAddr);
        txnContractAddress = address(txnContract);
    }


        
    function getSuppliedCrops () public view returns(
        address,
        bytes32,
        uint,
        address,
        address,
        address,
        address,
        packageStatus
    ) {
        return (cropid, description, quantity, farmer, transporter, processor, txnContractAddress, status);
    }

    function updateProcessorAddress(address addr) public {
        processor = addr;
    }

    function updateTransporterAddress(address addr) public {
        transporter = addr;
    }


    function getCropStatus() public view returns(
        uint
    ) {
        return uint(status);
    }



    function pickPackage(
        address _transporterAddr
    ) public {
        require(
            _transporterAddr == transporter,
            "Only transporter of the package can pick package"
        );
        require(
            status == packageStatus(0),
            "Package must be at Supplier."
        );
        status = packageStatus(1);
        emit ShippmentUpdate(cropid, transporter, processor, 1, 1);
    }

    
    function receivedPackage(
        address _processorAddr
    ) public {
        require(
            _processorAddr == processor,
            "Only processor of the package can receieve the package"
        );

        require(
            status == packageStatus(1),
            "Product not picked up yet"
        );
        status = packageStatus(2);
        emit ShippmentUpdate(cropid, transporter, processor, 1, 2);
    }


}
