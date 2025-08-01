const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

const { deployExchangeFixture, depositExchangeFixture, orderExchangeFixture } = require("./helpers/ExchangeFixtures")

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
        expect(await exchange.totalBalanceOf(await token0.getAddress(), accounts.user1.address)).to.equal(AMOUNT)
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

    describe("Withdrawing Tokens", () => {
    const AMOUNT = tokens("100")

    describe("Success", () => {
      it("withdraws token funds", async () => {
        const { tokens: { token0 }, exchange, accounts } = await loadFixture(depositExchangeFixture)

        // Now withdraw tokens
        const transaction = await exchange.connect(accounts.user1).withdrawToken(await token0.getAddress(), AMOUNT)
        await transaction.wait()

        expect(await token0.balanceOf(await exchange.getAddress())).to.equal(0)
        expect(await exchange.totalBalanceOf(await token0.getAddress(), accounts.user1.address)).to.equal (0)
      })

      it("emits a TokensWithdrawn event", async () => {
        const { tokens: { token0 }, exchange, accounts } = await loadFixture(depositExchangeFixture)

        const transaction = await exchange.connect(accounts.user1).withdrawToken(await token0.getAddress(), AMOUNT)
        await transaction.wait()

        await expect(transaction).to.emit(exchange, "TokensWithdrawn")
          .withArgs(
            await token0.getAddress(),
            accounts.user1.address,
            AMOUNT,
            0
          )
      })
    })

    describe("Failure", () => {
      it("fails for insufficient balances", async () => {
        const { tokens: { token0 }, exchange, accounts } = await loadFixture(deployExchangeFixture)
        const ERROR = "Exchange: Insufficient balance"

        await expect(exchange.connect(accounts.user1)
          .withdrawToken(await token0.getAddress(), AMOUNT))
            .to.be.revertedWith(ERROR)
      })
    })
  })

    describe("Making Orders", () => {

      describe("Success", () => {
        it("tracks the newly created order", async () => {
          const { exchange } = await loadFixture(orderExchangeFixture)
          expect(await exchange.orderCount()).to.equal(1)
        })

        it("emits an OrderCreated event", async () => {
          const { tokens: { token0, token1 }, exchange, accounts, transaction } = await loadFixture(orderExchangeFixture)

          const ORDER_ID = 1
          const AMOUNT = tokens(1)
          const { timestamp } = await ethers.provider.getBlock()
        
          await expect(transaction).to.emit(exchange, "OrderCreated")
            .withArgs(
              ORDER_ID,
              accounts.user1.address,
              await token1.getAddress(),
              AMOUNT,
              await token0.getAddress(),
              AMOUNT,
              timestamp
            );
        })
      })

      describe("Failure", () => {
        it("rejects with no balance", async () => {
          const { tokens: { token0, token1 }, exchange, accounts } = await loadFixture(deployExchangeFixture)
          const ERROR = "Exchange: Insufficient balance"

          await expect(exchange.connect(accounts.user1).makeOrder(
            await token1.getAddress(),
            tokens(1),
            await token0.getAddress(),
            tokens(1)
          )).to.be.revertedWith(ERROR)
        })
      })
    })

    describe("Cancelling Orders", () => {

      describe("Success", () => {
        it("updates cancelled orders", async () => {
          const { exchange, accounts } = await loadFixture(orderExchangeFixture)
          
          const transaction = await exchange.connect(accounts.user1).cancelOrder(1)
          await transaction.wait()

          expect(await exchange.isOrderCancelled(1)).to.equal(true)
        })

        it("emits an OrderCancelled event", async () => {
          const { tokens: { token0, token1 }, exchange, accounts } = await loadFixture(orderExchangeFixture)

          const transaction = await exchange.connect(accounts.user1).cancelOrder(1)
          await transaction.wait()

          const ORDER_ID = 1
          const AMOUNT = tokens(1)
          const { timestamp } = await ethers.provider.getBlock()
        
          await expect(transaction).to.emit(exchange, "OrderCancelled")
            .withArgs(
              ORDER_ID,
              accounts.user1.address,
              await token1.getAddress(),
              AMOUNT,
              await token0.getAddress(),
              AMOUNT,
              timestamp
            );
        })
      })

      describe("Failure", () => {
        it("rejects invalid order ids", async () => {
          const { exchange, accounts } = await loadFixture(orderExchangeFixture)
          const ERROR = "Exchange: Order does not exist"

          await expect(exchange.connect(accounts.user1).cancelOrder(99999)).to.be.revertedWith(ERROR)
        })

        it("rejects unauthorized cancellations", async () => {
          const { exchange, accounts } = await loadFixture(orderExchangeFixture)
          const ERROR = "Exchange: Not the owner"

          await expect(exchange.connect(accounts.user2).cancelOrder(1)).to.be.revertedWith(ERROR)
        })
      })
    })
})
