import BigNumber from "bignumber.js"
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import * as fs from 'fs/promises'

async function main() {
  const values: [string, string][] = []

  // find power of 2^i for i in 0.000 to 0.999
  for (let i = 0; i < 1000; i++) {
    const antilog = Math.pow(2, i / 1000)
    const x64 = new BigNumber(2).pow(64)

    const antilogX64 = new BigNumber(antilog).multipliedBy(x64)
    const antilogX64String = antilogX64.toFixed(0, BigNumber.ROUND_DOWN)

    // logMul1000, antilogX64
    values.push([i.toString(), antilogX64String])
  }

  const tree = StandardMerkleTree.of(values, ["uint16", "uint128"])
  console.log('merkle root', tree.root)
  await fs.writeFile('antilogTree.json', JSON.stringify(tree.dump()))
}

main()
