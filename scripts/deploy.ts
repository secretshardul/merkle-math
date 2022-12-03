import { ethers } from "hardhat";

async function main() {
  const LogStorage = await ethers.getContractFactory("LogStorage", {
    libraries: {
      MerkleLog: '0x842F183E400560bDB47Cf6e5c972CDE1bfe3aDd1'
    }
  });
  const logStorage = await LogStorage.deploy();

  await logStorage.deployed();

  console.log(`Log storage deployed to ${logStorage.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
