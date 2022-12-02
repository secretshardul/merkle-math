import BigNumber from "bignumber.js"
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import * as fs from 'fs/promises'

async function main() {
  const values: [string, string][] = []
  // 1.000 to 1.999
  for (let i = 100; i < 1000; i++) {
    // find log
    // Divide i by 100 to convert 100 into 1.00
    const log = Math.log10(i / 100)
    console.log(log)
    const x64 = new BigNumber(2).pow(64)
    const logX64 = new BigNumber(log).multipliedBy(x64)
    const logX64String = logX64.toFixed(0, BigNumber.ROUND_DOWN)

    values.push([i.toString(), logX64String])
  }

  const tree = StandardMerkleTree.of(values, ["uint16", "uint128"])
  console.log('merkle root', tree.root)
  await fs.writeFile('tree.json', JSON.stringify(tree.dump()))
}

main()
