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
import "./UserData.sol";


//// New supply chain : farmer -> transporter -> processor -> transporter -> whole-saler -> transporter -> distributor -> transporter -> customer/hospital/pharmacy

contract SupplyChain is Farmer, Transporter, Processor, UserData {
    address public Owner;


    //create a variable for crops that are for sale

    constructor() {
        Owner = msg.sender;
    }

    modifier onlyOwner() {
        require(Owner == msg.sender);
        _;
    }

    modifier checkUser(address addr) {
        require(addr == msg.sender);
        _;
    }

    //enum roles {noRole, farmer, transporter, processor, wholesaler, distributor, customer}

    //////////////// Events ////////////////////

    event UserRegister(address indexed _address, bytes32 name);
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

    //verify package
    function verify(address p, bytes32 hash, uint8 v, bytes32 r, bytes32 s) public pure returns(bool) {
        return ecrecover(hash, v, r, s) == p;
    } 
    /////////////// Users (Only Owner Executable) //////////////////////

    
    function registerUser(bytes32 name,string[] memory loc,uint256 role,address _userAddr) external onlyOwner {
        userInfo[_userAddr].name = name;
        userInfo[_userAddr].userLoc = loc;
        userInfo[_userAddr].role = roles(role);
        userInfo[_userAddr].userAddr = _userAddr;

        emit UserRegister(_userAddr, name);
    }

    function changeUserRole(uint256 _role, address _addr) external onlyOwner returns (string memory){
        userInfo[_addr].role = roles(_role);
        return "Role Updated!";
    }

    function getUserInfo(address _address) external view onlyOwner returns (userData memory) {
        return userInfo[_address];
    }

    


    /////////////// Farmer //////////////////////

    //add a variable into this function called boolean sale
    function farmerCreatesCropPackage(bytes32 _description, uint256 _quantity, address _transporterAddr,address _processorAddr) external {
        require(userInfo[msg.sender].role == roles.farmer);
        createCropPackage(_description,_quantity,_transporterAddr,_processorAddr);
    }

    function farmerGetPackageCount() external view returns (uint256) {
        require(userInfo[msg.sender].role == roles.farmer);
        return getNoOfPackagesOfFarmer();
    }

    function farmerGetCropPackageAddresses() external view returns (address[] memory) {
        address[] memory ret = getAllPackages();
        return ret;
    }

    ///////////////  Transporter ///////////////

    function transporterHandlePackage(address _address,uint256 transporterType,address cid) external {
        require(userInfo[msg.sender].role == roles.transporter);
        require(transporterType > 0);
        handlePackage(_address, transporterType, cid);
    }

    ///////////////  Processor ///////////////



    function processorReceivedCrops(address _addr) external {
        require(userInfo[msg.sender].role == roles.processor);
        processorReceivedPackage(_addr, msg.sender);
    }

    function processorCreatesNewProduct(bytes32 _description,address[] memory _cropAddr,uint256 _quantity,address[] memory _transporterAddr,address _receiverAddr,uint256 RcvrType) external returns (string memory) {
        require(userInfo[msg.sender].role == roles.processor);
        require(RcvrType != 0);
        processorCreatesProduct(msg.sender,_description,_cropAddr,_quantity,_transporterAddr,_receiverAddr,RcvrType);
        return "Product created!";
    }

    //function getSaleCrops() external view returns ()


}