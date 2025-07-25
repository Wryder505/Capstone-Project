const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

const { deployTokenFixture } = require("./helpers/TokenFixtures")

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 18)
}

describe("Token", () => {

  it("has correct name", async () => {
    const { token } = await loadFixture(deployTokenFixture)
    expect(await token.name()).to.equal("NMZia Token")
  })

  it("has correct symbol", async () => {
    const { token } = await loadFixture(deployTokenFixture)
    expect(await token.symbol()).to.equal("ZIA")
  })

  it("has correct decimals", async () => {
    const { token } = await loadFixture(deployTokenFixture)
    expect(await token.decimals()).to.equal(18)
  })

  it("has correct totalSupply", async () => {
    const { token } = await loadFixture(deployTokenFixture)
    expect(await token.totalSupply()).to.equal(tokens("1000000"))
  })
})
