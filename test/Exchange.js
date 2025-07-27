const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

const { deployExchangeFixture } = require("./helpers/ExchangeFixtures")

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 18)
}

describe("Exchange", () => {
  describe("Deployment", () => {
    it("tracks the fee account", async () => {
      const { exchange, accounts } = await loadFixture(deployExchangeFixture);
      expect(await exchange.feeAccount()).to.equal(accounts.feeAccount.address)
    })

    it("tracks the fee percent", async () => {
      const { exchange } = await loadFixture(deployExchangeFixture);
      expect(await exchange.feePercent()).to.equal(10)
    })
  })
})
