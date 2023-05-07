// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

pragma experimental ABIEncoderV2;


import "./Crop.sol";
import "./Farmer.sol";
import "./Transporter.sol";
import "./Product.sol";
import "./Processor.sol";
import "./ProductW_D.sol";
import "./Wholesaler.sol";
import "./ProductD_C.sol";
import "./Distributor.sol";
import "./Customer.sol";
import "./SupplyChain.sol";
import "./UserData.sol";

//// New supply chain : farmer -> transporter -> processor -> transporter -> whole-saler -> transporter -> distributor -> transporter -> customer/hospital/pharmacy

contract SupplyChain2 is Wholesaler, Distributor, Customer, UserData {
    address public Owner;


    //create a variable for crops that are for sale

    constructor() {
        Owner = msg.sender;
    }

    modifier onlyOwner() {
        require(Owner == msg.sender);
        _;
    }

//     modifier checkUser(address addr) {
//         require(addr == msg.sender);
//         _;
//     }

//     enum roles {noRolenoRole, farmer, transporter, processor, wholesaler, distributor, customer}

//     //////////////// Events ////////////////////

    //event UserRegister(address indexed _address, bytes32 name);
    event buyEvent(address buyer, address indexed seller, address packageAddr, bytes signature, uint indexed timestamp);
    event respondEvent(address indexed buyer, address seller, address packageAddr, bytes signature, uint indexed timestamp);
    event sendEvent(address seller, address buyer, address indexed packageAddr, bytes signature, uint indexed timestamp);
    event receivedEvent(address indexed buyer, address seller, address packageAddr, bytes signature, uint indexed timestamp);

//////////////// Event functions (All entities) ////////////////////

    
    function requestProduct(address buyer, address seller, address packageAddr, bytes memory signature) public {
        emit buyEvent(buyer, seller, packageAddr, signature, block.timestamp);
    }
    
    function respondToEntity(address buyer, address seller, address packageAddr, bytes memory signature) public {
        emit respondEvent(buyer, seller, packageAddr, signature, block.timestamp);
    }
    
    function sendPackageToEntity(address buyer, address seller, address packageAddr, bytes memory signature) public {
        emit sendEvent(seller, buyer, packageAddr, signature, block.timestamp);
    }

    //verify Package
    function verify(address p, bytes32 hash, uint8 v, bytes32 r, bytes32 s) public pure returns(bool) {
        return ecrecover(hash, v, r, s) == p;
    } 
    /////////////// Users (Only Owner Executable) //////////////////////

    // struct userData {
    //     bytes32 name;
    //     string[] userLoc;
    //     roles role;
    //     address userAddr;
    // }

    // mapping(address => userData) public userInfo;

    // function registerUser(bytes32 name,string[] memory loc,uint256 role,address _userAddr) external onlyOwner {
    //     userInfo[_userAddr].name = name;
    //     userInfo[_userAddr].userLoc = loc;
    //     userInfo[_userAddr].role = roles(role);
    //     userInfo[_userAddr].userAddr = _userAddr;

    //     emit UserRegister(_userAddr, name);
    // }

    // function changeUserRole(uint256 _role, address _addr) external onlyOwner returns (string memory){
    //     userInfo[_addr].role = roles(_role);
    //     return "Role Updated!";
    // }

    // function getUserInfo(address _address) external view onlyOwner returns (userData memory) {
    //     return userInfo[_address];
    // }

    


    
    ///////////////  Wholesaler  ///////////////

    function wholesalerReceivedProduct(address _address) external {
        require(userInfo[msg.sender].role == roles.wholesaler || userInfo[msg.sender].role == roles.distributor);
        productRecievedAtWholesaler(_address);
    }

    function getAllProcessors() public view returns (address[] memory){
        return processors;
    }

    function transferProductW_D(address _address, address transporter, address receiver) external {
        require(userInfo[msg.sender].role == roles.wholesaler && msg.sender == Product(_address).getWDC()[0]);
        transferProductWtoD(_address, transporter, receiver);
    }

    function getBatchIdByIndexWD(uint256 index) external view returns (address packageID) {
        require(userInfo[msg.sender].role == roles.wholesaler);
        return ProductWtoD[msg.sender][index];
    }

    function getSubContractWD(address _address) external view returns (address SubContractWD) {
        return ProductWtoDTxContract[_address];
    }
    
    ///////////////  Distributor  ///////////////

    function distributorReceivedProduct(address _address, address cid) external {
        require(userInfo[msg.sender].role == roles.distributor && msg.sender == Product(_address).getWDC()[1]);
        productRecievedAtDistributor(_address, cid);
    }

    function distributorTransferProducttoCustomer(address _address, address transporter, address receiver) external {
        require(userInfo[msg.sender].role == roles.distributor && msg.sender == Product(_address).getWDC()[1]);
        transferProductDtoC(_address, transporter, receiver);
    }

    function getAllWholesalers() public view returns (address[] memory){
        return wholesalers;
    }

    function getBatchesCountDC() external view returns (uint256 count) {
        require(userInfo[msg.sender].role == roles.distributor);
        return ProductDtoC[msg.sender].length;
    }

    function getBatchIdByIndexDC(uint256 index) external view returns (address packageID) {
        require(userInfo[msg.sender].role == roles.distributor);
        return ProductDtoC[msg.sender][index];
    }

    function getSubContractDC(address _address) external view returns (address SubContractDP) {
        return ProductDtoCTxContract[_address];
    }

    function distributerGetAllProducts() public view returns(address[] memory) {
        require(userInfo[msg.sender].role == roles.distributor);
        address[] memory products = getAllProductAtDistributor();
        return products;
    }

    ///////////////  Customer  ///////////////

    function customerReceivedProduct(address _address, address cid) external {
        require(userInfo[msg.sender].role == roles.customer);
        productRecievedAtCustomer(_address, cid);
    }

    function updateStatus(address _address, uint256 Status) external {
        require(userInfo[msg.sender].role == roles.customer && msg.sender == Product(_address).getWDC()[2], "Only Customer or current");
        require(sale[_address] == salestatus(1));
        updateSaleStatus(_address, Status);
    }

    function getAllDistributors() public view returns (address[] memory){
        return distributors;
    }

    function getSalesInfo(address _address) external view returns (uint256 Status) {
        return salesInfo(_address);
    }

    function getBatchesCountC() external view returns (uint256 count) {
        require(userInfo[msg.sender].role == roles.customer);
        return ProductBatchAtCustomer[msg.sender].length;
    }

    function getBatchIdByIndexC(uint256 index) external view returns (address _address) {
        require(userInfo[msg.sender].role == roles.customer);
        return ProductBatchAtCustomer[msg.sender][index];
    }
}