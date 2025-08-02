// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Token} from "./Token.sol";
import {Exchange} from "./Exchange.sol";

contract FlashLoanUser {
    address exchange;

    constructor(address _exchange) {
        exchange = _exchange;
    }

    function getFlashLoan(address _token, uint256 _amount) external {
        // Call exchange for flash loan
        Exchange(exchange).flashLoan(_token, _amount, "");
    }

}
