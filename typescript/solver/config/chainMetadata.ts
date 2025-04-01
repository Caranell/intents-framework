import { z } from "zod";

import { chainMetadata as defaultChainMetadata } from "@hyperlane-xyz/registry";

import type { ChainMap, ChainMetadata } from "@hyperlane-xyz/sdk";
import { ChainMetadataSchema } from "@hyperlane-xyz/sdk";

import { objMerge } from "@hyperlane-xyz/utils";

const customChainMetadata = {
  // Example custom configuration
  caranellspresso: {
    chainId: 30101999,
    domainId: 30101999,
    name: "caranellspresso",
    protocol: 'ethereum',
    nativeToken: { decimals: 18, name: 'Ether', symbol: 'ETH' },
    displayName: 'CaranellSpresso',
    rpcUrls: [
      {
        http: "http://82.202.141.77:8547",
        // pagination: {
        //   maxBlockRange: 3000,
        // },
      },
    ],
  },
};

const chainMetadata = objMerge<ChainMap<ChainMetadata>>(
  defaultChainMetadata,
  customChainMetadata,
  10,
  true,
);

console.log('chainMetadata', chainMetadata)

z.record(z.string(), ChainMetadataSchema).parse(chainMetadata);

export { chainMetadata };
