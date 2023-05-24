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

    function getUser(address _addr) public view returns (userData memory) {
        return userInfo[_addr];
    }

    function getallFarmers() public view returns (address[] memory) {
        return farmers;
    }

    function getallTransporters() public view returns (address[] memory) {
        return transporters;
    }

    function getallProcessors() public view returns (address[] memory) {
        return processors;
    }

    function getallWholesalers() public view returns (address[] memory) {
        return wholesalers;
    }

    function getallDistributors() public view returns (address[] memory) {
        return distributors;
    }

    function getallCustomers() public view returns (address[] memory) {
        return customers;
    }
}