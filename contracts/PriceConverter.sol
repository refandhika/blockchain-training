// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/FeedRegistryInterface.sol";
import "./Denominations.sol";

library PriceConverter {
    using Denominations for address;
    function getPrice(FeedRegistryInterface priceFeed) internal view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData(
            Denominations.ETH,
            Denominations.USD
        );
        // ETH/USD rate in 18 digit
        return uint256(answer * 1e10);
    }

    function getConversionRate(uint256 ethAmount, FeedRegistryInterface priceFeed)
        internal
        view
        returns (uint256)
    {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}