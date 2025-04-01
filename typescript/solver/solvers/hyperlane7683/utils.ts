import type { MultiProvider } from "@hyperlane-xyz/sdk";

import { bytes32ToAddress } from "@hyperlane-xyz/utils";
import { createLogger } from "../../logger.js";
import { Hyperlane7683__factory } from "../../typechain/factories/hyperlane7683/contracts/Hyperlane7683__factory.js";
import { metadata } from "./config/index.js";
import type { ResolvedCrossChainOrder } from "./types.js";

export const log = createLogger(metadata.protocolName);

export async function settleOrder(
  fillInstructions: ResolvedCrossChainOrder["fillInstructions"],
  originChainId: ResolvedCrossChainOrder["originChainId"],
  orderId: string,
  multiProvider: MultiProvider,
  solverName: string,
) {
  log.info({
    msg: "Settling Intent",
    intent: `${solverName}-${orderId}`,
  });
  
  const destinationSettlers = fillInstructions.reduce<
    Record<string, Array<string>>
  >((acc, fillInstruction) => {
    const destinationChain = fillInstruction.destinationChainId.toString();
    const destinationSettler = bytes32ToAddress(
      fillInstruction.destinationSettler,
    );

    acc[destinationChain] ||= [];
    acc[destinationChain].push(destinationSettler);

    return acc;
  }, {});

  await Promise.all(
    Object.entries(destinationSettlers).map(
      async ([destinationChain, settlers]) => {
        const uniqueSettlers = [...new Set(settlers)];
        const filler = multiProvider.getSigner(destinationChain);

        return Promise.all(
          uniqueSettlers.map(async (destinationSettler) => {
            const destination = Hyperlane7683__factory.connect(
              destinationSettler,
              filler,
            );
            const dest = Hyperlane7683__factory.connect(
              '0xb3135158F5cC4d6D1a080F4aEf3e5f617f461533',
              filler,
            );
            try {

              // const [value1, value] = await Promise.all([
              //   dest.quoteGasPayment(originChainId).catch(e=> {
              //     console.log('error', e)
              //   }),
              //   destination.quoteGasPayment(originChainId).catch(e=> {
              //     console.log(e)
              //   }),
              // ])

              const value = await dest.quoteGasPayment(originChainId)

              // console.log('value1', value1)
              console.log('value', value)
              const _tx = await destination.populateTransaction.settle(
                [orderId],
                { value },
              );

              const gasLimit = await multiProvider.estimateGas(
                destinationChain,
                _tx,
                await filler.getAddress(),
              );

              const tx = await destination.settle([orderId], {
                value,
                gasLimit: gasLimit.mul(110).div(100),
              });

              const receipt = await tx.wait();

              log.info({
                msg: "Settled Intent",
                intent: `${solverName}-${orderId}`,
                txDetails: `https://explorer.hyperlane.xyz/?search=${receipt.transactionHash}`,
                txHash: receipt.transactionHash,
              });
            } catch (error) {
              log.error({
                msg: `Failed settling`,
                intent: `${solverName}-${orderId}`,
                error,
              });
              return;
            }
          }),
        );
      },
    ),
  );
}
