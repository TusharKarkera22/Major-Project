// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CropAdvanceSales {
    address public admin;
    uint256 public cropCount;
    mapping(uint256 => CropSale) public cropSales;
    mapping(address => uint256[]) public buyerCrops;

    struct CropSale {
        address farmer;
        uint256 amountRequested;
        uint256 amountPaid;
        uint128 pricePerUnit; // Use smaller integers when possible
        uint128 totalUnits;
        uint128 availableUnits;
        uint64 harvestDate; // Use smaller timestamp storage
        bool isFinalized;
    }

    event CropListed(
        uint256 indexed cropId,
        address indexed farmer,
        string cropName,
        uint256 amountRequested,
        uint128 pricePerUnit,
        uint128 totalUnits,
        uint64 harvestDate
    );

    event CropPurchased(
        uint256 indexed cropId,
        address indexed buyer,
        uint128 unitsPurchased,
        uint256 totalPrice
    );

    event SaleFinalized(
        uint256 indexed cropId,
        address indexed farmer
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function listCropForSale(
        string memory _cropName,
        uint256 _amountRequested,
        uint128 _pricePerUnit,
        uint128 _totalUnits,
        uint64 _harvestDate
    ) public {
        require(_amountRequested > 0, "Amount requested must be greater than zero");
        require(_pricePerUnit > 0, "Price per unit must be greater than zero");
        require(_totalUnits > 0, "Total units must be greater than zero");
        require(_harvestDate > block.timestamp, "Harvest date must be in the future");

        uint256 newCropId = ++cropCount; // Use pre-increment to save gas

        cropSales[newCropId] = CropSale({
            farmer: msg.sender,
            amountRequested: _amountRequested,
            amountPaid: 0,
            pricePerUnit: _pricePerUnit,
            totalUnits: _totalUnits,
            availableUnits: _totalUnits,
            harvestDate: _harvestDate,
            isFinalized: false
        });

        emit CropListed(newCropId, msg.sender, _cropName, _amountRequested, _pricePerUnit, _totalUnits, _harvestDate);
    }

    function purchaseCrop(uint256 _cropId, uint128 _units) public payable {
        CropSale storage crop = cropSales[_cropId];
        require(!crop.isFinalized, "Sale is finalized");
        require(block.timestamp < crop.harvestDate, "Sale period has ended");
        require(_units > 0 && _units <= crop.availableUnits, "Invalid units");
        uint256 totalPrice = uint256(_units) * uint256(crop.pricePerUnit);
        require(msg.value == totalPrice, "Incorrect amount sent");

        crop.amountPaid += msg.value;
        crop.availableUnits -= _units;
        buyerCrops[msg.sender].push(_cropId);

        emit CropPurchased(_cropId, msg.sender, _units, msg.value);
    }

    function finalizeSale(uint256 _cropId) public {
        CropSale storage crop = cropSales[_cropId];
        require(msg.sender == crop.farmer, "Only the farmer can finalize the sale");
        require(block.timestamp >= crop.harvestDate, "Cannot finalize sale before harvest date");
        require(!crop.isFinalized, "Sale is already finalized");
        require(crop.amountRequested <= address(this).balance, "Insufficient contract balance");

        crop.isFinalized = true; // Mark as finalized before the transfer to prevent re-entrancy
        payable(crop.farmer).transfer(crop.amountRequested);

        emit SaleFinalized(_cropId, msg.sender);
    }

    function getCropDetails(uint256 _cropId) public view returns (
        address farmer,
        uint256 amountRequested,
        uint256 amountPaid,
        uint128 pricePerUnit,
        uint128 totalUnits,
        uint128 availableUnits,
        uint64 harvestDate,
        bool isFinalized
    ) {
        CropSale memory crop = cropSales[_cropId];
        return (
            crop.farmer,
            crop.amountRequested,
            crop.amountPaid,
            crop.pricePerUnit,
            crop.totalUnits,
            crop.availableUnits,
            crop.harvestDate,
            crop.isFinalized
        );
    }
}
