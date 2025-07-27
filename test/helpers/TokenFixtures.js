async function deployTokenFixture() {
  const Token = await ethers.getContractFactory("Token")
  const token = await Token.deploy("NMZia Token", "ZIA", "1000000")

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]
  const receiver = accounts[1]
  const exchange = accounts[2]

  return { token, deployer, receiver, exchange }
}


async function transferFromTokenFixture() {
  const { token, deployer, receiver, exchange } = await deployTokenFixture()

  const AMOUNT = ethers.parseUnits("100", 18)

  // We don't need the transaction for the approve, so
  // we just wrap it in a await so we can still do .wait()
  await (await token.connect(deployer).approve(exchange.address, AMOUNT)).wait()

  const transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, AMOUNT)
  await transaction.wait()

  return { token, deployer, receiver, exchange, transaction }
}

module.exports = {
  deployTokenFixture,
  transferFromTokenFixture
}
