import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, sepolia } from '@reown/appkit/networks'

// 1. Get projectId from Reown Cloud
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID')
}

// 2. Create metadata object
const metadata = {
  name: 'SaskFood Connect',
  description: 'Food delivery platform connecting restaurants, drivers, and customers in Saskatchewan',
  url: process.env.NEXTAUTH_URL || 'http://localhost:6771',
  icons: ['https://saskfoodconnect.com/icon.png'] // TODO: Update with your icon
}

// 3. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, arbitrum, sepolia],
  projectId,
  ssr: true
})

// 4. Create AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, arbitrum, sepolia],
  projectId,
  metadata,
  features: {
    analytics: true
  }
}) 