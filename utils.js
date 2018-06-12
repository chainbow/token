/**
 * Created by lilong on 2017/04/04.
 */
// const Web3 = require('web3')
// const web3 = new Web3();
const logger = require('tracer').console({
  level: 'log',
  inspectOpt: {
    showHidden: true, //the object's non-enumerable properties will be shown too
    depth: null
  }
});

const toWei = function (amount) {
  return web3.toWei(amount, 'ether');
}

const toEtherString = function (number) {
  return web3.fromWei(number, 'ether').toString(10);
}

function convertDecimals(number) {
  return web3.toBigNumber(10).pow(18).mul(number);
}

function wait(ms) {
  let start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

module.exports = {
  logger, toWei, convertDecimals, wait, toEtherString
};
