async function deployTokenFixture () {
  const Token = await ethers.getContractFactory("Token")
  const token = await Token.deploy("NMZia Token", "ZIA", "1000000")

  return { token }
}

module.exports = {
    deployTokenFixture
}
