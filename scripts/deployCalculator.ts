import { ethers } from "hardhat";

async function main() {
  const Calculator = await ethers.getContractFactory("Calculator", {
    libraries: {
      MerkleMath: '0xa622A85B2E007C8B9e02ba18970dA379B8308c93'
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
