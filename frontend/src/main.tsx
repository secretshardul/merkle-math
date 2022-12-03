import React from 'react'
import ReactDOM from 'react-dom/client'
import { UseWalletProvider } from 'use-wallet'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UseWalletProvider autoConnect
      connectors={{
        injected: {
          //allows you to connect and switch between mainnet and rinkeby within Metamask.
          chainId: [1337, 80001],
        }}
      }
    >
      <App />
    </UseWalletProvider>
  </React.StrictMode>
)
