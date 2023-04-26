// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

enum roles {noRole, farmer, transporter, processor, wholesaler, distributor, customer}

contract UserData {

    struct userData {
            bytes32 name;
            string[] userLoc;
            roles role;
            address userAddr;
    }

    mapping(address => userData) public userInfo;
}