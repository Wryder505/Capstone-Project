// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Token} from "./Token.sol";

contract Exchange {
  // State variables
  address public feeAccount;
  uint256 public feePercent;

 // Total tokens belonging to a user
  mapping(address => mapping(address => uint256))
    private userTotalTokenBalance;

  // Events  
  event TokensDeposited(
    address token,
    address user,
    uint256 amount,
    uint256 balance
  );

  constructor(address _feeAccount, uint256 _feePercent) {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

// -------------------------------------------------------------------------------------------- //

// Deposit & Withdraw Token
  function depositToken(address _token, uint256 _amount) public {
    // Update user balance
    userTotalTokenBalance[_token][msg.sender] += _amount;

    // Emit an event
    emit TokensDeposited(
      _token, msg.sender,
      _amount,
      userTotalTokenBalance[_token][msg.sender]
    );

    // Transfer tokens to exchange 
    require(
      Token(_token).transferFrom(msg.sender, address(this), _amount),
      "Exchange: Token transfer failed"
    );
  }

  function totalBalanceOf(
    address _token,
    address _user
  ) public view returns (uint256) {
    return userTotalTokenBalance[_token][_user];
  }
}
 