async function deployTokenFixture () {
  const Token = await ethers.getContractFactory("Token")
  const token = await Token.deploy("NMZia Token", "ZIA", "1000000")

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]
  const receiver = accounts[1]

  return { token, deployer, receiver }
}

module.exports = {
    deployTokenFixture
}
