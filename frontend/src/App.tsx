import { useState } from 'react'
import { useWallet } from 'use-wallet'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const wallet = useWallet()
  const [x, setX] = useState<number>(100)

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/napier-with-tree.png" className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Napier's Tree</h1>
      <h2>x = 10, log (x) = 1</h2>
      <div className="card">
        <div>
          <input type="number"
            style={{ marginRight: 10 }}
            value={x}
            onChange={event => setX(Number(event.target.value))}
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
