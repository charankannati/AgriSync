// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Transactions.sol';

contract Product {

    address Owner;

    enum productStatus {
        atProcessor,
        pickedForW,
        pickedForD,
        deliveredAtW,
        deliveredAtD,
        pickedForC,
        deliveredAtC
    }

    bytes32 description;
    address[] crops;
    address[] transporters;
    address processor;
    address wholesaler;
    address distributor;
    address customer;
    uint quantity;
    productStatus status;
    address txnContractAddress;

    event ShippmentUpdate(
        address indexed BatchID,
        address indexed Shipper,
        address indexed Receiver,
        uint TransporterType,
        uint Status
    );


    constructor (
        address _processorAddr,
        bytes32 _description,
        address[] memory _cropsAddr,
        uint _quantity,
        address[] memory _transporterAddr,
        address _wholesaler,
        address _distributor
    ) public {
        Owner = _processorAddr;
        processor = _processorAddr;
        description = _description;
        crops = _cropsAddr;
        quantity = _quantity;
        transporters = _transporterAddr;
        wholesaler = _wholesaler;
        distributor = _distributor;
        Transactions txnContract = new Transactions(_processorAddr);
        txnContractAddress = address(txnContract);
    }


    function getProductInfo () public view returns(
        address _processorAddr,
        bytes32 _description,
        address[] memory _cropsAddr,
        uint _quantity,
        address[] memory _transporterAddr,
        address _distributor,
        uint _status,
        address _txnContract,
        address _wholesaler
    ) {
        return(
            processor,
            description,
            crops,
            quantity,
            transporters,
            distributor,
            uint(status),
            txnContractAddress,
            wholesaler
        );
    }

    function getWDC() public view returns(
        address[3] memory WDP
    ) {
        return (
            [wholesaler, distributor, customer]
        );
    }

    function getBatchIDStatus() public view returns(
        uint
    ) {
        return uint(status);
    }


    function pickProduct(
        address _transporterAddr
    ) public {
        require(
            _transporterAddr == transporters[transporters.length - 1],
            "Only Transporter can call this function"
        );
        require(
            status == productStatus(0),
            "Package must be at processor."
        );

        // if(wholesaler != address(0x0)){
        status = productStatus(1);
        emit ShippmentUpdate(address(this), _transporterAddr, wholesaler, 1, 1);
        // }else{
        //     status = productStatus(2);
        //     emit ShippmentUpdate(address(this), _transporterAddr, distributor, 1, 2);
        // }
    }
    
    function updateTransporterArray(address _transporterAddr) public {
        transporters.push(_transporterAddr);
    }

    function updateWholesalerAddress(address addr) public {
        wholesaler = addr;
    }

    function updateDistributorAddress(address addr) public {
        distributor = addr;
    }

    function receivedProduct(
        address _receiverAddr
    ) public
    returns(uint)
    {

        require(
            _receiverAddr == wholesaler || _receiverAddr == distributor,
            "Only Wholesaler or Distributor can call this function"
        );

        require(
            uint(status) >= 1,
            "Product not picked up yet"
        );

        // if(_receiverAddr == wholesaler && status == productStatus(1)){
        status = productStatus(3);
        emit ShippmentUpdate(address(this), transporters[transporters.length - 1], wholesaler, 2, 3);
        return 1;
        // } else if(_receiverAddr == distributor && status == productStatus(2)){
        //     status = productStatus(4);
        //     emit ShippmentUpdate(address(this), transporters[transporters.length - 1], distributor,3, 4);
        //     return 2;
        // }
    }


    function sendWtoD(
        address receiver,
        address sender
    ) public {
        require(
            wholesaler == sender,
            "this Wholesaler is not Associated."
        );
        distributor = receiver;
        status = productStatus(2);
    }


    function receivedWtoD(
        address receiver
    ) public {
        require(
            distributor == receiver,
            "This Distributor is not Associated."
        );
        status = productStatus(4);
    }


    function sendDtoC(
        address receiver,
        address sender
    ) public {
        require(
            distributor == sender,
            "This Distributor is not Associated."
        );
        customer = receiver;
        status = productStatus(5);
    }


    function receivedDtoC(
        address receiver
    ) public {
        require(
            customer == receiver,
            "This Customer is not Associated."
        );
        status = productStatus(6);
    }
}
