"use strict";
var  SingularityNetToken = artifacts.require("./SingularityNetToken.sol");

let Contract = require("@truffle/contract");

var ethereumjsabi  = require('ethereumjs-abi');
var ethereumjsutil = require('ethereumjs-util');

async function testErrorRevert(prom)
{
    let rezE = -1
    try { await prom }
    catch(e) {
        rezE = e.message.indexOf('revert');
        //console.log("Catch Block: " + e.message);
    }
    assert(rezE >= 0, "Must generate error and error message must contain revert");
}
  
contract('SingularityNetToken', function(accounts) {

    var singularityNetToken;
    
    before(async () => 
        {
            singularityNetToken = await SingularityNetToken.deployed();
        });

        const getInitialSupplyAndVerify = async (_totalSupply) => {
            
            const totalSupply = await singularityNetToken.totalSupply.call()

            assert.equal(totalSupply.toNumber(), _totalSupply);
        }

        const getDecimalsAndVerify = async (_decimals) => {

            const decimals = await singularityNetToken.decimals.call()

            assert.equal(decimals.toNumber(), _decimals);

        }

        const mintAndVerify = async (_account, _amount) => {

            const totalSupply_b = await singularityNetToken.totalSupply.call()
            const wallet_bal_b = (await singularityNetToken.balanceOf(_account)).toNumber();

            await singularityNetToken.mint(_account, _amount, {from:_account})

            const totalSupply_a = await singularityNetToken.totalSupply.call()
            const wallet_bal_a = (await singularityNetToken.balanceOf(_account)).toNumber();

            assert.equal(totalSupply_b.toNumber() + _amount, totalSupply_a.toNumber());
            assert.equal(wallet_bal_b + _amount, wallet_bal_a);

        }

        const getRandomNumber = (max) => {
            const min = 10; // To avoid zero rand number
            return Math.floor(Math.random() * (max - min) + min);
        }

        const sleep = async (sec) => {
            console.log("Waiting for cycle to complete...Secs - " + sec);
            return new Promise((resolve) => {
                setTimeout(resolve, sec * 1000);
              });
        }

    // ************************ Test Scenarios Starts From Here ********************************************

    it("0. Initial Deployment Configuration - Decimals, Initial Suppy and Owner", async function() 
    {
        // accounts[0] -> Contract Owner

        // Check for the Initial Supply which Should be Zero
        await getInitialSupplyAndVerify(0);

        // Check for the Configured Decimals - Should be 8
        await getDecimalsAndVerify(8);

    });

    it("0. Mint Token - First & sub sequent mints", async function() 
    {
        // accounts[0] -> Contract Owner

        // Mint 10M tokens
        const mintAmount = 1000000000000000;
        await mintAndVerify(accounts[0], mintAmount);

        // Test minting with a different Account - Should Fail
        await testErrorRevert(singularityNetToken.mint(accounts[1], mintAmount, {from:accounts[1]}));

        // Try to Mint more than Initial Supply
        const initSupply = "100000000000000000"
        await testErrorRevert(singularityNetToken.mint(accounts[0], initSupply, {from:accounts[0]}));

    });

});
