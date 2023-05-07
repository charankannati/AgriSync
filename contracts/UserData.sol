// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

enum roles {noRole, farmer, transporter, processor, wholesaler, distributor, customer}

contract UserData {

    address[] public farmers;
    address[] public transporters;
    address[] public processors;
    address[] public wholesalers;
    address[] public distributors;
    address[] public customers;

    struct userData {
            bytes32 name;
            string[] userLoc;
            roles role;
            address userAddr;
    }

    mapping(address => userData) public userInfo;
}