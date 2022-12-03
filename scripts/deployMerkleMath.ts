import { ethers } from "hardhat";

async function main() {
  const MerkleMath = await ethers.getContractFactory("MerkleMath");
  const merkleMath = await MerkleMath.deploy();

  await merkleMath.deployed();

  console.log(`Merkle log deployed to ${merkleMath.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
