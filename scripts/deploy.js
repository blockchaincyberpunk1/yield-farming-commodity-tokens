// Importing ethers from Hardhat package
const { ethers } = require("hardhat");

async function main() {
  // Deploying the CommodityToken
  const CommodityToken = await ethers.getContractFactory("CommodityToken");
  // You can set the initial parameters as per your requirements
  const commodityToken = await CommodityToken.deploy("CommodityToken", "CTK", ethers.utils.parseEther("1000000"));
  await commodityToken.deployed();
  console.log(`CommodityToken deployed to: ${commodityToken.address}`);

  // Assuming the CommodityToken is used as the reward token as well
  // If different, deploy or specify the reward token separately
  const rewardTokenAddress = commodityToken.address; 

  // Deploying the YieldFarming contract
  const YieldFarming = await ethers.getContractFactory("YieldFarming");
  const yieldFarming = await YieldFarming.deploy(commodityToken.address, rewardTokenAddress);
  await yieldFarming.deployed();
  console.log(`YieldFarming deployed to: ${yieldFarming.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
