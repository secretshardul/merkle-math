import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Parser } from 'json2csv'
import { ethers } from "hardhat";
import * as fs from 'fs/promises';

describe("AbdkLog", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const AbdkLog = await ethers.getContractFactory("AbdkLog");
    const abdkLog = await AbdkLog.deploy();

    return { abdkLog, owner, otherAccount };
  }

  it("ABDK gas", async function () {
    const { abdkLog } = await loadFixture(deployFixture);

    const values = []
    // log table has values for logs from 1.00 to 9.99 (less than 10)
    // (100 to 999) / 100
    // Value x = 10 in table stands for log (10 / 10 = 1)
    for (let i = 100; i < 1000; i++) {
      const numberX64 = (BigInt(i) << 64n) / 100n
      const [log, gas] = await Promise.all([
        abdkLog.log10(numberX64),
        abdkLog.log10GasCost(numberX64),
      ])
      values.push({
        i,
        log: log.toString(),
        gas: gas.toString()
      })
    }

    const json2csvParser = new Parser()
    const csv = json2csvParser.parse(values)

    await fs.writeFile('benchmarks/abdk.csv', csv)
  });
});
