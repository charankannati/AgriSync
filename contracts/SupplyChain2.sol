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

    function wholesalerReceivedProduct(address _address, address _addr) external {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.wholesaler || user.role == roles.distributor);
        productRecievedAtWholesaler(_address, msg.sender);
    }

    function getAllProcessors(address _addr) public view returns (address[] memory){
        address[] memory processors = SupplyChain(_addr).getallProcessors();
        return processors;
    }

    function transferProductW_D(address _address, address transporter, address receiver, address _addr) external {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.wholesaler && msg.sender == Product(_address).getWDC()[0]);
        transferProductWtoD(_address, transporter, receiver);
    }

    function getBatchIdByIndexWD(uint256 index, address _addr) external view returns (address packageID) {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.wholesaler);
        return ProductWtoD[msg.sender][index];
    }

    function getSubContractWD(address _address) external view returns (address SubContractWD) {
        return ProductWtoDTxContract[_address];
    }

    function wholesalerGetAllProducts(address _addr) public view returns(address[] memory) {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.wholesaler);
        address[] memory products = getAllProductsAtWholesaler();
        return products;
    }
    
    ///////////////  Distributor  ///////////////

    function distributorReceivedProduct(address _address, address cid, address _addr) external {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.distributor && msg.sender == Product(_address).getWDC()[0]);
        productRecievedAtDistributor(_address, cid, msg.sender);
    }

    function distributorTransferProducttoCustomer(address _address, address transporter, address receiver, address _addr) external {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.distributor && msg.sender == Product(_address).getWDC()[1]);
        transferProductDtoC(_address, transporter, receiver, msg.sender);
    }

    function getAllWholesalers(address _addr) public view returns (address[] memory){
        address[] memory wholesalers = SupplyChain(_addr).getallWholesalers();
        return wholesalers;
    }

    function getBatchesCountDC(address _addr) external view returns (uint256 count) {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.distributor);
        return ProductDtoC[msg.sender].length;
    }

    function getBatchIdByIndexDC(uint256 index, address _addr) external view returns (address packageID) {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.distributor);
        return ProductDtoC[msg.sender][index];
    }

    function getSubContractDC(address _address) external view returns (address SubContractDP) {
        return ProductDtoCTxContract[_address];
    }

    function distributerGetAllProducts(address _addr) public view returns(address[] memory) {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.distributor);
        address[] memory products = getAllProductAtDistributor(msg.sender);
        return products;
    }

    ///////////////  Customer  ///////////////

    function customerReceivedProduct(address _address, address cid, address _addr) external {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.customer);
        productRecievedAtCustomer(_address, cid);
    }

    function updateStatus(address _address, uint256 Status, address _addr) external {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.customer && msg.sender == Product(_address).getWDC()[2], "Only Customer or current");
        require(sale[_address] == salestatus(1));
        updateSaleStatus(_address, Status);
    }

    function getAllDistributors(address _addr) public view returns (address[] memory){
        address[] memory distributors = SupplyChain(_addr).getallDistributors();
        return distributors;
    }

    function getSalesInfo(address _address) external view returns (uint256 Status) {
        return salesInfo(_address);
    }

    function getBatchesCountC(address _addr) external view returns (uint256 count) {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.customer );
        return ProductBatchAtCustomer[msg.sender].length;
    }

    function getBatchIdC(address _addr) external view returns (address[] memory) {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.customer );
        return ProductBatchAtCustomer[msg.sender];
    }

    function customerGetAllProducts(address _addr) public view returns(address[] memory) {
        userData memory user = SupplyChain(_addr).getUser(msg.sender);
        require(user.role == roles.customer);
        address[] memory products = getAllProductsAtCustomer();
        return products;
    }
    
}