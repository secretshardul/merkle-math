import { StandardMerkleTree } from "@openzeppelin/merkle-tree"
import fs from "fs"

async function main() {
  const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json").toString()))

  const x = '690'

  for (const [i, v] of tree.entries()) {
    if (v[0] === x) {
      // (3)
      const proof = tree.getProof(i);
      console.log('Value:', v);
      console.log('Proof:', proof);
    }
  }
}

main()
