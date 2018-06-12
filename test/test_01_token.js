const Token = artifacts.require('./ChainBowToken.sol');
const TokenSale = artifacts.require('./ChainBowPrivateSale.sol');

const config = require("../config");
const tokenConfig = config.token;
const tokenSaleConfig = config.tokenSale;

const utils = require('../utils');
const logger = utils.logger;
const toWei = utils.toWei;
const convertDecimals = utils.convertDecimals;

function getReceiverAddr(defaultAddr) {
  if (tokenSaleConfig.receiverAddr) {
    return tokenSaleConfig.receiverAddr;
  }
  return defaultAddr;
}


contract('Initial test', function (accounts) {

  logger.log(accounts);

  const admin = accounts[0];
  const teamWallet = accounts[1];

  const totalSaleAmount = convertDecimals(tokenSaleConfig.totalSaleAmount);
  const totalSupply = convertDecimals(tokenConfig.totalSupply);

  let tokenInstance = null;
  let tokenSaleInstance = null;

  //Fetch deployed contracts
  before("fetch deployed instances", async function () {
    tokenInstance = await Token.deployed()
    tokenSaleInstance = await TokenSale.deployed()

  });

  // it("Contract Token will deployed", () => {
  //   logger.log(tokenInstance.address)
  //   assert.notEqual(tokenInstance, null);
  // });
  //
  // it("Contract TokenSale will deployed", () => {
  //   logger.log(toknSaleInstance.address)
  //   assert.notEqual(toknSaleInstance, null);
  // });

  it("Contract Info will correct", async () => {

    //Token Contract
    const name = await tokenInstance.name()
    logger.log(name)
    assert.equal(name, tokenConfig.name);

    const symbol = await tokenInstance.symbol()
    logger.log(symbol)
    assert.equal(symbol, tokenConfig.symbol);

    const decimals = await tokenInstance.decimals()
    logger.log(decimals)
    assert.equal(decimals, tokenConfig.decimals);

    const supply = await tokenInstance.totalSupply()
    logger.log(supply.toString(10))
    assert.equal(supply.toString(10), totalSupply.toString(10));

    const teamBalance = await tokenInstance.balanceOf(teamWallet)
    logger.log(teamBalance.toString(10))
    assert.equal(teamBalance.toString(10), totalSupply.toString(10));

  });

  it("Transfer method", async () => {

    const member = accounts[2];
    logger.log(member);

    const teamBalance = await tokenInstance.balanceOf(teamWallet)
    logger.log(teamBalance.toString(10))

    const result = await tokenInstance.transfer(member, toWei(1), {from: teamWallet});
    logger.log(result);

    const newTeamBalance = await tokenInstance.balanceOf(teamWallet)
    logger.log(newTeamBalance.toString(10))
    assert.equal(newTeamBalance.toString(10), teamBalance.minus(toWei(1)).toString(10));

    const memberBalance = await tokenInstance.balanceOf(member)
    logger.log(memberBalance.toString(10))
    assert.equal(memberBalance.toString(10), toWei(1).toString());

  });

  it("ApproveAndTransferFrom method", async () => {

    const member1 = accounts[2];
    logger.log(member1);
    const member2 = accounts[3];
    logger.log(member2);

    const teamBalance = await tokenInstance.balanceOf(teamWallet)
    logger.log(teamBalance.toString(10))

    const member1Balance = await tokenInstance.balanceOf(member1)
    logger.log(member1Balance.toString(10))

    const member2Balance = await tokenInstance.balanceOf(member2)
    logger.log(member2Balance.toString(10))

    const result1 = await tokenInstance.approve(member1, toWei(10), {from: teamWallet});
    logger.log(result1);

    const result2 = await tokenInstance.transferFrom(teamWallet, member2, toWei(1), {from: member1});
    logger.log(result2);

    const newTeamBalance = await tokenInstance.balanceOf(teamWallet)
    logger.log(newTeamBalance.toString(10))
    assert.equal(newTeamBalance.toString(10), teamBalance.minus(toWei(1)).toString(10));

    {
      const balance = await tokenInstance.balanceOf(member1)
      logger.log(balance.toString(10))
      assert.equal(member1Balance.toString(10), balance.toString(10));
    }

    {
      const balance = await tokenInstance.balanceOf(member2);
      logger.log(balance.toString(10))
      assert.equal(member2Balance.add(toWei(1)).toString(10), balance.toString());
    }

  });

  it("burn method", async () => {

    const member = accounts[2];
    logger.log(member);

    const supply = await tokenInstance.totalSupply()
    logger.log(supply.toString(10))

    const teamBalance = await tokenInstance.balanceOf(teamWallet)
    logger.log(teamBalance.toString(10))

    const memberBalance = await tokenInstance.balanceOf(member)
    logger.log(memberBalance.toString(10))

    const result = await tokenInstance.transfer(member, toWei(10), {from: teamWallet});
    logger.log(result);

    const newTeamBalance = await tokenInstance.balanceOf(teamWallet)
    logger.log(newTeamBalance.toString(10))
    assert.equal(newTeamBalance.toString(10), teamBalance.minus(toWei(10)).toString(10));


      const newMemberBalance = await tokenInstance.balanceOf(member)
      logger.log(newMemberBalance.toString(10))
      assert.equal(newMemberBalance.toString(10), memberBalance.add(toWei(10)).toString(10));

    {
      const result = await tokenInstance.burn(toWei(2), {from:member})
      logger.log(result)

      const balance = await tokenInstance.balanceOf(member)
      logger.log(balance.toString(10))
      assert.equal(balance.toString(10), newMemberBalance.minus(toWei(2)).toString(10));

      const newSupply = await tokenInstance.totalSupply()
      assert.equal(newSupply.toString(10), supply.minus(toWei(2)).toString(10));

    }

  });


  it("freezeAndUnfreeze method", async () => {

    const member = accounts[2];
    logger.log(member);

    const supply = await tokenInstance.totalSupply()
    logger.log(supply.toString(10))

    const teamBalance = await tokenInstance.balanceOf(teamWallet)
    logger.log(teamBalance.toString(10))

    const memberBalance = await tokenInstance.balanceOf(member)
    logger.log(memberBalance.toString(10))

    const result = await tokenInstance.transfer(member, toWei(10), {from: teamWallet});
    logger.log(result);

    const newTeamBalance = await tokenInstance.balanceOf(teamWallet)
    logger.log(newTeamBalance.toString(10))
    assert.equal(newTeamBalance.toString(10), teamBalance.minus(toWei(10)).toString(10));


    const newMemberBalance = await tokenInstance.balanceOf(member)
    logger.log(newMemberBalance.toString(10))
    assert.equal(newMemberBalance.toString(10), memberBalance.add(toWei(10)).toString(10));

    {
      const result = await tokenInstance.freeze(toWei(2), {from:member})
      logger.log(result)

      const balance = await tokenInstance.balanceOf(member)
      logger.log(balance.toString(10))
      assert.equal(balance.toString(10), newMemberBalance.minus(toWei(2)).toString(10));

      const freeze = await tokenInstance.freezeOf(member)
      logger.log(freeze.toString(10))
      assert.equal(freeze.toString(10), toWei(2).toString(10));

      const newSupply = await tokenInstance.totalSupply()
      assert.equal(newSupply.toString(10), supply.toString(10));

    }

    {
      const result = await tokenInstance.unfreeze(toWei(1), {from:member})
      logger.log(result)

      const balance = await tokenInstance.balanceOf(member)
      logger.log(balance.toString(10))
      assert.equal(balance.toString(10), newMemberBalance.minus(toWei(1)).toString(10));

      const freeze = await tokenInstance.freezeOf(member)
      logger.log(freeze.toString(10))
      assert.equal(freeze.toString(10), toWei(1).toString(10));

      const newSupply = await tokenInstance.totalSupply()
      assert.equal(newSupply.toString(10), supply.toString(10));

    }
  });


  it("can't pay to token contract", async () => {

    const member = accounts[2];
    logger.log(member);

    try {
      let result = await tokenInstance.sendTransaction({value: toWei(1), gas: 180000, from: member});
      logger.log(result);
      assert.isOk(false, 'throw a exception');
    }catch(e) {
      logger.log(e)
      assert.instanceOf(e, Error)
    }

  });

  it("withdraw foreign tokens", async () => {

    const balance = await tokenInstance.balanceOf(tokenInstance.address)
    logger.log(balance.toString(10))

    {
      const result = await tokenInstance.transfer(tokenInstance.address, toWei(1), {from: teamWallet});
      logger.log(result);

      const balance = await tokenInstance.balanceOf(tokenInstance.address)
      logger.log(balance.toString(10))
      assert.equal(balance.toString(10), toWei(1).toString(10));

    }

    {

      const adminBalance = await tokenInstance.balanceOf(admin)
      logger.log(adminBalance.toString(10))

      const result = await tokenInstance.withdrawForeignTokens(tokenInstance.address, {from: admin});
      logger.log(result);

      const balance = await tokenInstance.balanceOf(tokenInstance.address)
      logger.log(balance.toString(10))
      assert.equal(balance.toString(10), toWei(0).toString(10));

      const newAdminBalance = await tokenInstance.balanceOf(admin)
      logger.log(newAdminBalance.toString(10))
      assert.equal(newAdminBalance.toString(10), adminBalance.add(toWei(1)).toString(10));

    }
  });

});