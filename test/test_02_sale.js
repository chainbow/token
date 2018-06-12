const Token = artifacts.require('./ChainBowToken.sol');
const TokenSale = artifacts.require('./ChainBowPrivateSale.sol');

const config = require("../config");
const tokenConfig = config.token;
const tokenSaleConfig = config.tokenSale;

const utils = require('../utils');
const logger = utils.logger;
const toWei = utils.toWei;
const convertDecimals = utils.convertDecimals;


contract('Test sale contract', function (accounts) {

  console.log(accounts)

  const owner = accounts[0];
  const teamWallet = accounts[1];

  let tokenInstance = null;
  let tokenSaleInstance = null;

  //Fetch deployed contracts
  before("fetch deployed instances", async function () {
    tokenInstance = await Token.deployed()
    tokenSaleInstance = await TokenSale.deployed()

  });

  it("Contract Info will correct", async () => {

    //Sale Contract
    const leader = await tokenSaleInstance.leader()
    logger.log(leader)
    assert.equal(leader, tokenSaleConfig.leader);

    const rate = await tokenSaleInstance.rate()
    logger.log(rate.toString(10))
    assert.equal(rate, tokenSaleConfig.rate);

    const wallet = await tokenSaleInstance.teamWallet()
    logger.log(wallet)
    assert.equal(wallet, teamWallet);

    const tokenContract = await tokenSaleInstance.tokenContract()
    logger.log(tokenContract)
    assert.equal(tokenContract, tokenInstance.address);

    const totalSaleAmount = convertDecimals(tokenSaleConfig.totalSaleAmount);

    const allowance = await tokenInstance.allowance(teamWallet, tokenSaleInstance.address)
    logger.log(allowance.toString(10))
    assert.equal(allowance.toString(10), totalSaleAmount.toString(10));

  });

  it("buy method", async function () {
    let buyer = accounts[2];

    logger.log(buyer);

    const ethBalance = web3.eth.getBalance(tokenSaleInstance.address);
    logger.info(utils.toEtherString(ethBalance));

    assert.equal(utils.toEtherString(ethBalance), '0');

    const tokenBalance = await tokenInstance.balanceOf(buyer);
    logger.info(utils.toEtherString(tokenBalance));

    assert.equal(utils.toEtherString(tokenBalance), '0');

    const totalSupply = await tokenSaleInstance.totalSupply();
    logger.info(utils.toEtherString(totalSupply));

    assert.equal(utils.toEtherString(totalSupply), '0');
    const allowance = await tokenInstance.allowance(teamWallet, tokenSaleInstance.address)
    logger.log(utils.toEtherString(allowance))
    assert.equal(utils.toEtherString(allowance), tokenSaleConfig.totalSaleAmount);


    const value = 1; //1eth

    let result = await tokenSaleInstance.buy(buyer, {value: toWei(value), gas: 180000, from: buyer});
    logger.info(result);
    const event = result.logs[0].args;
    logger.info(event.sender, event.recipient, event.value, event.tokens);
    assert.equal(event.sender, buyer);
    assert.equal(event.recipient, buyer);
    assert.equal(utils.toEtherString(event.value), '1');
    assert.equal(utils.toEtherString(event.tokens), '5000');


    {
      const result = web3.eth.getBalance(tokenSaleInstance.address);
      logger.info(utils.toEtherString(result));
      assert.equal(ethBalance.plus(toWei(value)).toString(10), result.toString(10))

    }

    {
      const result = await tokenInstance.balanceOf(buyer);
      logger.info(utils.toEtherString(result));
      assert.equal(tokenBalance.plus(toWei(value * 5000)).toString(10), result.toString(10))

    }

    {
      const result = await tokenSaleInstance.totalSupply();
      logger.info(utils.toEtherString(result));
      assert.equal(totalSupply.plus(toWei(value * 5000)).toString(10), result.toString(10))

    }

    {
      const result = await tokenInstance.allowance(teamWallet, tokenSaleInstance.address)
      logger.log(utils.toEtherString(result))
      assert.equal(allowance.minus(toWei(value * 5000)).toString(10), result.toString(10))
    }

  });


  it("default method", async function () {
    let buyer = accounts[3];

    logger.log(buyer);

    const ethBalance = web3.eth.getBalance(tokenSaleInstance.address);
    logger.info(utils.toEtherString(ethBalance));

    const tokenBalance = await tokenInstance.balanceOf(buyer);
    logger.info(utils.toEtherString(tokenBalance));

    const totalSupply = await tokenSaleInstance.totalSupply();
    logger.info(utils.toEtherString(totalSupply));

    const allowance = await tokenInstance.allowance(teamWallet, tokenSaleInstance.address)
    logger.log(utils.toEtherString(allowance))


    const value = 2; //1eth

    let result = await tokenSaleInstance.sendTransaction({value: toWei(value), gas: 180000, from: buyer});
    logger.info(result);
    const event = result.logs[0].args;
    logger.info(event.sender, event.recipient, event.value, event.tokens);
    assert.equal(event.sender, buyer);
    assert.equal(event.recipient, buyer);
    assert.equal(utils.toEtherString(event.value), '2');
    assert.equal(utils.toEtherString(event.tokens), '10000');


    {
      const result = web3.eth.getBalance(tokenSaleInstance.address);
      logger.info(utils.toEtherString(result));
      assert.equal(ethBalance.plus(toWei(value)).toString(10), result.toString(10))

    }

    {
      const result = await tokenInstance.balanceOf(buyer);
      logger.info(utils.toEtherString(result));
      assert.equal(tokenBalance.plus(toWei(value * 5000)).toString(10), result.toString(10))

    }

    {
      const result = await tokenSaleInstance.totalSupply();
      logger.info(utils.toEtherString(result));
      assert.equal(totalSupply.plus(toWei(value * 5000)).toString(10), result.toString(10))

    }

    {
      const result = await tokenInstance.allowance(teamWallet, tokenSaleInstance.address)
      logger.log(utils.toEtherString(result))
      assert.equal(allowance.minus(toWei(value * 5000)).toString(10), result.toString(10))
    }

  });

  it("withdraw method", async function () {
    let buyer = accounts[3];

    logger.log(buyer);

    const ethBalance = web3.eth.getBalance(tokenSaleInstance.address);
    logger.info(utils.toEtherString(ethBalance));

    const tokenBalance = await tokenInstance.balanceOf(buyer);
    logger.info(utils.toEtherString(tokenBalance));

    const totalSupply = await tokenSaleInstance.totalSupply();
    logger.info(utils.toEtherString(totalSupply));

    const allowance = await tokenInstance.allowance(teamWallet, tokenSaleInstance.address)
    logger.log(utils.toEtherString(allowance))

    const teamEthBalance = web3.eth.getBalance(teamWallet);
    logger.info(utils.toEtherString(teamEthBalance));


    let result = await tokenSaleInstance.withdrawEth({gas: 180000, from: owner});
    logger.info(result);
    const gasUsed = result.receipt.gasUsed;

    {
      const result = web3.eth.getBalance(tokenSaleInstance.address);
      logger.info(utils.toEtherString(result));
      assert.equal(result.toString(10), '0')

    }

    {
      const result = await tokenInstance.balanceOf(buyer);
      logger.info(utils.toEtherString(result));
      assert.equal(tokenBalance.toString(10), result.toString(10))

    }

    {
      const result = await tokenSaleInstance.totalSupply();
      logger.info(utils.toEtherString(result));
      assert.equal(totalSupply.toString(10), result.toString(10))

    }

    {
      const result = await tokenInstance.allowance(teamWallet, tokenSaleInstance.address)
      logger.log(utils.toEtherString(result))
      assert.equal(allowance.toString(10), result.toString(10))
    }

    {
      const result = web3.eth.getBalance(teamWallet);
      logger.info(utils.toEtherString(result));
      assert.equal(teamEthBalance.plus(ethBalance).toString(10), result.toString(10))

    }

  });


});
