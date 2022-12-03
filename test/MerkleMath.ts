import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Parser } from 'json2csv'
import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree"
import fs from "fs"

describe("MerkleMath", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const MerkleMath = await ethers.getContractFactory("MerkleMath");
    const merkleMath = await MerkleMath.deploy();

    return { merkleMath, owner, otherAccount };
  }

  it("Merkle gas", async function () {
    const { merkleMath } = await loadFixture(deployFixture);

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
      const result = await merkleMath.log10(0n, x, logX64, proof)
      const gas = await merkleMath.log10GasCost(0n, x, logX64, proof)

      values.push({
        i: x,
        log: result.toString(),
        gas: gas.toString()
      })
    }

    const json2csvParser = new Parser()
    const csv = json2csvParser.parse(values)

    fs.writeFileSync('benchmarks/merkle.csv', csv)
  });
});
