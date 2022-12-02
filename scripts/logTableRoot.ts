import BigNumber from "bignumber.js"

async function main() {
  // 1.000 to 1.999
  for (let i = 100; i < 1000; i++) {
    // find log
    // Divide i by 100 to convert 100 into 1.00
    const log = Math.log10(i / 100)
    const x64 = new BigNumber(2).pow(64)
    const logX64 = new BigNumber(log).multipliedBy(x64)

    console.log(logX64.toFixed(0, BigNumber.ROUND_DOWN))
  }
}

main()
