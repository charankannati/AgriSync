// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Product.sol';

contract ProductD_C {

    address Owner;

    enum packageStatus { atcreator, picked, delivered }

    address productAddr;
    address sender;
    address transporter;
    address receiver;
    packageStatus status;

    constructor(
        address _address,
        address Sender,
        address Transporter,
        address Receiver
    ) public {
        Owner = Sender;
        productAddr = _address;
        sender = Sender;
        transporter = Transporter;
        receiver = Receiver;
        status = packageStatus(0);
    }

    function updateTransporterAddress(address addr) public {
        transporter = addr;
    }


    function pickDC(
        address _address,
        address transporterAddr
    ) public {
        require(
            transporter == transporterAddr,
            "Only Associated transporter can call this function."
        );
        status = packageStatus(1);

        Product(_address).sendDtoC(
            receiver,
            sender
        );
    }


    function receiveDC(
        address _address,
        address Receiver
    ) public {
        require(
            Receiver == receiver,
            "Only Associated receiver can call this function."
        );
        status = packageStatus(2);
        Product(_address).receivedDtoC(
            Receiver
        );
    }

    function get_addressStatus() public view returns(
        uint
    ) {
        return uint(status);
    }

}