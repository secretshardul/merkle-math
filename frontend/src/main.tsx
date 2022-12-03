import React from 'react'
import ReactDOM from 'react-dom/client'
import { UseWalletProvider } from 'use-wallet'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UseWalletProvider>
      <App />
    </UseWalletProvider>
  </React.StrictMode>
)
