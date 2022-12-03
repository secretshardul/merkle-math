import { useEffect, useState } from 'react'
import {ethers, BigNumber as EthersBigNumber} from 'ethers'
import BigNumber from "bignumber.js"
import { useWallet } from 'use-wallet'
import { StandardMerkleTree } from "@openzeppelin/merkle-tree"
import './App.css'
import { abi } from './contracts/LogStorage.sol/LogStorage.json'
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
    const logStorage = new ethers.Contract('0xbF3892B7A68e939bF1ca0DB5f91d5Cc73AaF779A', abi, provider);

    logStorage.storedCharacteristic()
      .then((value: number) => setStoredCharacteristic(value))

    logStorage.storedMantissa()
      .then((value: number) => setStoredMantissa(value))

      logStorage.storedLogX64()
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
    const logStorage = new ethers.Contract('0xbF3892B7A68e939bF1ca0DB5f91d5Cc73AaF779A', abi, provider.getSigner())

    // Generate characteristic and mantissa
    const char = Math.floor(Math.log10(newX))

    let mantissa = newX
    if (newX < 10) {
      mantissa = newX * 100
    } else if (newX < 100) {
      mantissa = newX * 10
    } else if (newX > 999) {
      mantissa = Math.floor(newX / Math.pow(10, char - 2))
    }

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
    const result = await logStorage.updateLog(char, mantissa, logX64, proof, {
      gasLimit: 1_000_000
    })
    console.log('result', result)
  }

  const x = Math.pow(10, storedCharacteristic) * storedMantissa / 100

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/napier-with-tree.png" className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Napier's Tree</h1>
      <h2>x = {x}, log (x) = {storedLog}</h2>
      <div className="card">
        <div>
          <input type="number"
            style={{ marginRight: 10 }}
            value={newX}
            onChange={event => setNewX(Math.floor(Number(event.target.value)))}
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
      <p>
        Powered by ☕ at EthIndia 2022
      </p>
    </div>
  )
}

export default App
