import { ethers } from "hardhat";

async function main() {
  const Calculator = await ethers.getContractFactory("Calculator", {
    libraries: {
      MerkleMath: '0x842F183E400560bDB47Cf6e5c972CDE1bfe3aDd1'
    }
  });
  const calculator = await Calculator.deploy();

  await calculator.deployed();

  console.log(`Log storage deployed to ${calculator.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
