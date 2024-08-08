// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CropTrading is ReentrancyGuard {
    address public immutable admin;
    uint256 public cropCount;

    mapping(uint256 => Crop) public crops; // cropId -> Crop
    mapping(address => uint256[]) public userCrops; // user -> cropIds

    struct Crop {
        address seller;
        string cropName;
        uint256 pricePerUnit; // Price per unit in wei
        uint256 availableUnits; // Units available for purchase
        bool isAvailable; // Indicates if the crop is still available for sale
    }

    event CropListed(
        uint256 indexed cropId,
        address indexed seller,
        string cropName,
        uint256 pricePerUnit,
        uint256 availableUnits
    );

    event CropPurchased(
        uint256 indexed cropId,
        address indexed buyer,
        uint256 unitsPurchased,
        uint256 totalPrice
    );

    event CropRemoved(
        uint256 indexed cropId,
        address indexed seller
    );

    constructor() payable {
        admin = msg.sender;
    }

    function withdraw() external {
        require(msg.sender == admin, "Only admin");
        payable(admin).transfer(address(this).balance);
    }

    function listCrop(
        string calldata _cropName,
        uint256 _pricePerUnit,
        uint256 _totalUnits
    ) external {
        require(_pricePerUnit != 0, "Invalid price");
        require(_totalUnits != 0, "Invalid units");

        uint256 newCropId = ++cropCount;
        crops[newCropId] = Crop({
            seller: msg.sender,
            cropName: _cropName,
            pricePerUnit: _pricePerUnit,
            availableUnits: _totalUnits,
            isAvailable: true
        });

        userCrops[msg.sender].push(newCropId);

        emit CropListed(newCropId, msg.sender, _cropName, _pricePerUnit, _totalUnits);
    }

    function purchaseCrop(uint256 _cropId, uint256 _units) external payable nonReentrant {
        Crop storage crop = crops[_cropId];
        require(crop.isAvailable, "Crop unavailable");
        require(_units != 0 && crop.availableUnits >= _units, "Invalid units");
        require(msg.value == _units * crop.pricePerUnit, "Incorrect payment");

        crop.availableUnits -= _units;
        if (crop.availableUnits == 0) {
            crop.isAvailable = false;
        }

        (bool success, ) = crop.seller.call{value: msg.value}("");
        require(success, "Transfer failed");

        emit CropPurchased(_cropId, msg.sender, _units, msg.value);
    }

    function removeCrop(uint256 _cropId) external {
        Crop storage crop = crops[_cropId];
        require(crop.seller == msg.sender, "Unauthorized");
        require(crop.isAvailable, "Already removed");

        crop.isAvailable = false;

        emit CropRemoved(_cropId, msg.sender);
    }

    function getCropDetails(uint256 _cropId) external view returns (
        address seller,
        string memory cropName,
        uint256 pricePerUnit,
        uint256 availableUnits,
        bool isAvailable
    ) {
        Crop storage crop = crops[_cropId];
        require(crop.isAvailable, "Crop unavailable");

        return (
            crop.seller,
            crop.cropName,
            crop.pricePerUnit,
            crop.availableUnits,
            crop.isAvailable
        );
    }
    function getAllCrops() external view returns (Crop[] memory) {
    Crop[] memory allCrops = new Crop[](cropCount);
    for (uint256 i = 1; i <= cropCount; i++) {
        allCrops[i - 1] = crops[i];
    }
    return allCrops;
}


    // Batch purchase function to save gas on multiple purchases
    function batchPurchaseCrop(uint256[] calldata _cropIds, uint256[] calldata _units) external payable nonReentrant {
        require(_cropIds.length == _units.length, "Array mismatch");

        uint256 totalCost = 0;
        for (uint256 i = 0; i < _cropIds.length; i++) {
            Crop storage crop = crops[_cropIds[i]];
            require(crop.isAvailable, "Crop unavailable");
            require(_units[i] != 0 && crop.availableUnits >= _units[i], "Invalid units");

            totalCost += _units[i] * crop.pricePerUnit;

            crop.availableUnits -= _units[i];
            if (crop.availableUnits == 0) {
                crop.isAvailable = false;
            }
        }
        require(msg.value == totalCost, "Incorrect payment");

        // Transfer the total cost in a single transaction
        for (uint256 i = 0; i < _cropIds.length; i++) {
            (bool success, ) = crops[_cropIds[i]].seller.call{value: _units[i] * crops[_cropIds[i]].pricePerUnit}("");
            require(success, "Transfer failed");
        }
    }
}
