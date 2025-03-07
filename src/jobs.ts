import { OracleJob } from "@switchboard-xyz/common";

export const jobs: OracleJob[] = [
  // OracleJob.create({
  //   tasks: [
  //     {
  //       uniswapExchangeRateTask: {
  //         inTokenAddress: "0x760afe86e5de5fa0ee542fc7b7b713e1c5425701",
  //         outTokenAddress: "0xf817257fed379853cde0fa4f97ab987181b1e5ea",
  //         factoryAddress: "0x733e88f248b742db6c14c0b1713af5ad7fdd59d0",
  //         routerAddress: "0xfb8e1c3b833f9e67a71c859a132cf783b645e436",
  //         provider: "https://testnet-rpc.monad.xyz",
  //         slippage: 3,
  //         version: OracleJob.UniswapExchangeRateTask.Version.VERSION_V2,
  //       },
  //     },
  //   ],
  // }),
  OracleJob.create({
    tasks: [
      {
        lstHistoricalYieldTask: {
          lstMint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
          operation: OracleJob.LstHistoricalYieldTask.Operation.OPERATION_MEAN,
        },
      },
    ],
    weight: 69,
  }),
];
