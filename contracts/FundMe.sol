// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

//import "@chainlink/contracts/src/v0.8/interfaces/FeedRegistryInterface.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
//import "./Denominations.sol";

error FundMe__NotOwner();

contract FundMe {
    using PriceConverter for uint256;
    //using Denominations for address;

    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;

    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address private immutable i_Owner;
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    
    AggregatorV3Interface private s_priceFeed;

    constructor(address priceFeedAddress) {
        i_Owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }
    
    function getVersion() public view returns (uint256){
        // ETH/USD price feed address of Sepolia Network.
        return s_priceFeed.version();
    }
    
    modifier onlyOwner {
        // require(msg.sender == owner);
        if (msg.sender != i_Owner) revert FundMe__NotOwner();
        _;
    }
    
    function withdraw() public payable onlyOwner {
        for (uint256 funderIndex=0; funderIndex < s_funders.length; funderIndex++){
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccess, ) = i_Owner.call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;

        for (uint256 funderIndex=0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccess, ) = i_Owner.call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    function getOwner() public view returns (address) {
        return i_Owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
