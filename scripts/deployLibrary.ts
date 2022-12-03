import { ethers } from "hardhat";

async function main() {
  const MerkleLog = await ethers.getContractFactory("MerkleLog");
  const merkleLog = await MerkleLog.deploy();

  await merkleLog.deployed();

  console.log(`Merkle log deployed to ${merkleLog.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
