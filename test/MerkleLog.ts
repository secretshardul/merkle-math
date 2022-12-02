import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree"
import fs from "fs"

describe("MerkleLog", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const MerkleLog = await ethers.getContractFactory("MerkleLog");
    const merkleLog = await MerkleLog.deploy();

    return { merkleLog, owner, otherAccount };
  }

  it("ABDK gas", async function () {
    const { merkleLog } = await loadFixture(deployFixture);

    const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json").toString()))

    const values = []
    for (let x = 100; x < 1000; x++) {
      let proof: string[] | undefined
      let logX64: string | undefined

      for (const [i, v] of tree.entries()) {
        if (v[0] === x.toString()) {
          proof = tree.getProof(i);
          logX64 = v[1]
        }
      }

      if (!proof || !logX64) {
        throw Error('Not found')
      }
      const result = await merkleLog.log10(x, logX64, proof)
      const gas = await merkleLog.log10GasCost(x, logX64, proof)

      values.push({
        i: x,
        log: result.toString(),
        gas: gas.toString()
      })
    }

    fs.writeFileSync('merkle-benchmark.json', JSON.stringify(values))

  });
});
