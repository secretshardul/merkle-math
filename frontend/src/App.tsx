import { useEffect, useState } from 'react'
import { ethers, BigNumber as EthersBigNumber } from 'ethers'
import BigNumber from "bignumber.js"
import { useWallet } from 'use-wallet'
import Gist from 'react-gist'
import { StandardMerkleTree } from "@openzeppelin/merkle-tree"
import './App.css'
import { abi } from './contracts/Calculator.sol/Calculator.json'
import * as treeJson from './tree.json'

function App() {
  const wallet = useWallet()
  const provider = wallet.ethereum
    ? new ethers.providers.Web3Provider(wallet.ethereum)
    : null

  const [storedCharacteristic, setStoredCharacteristic] = useState(0)
  const [storedMantissa, setStoredMantissa] = useState(100)

  const [newX, setNewX] = useState<number>(1)
  const [storedLog, setStoredLog] = useState('0')

  useEffect(() => {
    if (!provider) {
      return
    }
    const calculator = new ethers.Contract('0x369b45A61F8B569300e6137F61cB42Dfb21Ab6Ba', abi, provider);

    calculator.storedCharacteristic()
      .then((value: number) => setStoredCharacteristic(value))

    calculator.storedMantissa()
      .then((value: number) => setStoredMantissa(value))

    calculator.storedLogX64()
      .then((value: EthersBigNumber) => {
        const x64 = new BigNumber(2).pow(64)
        const readableLog = new BigNumber(value.toString()).div(x64)
        setStoredLog(readableLog.toFixed(4, BigNumber.ROUND_DOWN))
      })

  }, [provider])


  async function updateLog() {
    if (!provider) {
      return
    }
    const calculator = new ethers.Contract('0x369b45A61F8B569300e6137F61cB42Dfb21Ab6Ba', abi, provider.getSigner())

    // Generate characteristic and mantissa
    const char = Math.floor(Math.log10(newX))

    let mantissa = newX
    if (newX < 1) {
      mantissa = Math.floor(newX * Math.pow(10, -char) * 100)
    } else if (newX < 10) {
      mantissa = Math.floor(newX * 100)
    } else if (newX < 100) {
      mantissa = Math.floor(newX * 10)
    } else if (newX > 999) {
      mantissa = Math.floor(newX / Math.pow(10, char - 2))
    }
    console.log('char', char, 'mantissa', mantissa)

    // Generate proof
    // @ts-ignore
    const tree = StandardMerkleTree.load(treeJson)

    let proof: string[] | undefined
    let logX64: string | undefined

    for (const [i, v] of tree.entries()) {
      if (v[0] === mantissa.toString()) {
        proof = tree.getProof(i);
        logX64 = v[1]
      }
    }

    if (!proof || !logX64) {
      throw Error('Not found')
    }
    const result = await calculator.updateLog(char, mantissa, logX64, proof, {
      gasLimit: 10_000_000
    })
    console.log('result', result)
  }

  const x = (Math.pow(10, storedCharacteristic) * storedMantissa / 100).toFixed(6)

  return (
    <div className="App">
      {/* <div>
        <img src="/napier-with-tree.png" className="logo" alt="Vite logo" />
      </div> */}
      <h1>Napier's Tree</h1>
      <p>A gas efficient library to find logarithm on chain, inspired by</p>
      <p>elementary school log tables. Lookup off-chain, prove on-chain.</p>

      <br />
      <h2>x = {x}, log (x) = {storedLog}</h2>
      <div className="card">
        <div>
          <input type="number"
            style={{ marginRight: 10 }}
            value={newX}
            onChange={event => setNewX(Number(event.target.value))}
          />

          {
            wallet.isConnected()
              ? <button onClick={updateLog}>
                Calculate log
              </button>
              : <button onClick={() => wallet.connect()}>Connect MetaMask</button>
          }

        </div>
      </div>
      <div>
        <p>
          Powered by ☕ at EthIndia 2022
        </p>
      </div>
      <br />
      <hr className="solid"></hr>
      <div>
        <h3>Why this library?</h3>
        <div style={{ textAlign: 'left' }}>
          <ul>
            <li>DeFi protocols often have math operations involving logarithm and exponent.</li>
            <li>Prominent such dapps are Uniswap, Balancer and Synthetix. They handle millions of dollars.</li>
            <li>3rd party libraries like ABDK were developed because Solidity lacks native log and exp.</li>
            <li>Existing libraries use a combination of iteration, bit shifting and 'magic numbers'.</li>
            <li>However they're complex gas intensive. Here's Uniswap's log function 🤯</li>
          </ul>

          <Gist id='ee990a596d44773b715e290db5f86b20' />
        </div>
      </div>

      <div>
        <h3>Enter Napier's bones ☠️😨</h3>
        <div style={{ textAlign: 'left' }}>
          <ul>
            <li>Napier's bones are tables of pre-calculated log and antilog (exponent) values.</li>
            <li>Popular in elementary school math, you lookup values in the table instead of calculating.</li>
            <li>Napier's bones meets merkle tree. First we store the merkle root of log table on chain.</li>
            <li>Now the log off-chain, then pass it as a parameter along with merkle proof.</li>
            <li>Here's the smart contract code</li>
          </ul>
        </div>

        <Gist id='00208b0fb3a06e25021846ce798c1938' />

        <h3>Benchmarks- 44% improvement in gas 🚀</h3>
        <img src="/benchmark.jpg" />
      </div>



    </div>
  )
}

export default App
