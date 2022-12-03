import { useEffect, useState } from 'react'
import {ethers} from 'ethers'
import { useWallet } from 'use-wallet'
import reactLogo from './assets/react.svg'
import './App.css'
import { abi } from './contracts/LogStorage.sol/LogStorage.json'

function App() {
  const wallet = useWallet()
  const provider = wallet.ethereum
    ? new ethers.providers.Web3Provider(wallet.ethereum)
    : null

  const [characteristic, setCharacteristic] = useState(0)
  const [mantissa, setMantissa] = useState(100)

  const [newX, setNewX] = useState<number>(1)
  const [log, setLog] = useState(0)

  useEffect(() => {
    if (!provider) {
      return
    }
    const logStorage = new ethers.Contract('0xbF3892B7A68e939bF1ca0DB5f91d5Cc73AaF779A', abi, provider);

    logStorage.storedCharacteristic()
      .then((value: number) => setCharacteristic(value))

    logStorage.storedMantissa()
      .then((value: number) => setMantissa(value))

  }, [provider])

  const x = Math.pow(10, characteristic) * mantissa / 100

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/napier-with-tree.png" className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Napier's Tree</h1>
      <h2>x = {x}, log (x) = {log}</h2>
      <div className="card">
        <div>
          <input type="number"
            style={{ marginRight: 10 }}
            value={newX}
            onChange={event => setNewX(Number(event.target.value))}
          />

          {
            wallet.isConnected()
              ? <button onClick={() => { }}>
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
