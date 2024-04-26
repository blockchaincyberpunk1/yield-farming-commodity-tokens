const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YieldFarming", function () {
    let CommodityToken, commodityToken, YieldFarming, yieldFarming;
    let owner, addr1, addr2, addrs;

    beforeEach(async function () {
        // Deploy the staking token
        CommodityToken = await ethers.getContractFactory("CommodityToken");
        commodityToken = await CommodityToken.deploy("CommodityToken", "CTK", ethers.utils.parseEther("1000000"));
        await commodityToken.deployed();

        // Deploy the YieldFarming contract
        YieldFarming = await ethers.getContractFactory("YieldFarming");
        yieldFarming = await YieldFarming.deploy(commodityToken.address, commodityToken.address);
        await yieldFarming.deployed();

        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Distribute some tokens to addr1 for testing
        await commodityToken.transfer(addr1.address, ethers.utils.parseEther("1000"));
        await commodityToken.connect(addr1).approve(yieldFarming.address, ethers.utils.parseEther("1000"));
    });

    describe("Staking and Unstaking", function () {
        it("Should allow a user to stake and unstake tokens", async function () {
            // Stake tokens
            await yieldFarming.connect(addr1).stake(ethers.utils.parseEther("100"));
            expect(await yieldFarming.balances(addr1.address)).to.equal(ethers.utils.parseEther("100"));
            expect(await yieldFarming.totalStaked()).to.equal(ethers.utils.parseEther("100"));

            // Unstake tokens
            await yieldFarming.connect(addr1).unstake(ethers.utils.parseEther("100"));
            expect(await yieldFarming.balances(addr1.address)).to.equal(ethers.utils.parseEther("0"));
            expect(await yieldFarming.totalStaked()).to.equal(ethers.utils.parseEther("0"));
        });

        it("Should fail to stake 0 tokens", async function () {
            await expect(yieldFarming.connect(addr1).stake(0)).to.be.revertedWith("Cannot stake 0 tokens");
        });
    });

    describe("Reward Distribution", function () {
        beforeEach(async function () {
            // Stake tokens by addr1
            await yieldFarming.connect(addr1).stake(ethers.utils.parseEther("100"));
        });

        it("Should distribute rewards correctly", async function () {
            const initialBalance = await commodityToken.balanceOf(addr1.address);
            await yieldFarming.distributeRewards(); // Owner calls to distribute rewards

            // Expect addr1 to receive 1% of staked amount as reward
            expect(await commodityToken.balanceOf(addr1.address)).to.equal(initialBalance.add(ethers.utils.parseEther("1")));
        });

        it("Only owner can distribute rewards", async function () {
            await expect(yieldFarming.connect(addr1).distributeRewards())
                .to.be.revertedWith("OwnableUnauthorizedAccount");
        });
    });
});
