const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

const { deployExchangeFixture, depositExchangeFixture } = require("./helpers/ExchangeFixtures")

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 18)
}

describe("Exchange", () => {
  describe("Deployment", () => {
    it("tracks the fee account", async () => {
      const { exchange, accounts } = await loadFixture(deployExchangeFixture)
      expect(await exchange.feeAccount()).to.equal(accounts.feeAccount.address)
    })

    it("tracks the fee percent", async () => {
      const { exchange } = await loadFixture(deployExchangeFixture)
      expect(await exchange.feePercent()).to.equal(10)
    })
  })

  describe("Depositing Tokens", () => {
    const AMOUNT = tokens("100")

    describe("Success", () => {
      it("tracks the token deposit", async () => {
        const { tokens: { token0 }, exchange, accounts } = await loadFixture(depositExchangeFixture)
        expect(await token0.balanceOf(await exchange.getAddress())).to.equal(AMOUNT)
        expect(await exchange.totalBalanceOf(await token0.getAddress(), accounts.user1.address))
      })

      it("emits a TokenDeposited event", async () => {
        const { tokens: { token0 }, exchange, accounts, transaction } = await loadFixture(depositExchangeFixture)
        await expect(transaction).to.emit(exchange, "TokensDeposited")
          .withArgs(
            await token0.getAddress(),
            accounts.user1.address,
            AMOUNT,
            AMOUNT
          )
      })
    })

    describe("Failure", () => {
      it("fails when no tokens are approved", async () => {
        const { tokens: { token0 }, exchange, accounts } = await loadFixture(deployExchangeFixture)
        await expect(exchange.connect(accounts.user1)
          .depositToken(await token0.getAddress(), AMOUNT)).to.be.reverted
      })
    })
  })
})
