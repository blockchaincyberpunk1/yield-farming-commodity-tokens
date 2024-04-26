const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CommodityToken", function () {
  let CommodityToken;
  let commodityToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    CommodityToken = await ethers.getContractFactory("CommodityToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new CommodityToken contract before each test.
    commodityToken = await CommodityToken.deploy("CommodityToken", "CTK", ethers.utils.parseEther("1000000"));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await commodityToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await commodityToken.balanceOf(owner.address);
      expect(await commodityToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await commodityToken.transfer(addr1.address, 50);
      const addr1Balance = await commodityToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await commodityToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await commodityToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await commodityToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens), which should fail.
      await expect(
        commodityToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20InsufficientBalance");

      // Owner balance shouldn't have changed.
      expect(await commodityToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Minting and Burning", function () {
    it("Should mint new tokens", async function () {
      // Mint 100 new tokens to addr1
      await commodityToken.mint(addr1.address, 100);
      expect(await commodityToken.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should burn tokens", async function () {
      // First mint some tokens to addr1
      await commodityToken.mint(addr1.address, 100);

      // Now burn them
      await commodityToken.burn(addr1.address, 50);
      const balanceAfterBurn = await commodityToken.balanceOf(addr1.address);
      expect(balanceAfterBurn).to.equal(50);
    });
  });
});
