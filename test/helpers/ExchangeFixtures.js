const { ethers } = require("hardhat")

async function deployExchangeFixture() {
  const Exchange = await ethers.getContractFactory("Exchange")

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]
  const feeAccount = accounts[1] // fee account

  const FEE_PERCENT = 10
  const exchange = await Exchange.deploy(feeAccount, FEE_PERCENT)

  return { exchange, accounts: { deployer, feeAccount } }
}

module.exports = {
  deployExchangeFixture
}
