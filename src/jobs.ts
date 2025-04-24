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
        curveFinanceTask: {
          poolAddress: "0xb92B054b9CC33685e7F8c3f85177C4b6DC061391",
        },
      },
      {
        multiplyTask: {
          job: {
            tasks: [
              {
                oracleTask: {
                  pythAddress:
                    "0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f6",
                },
              },
            ],
          },
        },
      },
    ],
  }),
];

export const job2 = buildBinanceJob("BTCUSDT");

export function buildBinanceJob(pair: string): OracleJob {
  const jobConfig = {
    tasks: [
      {
        httpTask: {
          url: `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`,
        },
      },
      {
        jsonParseTask: {
          path: `$[?(@.symbol == '${pair}')].price`,
        },
      },
    ],
  };
  return OracleJob.fromObject(jobConfig);
}