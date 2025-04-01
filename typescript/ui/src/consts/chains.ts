import { arbitrum, arbitrumsepolia } from '@hyperlane-xyz/registry';
import { ChainMap, ChainMetadata } from '@hyperlane-xyz/sdk';
import { ProtocolType } from '@hyperlane-xyz/utils';

// A map of chain names to ChainMetadata
// Chains can be defined here, in chains.json, or in chains.yaml
// Chains already in the SDK need not be included here unless you want to override some fields
// Schema here: https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/typescript/sdk/src/metadata/chainMetadataTypes.ts
export const chains: ChainMap<ChainMetadata & { mailbox?: Address }> = {
  // solanamainnet: {
  //   ...solanamainnet,
  //   // SVM chains require mailbox addresses for the token adapters
  //   mailbox: solanamainnetAddresses.mailbox,
  //   // Including a convenient rpc override because the Solana public RPC does not allow browser requests from localhost
  //   rpcUrls: process.env.NEXT_PUBLIC_SOLANA_RPC_URL
  //     ? [{ http: process.env.NEXT_PUBLIC_SOLANA_RPC_URL }, ...solanamainnet.rpcUrls]
  //     : solanamainnet.rpcUrls,
  // },
  // eclipsemainnet: {
  //   ...eclipsemainnet,
  //   mailbox: eclipsemainnetAddresses.mailbox,
  // },
  arbitrumsepolia: {
    ...arbitrumsepolia,
    rpcUrls: [{ http: 'https://arbitrum-sepolia.infura.io/v3/273b4bf05f3a455e8ea02581cde8a0d5' }],
  },
  caranellspresso: {
    protocol: ProtocolType.Ethereum,
    chainId: 30101999,
    domainId: 30101999,
    name: 'caranellspresso',
    displayName: 'caranellspresso',
    nativeToken: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: [{ http: 'http://82.202.141.77:8500' }],
    blocks: {
      confirmations: 1,
      reorgPeriod: 1,
      estimateBlockTime: 10,
    },
    logoURI: '/typescript/ui/src/images/logos/app-logo.svg',
  },
};
