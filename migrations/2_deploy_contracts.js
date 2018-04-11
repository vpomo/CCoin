const CCNCrowdsale = artifacts.require('./CCNCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x1e0f376404082f151f06cfa3FD308c339C7475cb";

    deployer.deploy(CCNCrowdsale, owner);

};
