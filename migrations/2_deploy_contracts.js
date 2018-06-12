const Token = artifacts.require("./ChainBowToken.sol");
const TokenSale = artifacts.require("./ChainBowPrivateSale.sol");
const config = require("../config");
const tokenConfig = config.token;
const tokenSaleConfig = config.tokenSale;

const utils = require('../utils');
const logger = utils.logger;

function convertDecimals(number) {
  return web3.toBigNumber(10).pow(18).mul(number);
}

module.exports = async function(deployer, network, accounts) {

  const totalSupply = convertDecimals(tokenConfig.totalSupply);

  const totalSaleAmount = convertDecimals(tokenSaleConfig.totalSaleAmount);
  const ownerAddr = accounts[0];
  const teamWallet = accounts[1];
  let tokenInstance = null;
  let toknSaleInstance = null;

  logger.log(network, accounts)
  if (network === 'live') {
  } else if (network === 'testnet') {
  } else {
  }

  return deployer.deploy(Token,
    teamWallet,
    totalSupply,
    tokenConfig.name,
    tokenConfig.symbol,
    tokenConfig.decimals)
    .then(function () {
      return deployer.deploy(TokenSale, Token.address, teamWallet, tokenSaleConfig.leader, tokenSaleConfig.rate);
    })
    .then(() => {
      return Token.deployed();
    })
    .then(instance => {
      tokenInstance = instance;
      logger.log(tokenInstance.address);

      return TokenSale.deployed();
    })
    .then(instance => {
      toknSaleInstance = instance;
      logger.log(toknSaleInstance.address);
      return tokenInstance.approve(TokenSale.address, totalSaleAmount, {from: teamWallet});
    })
    .then(tx => {
      logger.log(tx)
      return tx;
   });

};
