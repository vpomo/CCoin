var CCNCrowdsale = artifacts.require("./CCNCrowdsale.sol");
//import assertRevert from './helpers/assertRevert';

contract('CCNCrowdsale', (accounts) => {
    var contract;
    //var owner = "0x1e0f376404082f151f06cfa3FD308c339C7475cb";
    var owner = accounts[0];
    var rate = Number(1915);
    var buyWei = 1 * 10**18;
    var rateNew = Number(1915);
    var buyWeiNew = 5 * 10**17;
    var buyWeiMin = 1 * 10**15;
    var totalSupply = 9e+25;

    it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await CCNCrowdsale.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
    });

    it('verification balance owner contract', async ()  => {
        var balanceOwner = await contract.balanceOf(owner);
        //console.log("balanceOwner = " + balanceOwner);
        assert.equal(totalSupply, balanceOwner);
    });


    it('verification of receiving Ether', async ()  => {
        await contract.addToWhitelist(accounts[0], {from:accounts[0]});
        await contract.addToWhitelist(accounts[2], {from:accounts[0]});
        await contract.addToWhitelist(accounts[3], {from:accounts[0]});

        var tokenAllocatedBefore = await contract.tokenAllocated.call();
        var balanceAccountTwoBefore = await contract.balanceOf(accounts[2]);
        var weiRaisedBefore = await contract.weiRaised.call();
        //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);

        var numberToken = await contract.validPurchaseTokens.call(Number(buyWei));
        //console.log(" numberTokens = " + JSON.stringify(numberToken));
        //console.log("numberTokens = " + numberToken);

        await contract.buyTokens(accounts[2],{from:accounts[2], value:buyWei});
        var tokenAllocatedAfter = await contract.tokenAllocated.call();
        //console.log("tokenAllocatedAfter = " + tokenAllocatedAfter);
        assert.isTrue(tokenAllocatedBefore < tokenAllocatedAfter);
        assert.equal(0, tokenAllocatedBefore);
        assert.equal(rate*buyWei, tokenAllocatedAfter);

       var balanceAccountTwoAfter = await contract.balanceOf(accounts[2]);
        assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(rate*buyWei, balanceAccountTwoAfter);

        var weiRaisedAfter = await contract.weiRaised.call();
        //console.log("weiRaisedAfter = " + weiRaisedAfter);
        assert.isTrue(weiRaisedBefore < weiRaisedAfter);
        assert.equal(0, weiRaisedBefore);
        assert.equal(buyWei, weiRaisedAfter);

        var depositedAfter = await contract.getDeposited.call(accounts[2]);
        //console.log("DepositedAfter = " + depositedAfter);
        assert.equal(buyWei, depositedAfter);

        var balanceAccountThreeBefore = await contract.balanceOf(accounts[3]);
        await contract.buyTokens(accounts[3],{from:accounts[3], value:buyWeiNew});
        var balanceAccountThreeAfter = await contract.balanceOf(accounts[3]);
        assert.isTrue(balanceAccountThreeBefore < balanceAccountThreeAfter);
        assert.equal(0, balanceAccountThreeBefore);
        //console.log("balanceAccountThreeAfter = " + balanceAccountThreeAfter);
        assert.equal(rateNew*buyWeiNew, balanceAccountThreeAfter);

        var balanceOwnerAfter = await contract.balanceOf(owner);
        //console.log("balanceOwnerAfter = " + Number(balanceOwnerAfter));
        //assert.equal(totalSupply - balanceAccountThreeAfter - balanceAccountTwoAfter, balanceOwnerAfter);
    });

    it('verification define period', async ()  => {
        var currentDate = 1525737400; // May, 07
        period = await contract.getPeriod(currentDate);
        assert.equal(10, period);

        currentDate = 1525737900; // May, 08
        period = await contract.getPeriod(currentDate);
        assert.equal(0, period);

        currentDate = 1527465600; // May, 28
        period = await contract.getPeriod(currentDate);
        //console.log("period=" + period);
        assert.equal(1, period);

        currentDate = 1532736000; // Jul, 28
        period = await contract.getPeriod(currentDate);
        assert.equal(2, period);

        currentDate = 1535414400; // Aug, 28
        period = await contract.getPeriod(currentDate);
        assert.equal(2, period);
    });

    it('verification of contract administrators', async ()  => {
        await contract.setContractAdmin(accounts[3], true, 0);
        var isAdminOne = await contract.contractAdmins.call(accounts[3]);
        assert.equal(true, isAdminOne);

        await contract.addToWhitelist(accounts[8]);
        var isWhitelist = await contract.whitelist.call(accounts[8]);
        assert.equal(true, isWhitelist);
    });

});



