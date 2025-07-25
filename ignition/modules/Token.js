const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TokenModule", (m) => {

  const token = m.contract("Token", [], {});

  return { token };
});
