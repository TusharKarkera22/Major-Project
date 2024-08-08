// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    address public admin;
    uint256 public campaignCount;

    // Campaign structure
    struct Campaign {
        string title;
        string description;
        string imageUrl;
        uint256 goal;
        uint256 fundsRaised;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
        bool exists;
    }

    // Mapping of campaign ID to Campaign struct
    mapping(uint256 => Campaign) public campaigns;

    // Event emitted when a campaign is created
    event CampaignCreated(
        uint256 id,
        string title,
        string description,
        string imageUrl,
        uint256 goal,
        uint256 startDate,
        uint256 endDate
    );

    // Event emitted when a donation is made
    event DonationMade(uint256 campaignId, uint256 amount);

    constructor() {
        admin = msg.sender;
    }

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Function to create a new campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _imageUrl,
        uint256 _goal,
        uint256 _startDate,
        uint256 _endDate
    ) public onlyAdmin {
        require(_startDate < _endDate, "Start date must be before end date");
        campaignCount++;
        campaigns[campaignCount] = Campaign({
            title: _title,
            description: _description,
            imageUrl: _imageUrl,
            goal: _goal,
            fundsRaised: 0,
            startDate: _startDate,
            endDate: _endDate,
            isActive: true,
            exists: true
        });
        emit CampaignCreated(campaignCount, _title, _description, _imageUrl, _goal, _startDate, _endDate);
    }

    // Function to get campaign details
    function getCampaign(uint256 _campaignId) public view returns (
        string memory title,
        string memory description,
        string memory imageUrl,
        uint256 goal,
        uint256 fundsRaised,
        uint256 startDate,
        uint256 endDate,
        bool isActive
    ) {
        Campaign memory campaign = campaigns[_campaignId];
        require(campaign.exists, "Campaign does not exist");

        return (
            campaign.title,
            campaign.description,
            campaign.imageUrl,
            campaign.goal,
            campaign.fundsRaised,
            campaign.startDate,
            campaign.endDate,
            campaign.isActive
        );
    }

    // Function to donate to a campaign
    function donateToCampaign(uint256 _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.exists, "Campaign does not exist");
        require(campaign.isActive, "Campaign is not active");
        require(block.timestamp >= campaign.startDate, "Campaign has not started yet");
        require(block.timestamp <= campaign.endDate, "Campaign has ended");
        require(msg.value > 0, "Donation amount must be greater than zero");

        campaign.fundsRaised += msg.value;
        emit DonationMade(_campaignId, msg.value);
    }

    // Function to deactivate a campaign (admin only)
    function deactivateCampaign(uint256 _campaignId) public onlyAdmin {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.exists, "Campaign does not exist");
        require(campaign.isActive, "Campaign is already inactive");

        campaign.isActive = false;
    }

    // Function to withdraw funds (admin only)
    function withdrawFunds(uint256 _campaignId) public onlyAdmin {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.exists, "Campaign does not exist");
        require(!campaign.isActive, "Campaign is still active");
        require(campaign.fundsRaised > 0, "No funds to withdraw");

        uint256 amount = campaign.fundsRaised;
        campaign.fundsRaised = 0;
        payable(admin).transfer(amount);
    }
}
