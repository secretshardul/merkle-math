import { useEffect, useState } from 'react'
import { ethers, BigNumber as EthersBigNumber } from 'ethers'
import BigNumber from "bignumber.js"
import Gist from 'react-gist'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { Web3Provider } from '@ethersproject/providers'
import { StandardMerkleTree } from "@openzeppelin/merkle-tree"
import './App.css'
import { abi as calculatorAbi } from './contracts/Calculator.sol/Calculator.json'
import { abi as merkleMathAbi } from './contracts/MerkleMath.sol/MerkleMath.json'

import * as treeJson from './tree.json'
import * as antilogTreeJson from './antilogTree.json'

const x64 = new BigNumber(2).pow(64)

const contractAddresses: {
  [key: number]: {
      merkleMath: string;
      calculator: string;
  }
} = {
  80001: {
    merkleMath: '0xc12af78631eD26157B1ce37C680f99A5389cdf21',
    calculator: '0x369b45A61F8B569300e6137F61cB42Dfb21Ab6Ba',
  },
  338: {
    merkleMath: '0xa622A85B2E007C8B9e02ba18970dA379B8308c93',
    calculator: '0xbF3892B7A68e939bF1ca0DB5f91d5Cc73AaF779A',
  },
  8080: {
    merkleMath: '0xa622A85B2E007C8B9e02ba18970dA379B8308c93',
    calculator: '0x842F183E400560bDB47Cf6e5c972CDE1bfe3aDd1',
  }
}

function App() {
  const injectedConnector = new InjectedConnector({})
  const { chainId, account, activate, active, library } = useWeb3React<Web3Provider>()

  // @ts-ignore
  const ethereum = window.ethereum

  const provider = ethereum
    ? new ethers.providers.Web3Provider(ethereum)
    : null

  const [storedCharacteristic, setStoredCharacteristic] = useState(0)
  const [storedMantissa, setStoredMantissa] = useState(100)

  const [newX, setNewX] = useState<number>(1)
  const [storedLog, setStoredLog] = useState('0')

  // To find log or antilog
  const [isLog, setIsLog] = useState(true)

  // Antilog variables
  const [base, setBase] = useState(10)
  const [power, setPower] = useState(1)
  const [raised, setRaised] = useState<string>()

  // @ts-ignore
  const antilogTree = StandardMerkleTree.load(antilogTreeJson)

  useEffect(() => {
    if (!provider) {
      return
    }

    const merkleMath = new ethers.Contract(contractAddresses[chainId ?? 80001].merkleMath, merkleMathAbi, provider);
    async function getRaised() {
      // change of base
      const powerForBase2 = power * Math.log10(base) / Math.log10(2)

      // Separate characteristic and mantissa
      const characteristic = Math.floor(powerForBase2)
      const mantissa = powerForBase2 - characteristic

      const mantissaMul1000 = Math.floor(mantissa * 1000)

      let proof: string[] | undefined
      let antilog2X64ForMantissa: string | undefined

      for (const [i, v] of antilogTree.entries()) {
        if (v[0] === mantissaMul1000.toString()) {
          proof = antilogTree.getProof(i);
          antilog2X64ForMantissa = v[1]
        }
      }

      if (!proof || !antilog2X64ForMantissa) {
        throw Error('Not found')
      }

      const antilogX64 = await merkleMath.antilog(
        characteristic.toString(),
        mantissaMul1000,
        antilog2X64ForMantissa,
        proof
      )
      const convertedAntilog = new BigNumber(antilogX64.toString()).div(x64).toFixed(4, BigNumber.ROUND_DOWN)
      setRaised(convertedAntilog)
    }

    getRaised()
  }, [base, power])

  useEffect(() => {
    if (!provider) {
      return
    }
    const calculator = new ethers.Contract(contractAddresses[chainId ?? 80001].calculator, calculatorAbi, provider);

    calculator.storedCharacteristic()
      .then((value: number) => setStoredCharacteristic(value))

    calculator.storedMantissa()
      .then((value: number) => setStoredMantissa(value))

    calculator.storedLogX64()
      .then((value: EthersBigNumber) => {
        const readableLog = new BigNumber(value.toString()).div(x64)
        setStoredLog(readableLog.toFixed(4, BigNumber.ROUND_DOWN))
      })

  }, [provider])


  async function updateLog() {
    if (!provider) {
      return
    }
    const calculator = new ethers.Contract('0x369b45A61F8B569300e6137F61cB42Dfb21Ab6Ba', calculatorAbi, provider.getSigner())

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

  return (
    <div className="App">
      <h1>Merkle Math</h1>
      <p>A gas efficient library to find logarithm and power on chain, inspired by</p>
      <p>elementary school log tables. Lookup off-chain, prove on-chain.</p>
      <br />

      <div>
        <input type="radio" value="MALE" checked={isLog} name="gender" onClick={() => setIsLog(true)} /> Logarithm&nbsp;&nbsp;&nbsp;
        <input type="radio" value="FEMALE" checked={!isLog} name="gender" onClick={() => setIsLog(false)} /> Power / Antilog
      </div>

      {
        isLog
          ? <div className="card">
              <h2>x = {(Math.pow(10, storedCharacteristic) * storedMantissa / 100).toFixed(6)}, log (x) = {storedLog}</h2>
              <br />
              <div>
                <input type="number"
                  style={{ marginRight: 10 }}
                  value={newX}
                  onChange={event => setNewX(Number(event.target.value))}
                />
                {
                  account != null
                    ? <button onClick={updateLog}>
                      Calculate log
                    </button>
                    : <button onClick={() => { activate(injectedConnector) } }>Connect MetaMask</button>
                }
              </div>
            </div>
          : <div className="card">
              <h2>{base} ^ {power} = {raised}</h2>
              <br />
              <div>
                base:&nbsp;
                <input type="number"
                  style={{ marginRight: 10 }}
                  value={base}
                  onChange={event => setBase(Number(event.target.value))}
                />
                power:&nbsp;
                <input type="number"
                  style={{ marginRight: 10 }}
                  value={power}
                  onChange={event => setPower(Number(event.target.value))}
                />
              </div>
            </div>
      }


      <div>
        <p>
          Powered by ☕ at EthIndia 2022
        </p>
        <p>
          Supported networks- Mumbai, Cronos testnet, Shardeum testnet
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