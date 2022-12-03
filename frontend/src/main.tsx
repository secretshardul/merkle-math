import React from 'react'
import ReactDOM from 'react-dom/client'
import { Web3ReactProvider } from '@web3-react/core'
import {ethers} from 'ethers'
import { Web3Provider } from '@ethersproject/providers'

// import { UseWalletProvider } from 'use-wallet'
// import { MetamaskStateProvider } from "use-metamask"
import App from './App'
import './index.css'

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <UseWalletProvider autoConnect
      connectors={{
        injected: {
          //allows you to connect and switch between mainnet and rinkeby within Metamask.
          chainId: [1337, 80001],
        }}
      }
    > */}
    {/* <MetamaskStateProvider> */}
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
    {/* </MetamaskStateProvider> */}
    {/* </UseWalletProvider> */}
  </React.StrictMode>
)
