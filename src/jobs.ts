import { OracleJob } from "@switchboard-xyz/common";

export const jobs: OracleJob[] = [
  OracleJob.create({
    tasks: [
      {
        oracleTask: {
          pythAddress:
            "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
          pythConfigs: {
            pythAllowedConfidenceInterval: 1,
          },
        },
      },
    ],
  }),
  OracleJob.create({
    tasks: [
      {
        httpTask: {
          url: "https://www.okx.com/api/v5/market/index-tickers?quoteCcy=USD",
        },
      },
      {
        jsonParseTask: {
          path: '$.data[?(@.instId == "BTC-USD")].idxPx',
        },
      },
    ],
  }),
  OracleJob.create({
    tasks: [
      {
        valueTask: {
          value: 1,
        },
      },
      {
        divideTask: {
          job: {
            tasks: [
              {
                httpTask: {
                  url: "https://api.coinbase.com/v2/exchange-rates?currency=USD",
                  headers: [
                    {
                      key: "Accept",
                      value: "application/json",
                    },
                    {
                      key: "User-Agent",
                      value: "Mozilla/5.0",
                    },
                  ],
                },
              },
              {
                jsonParseTask: {
                  path: "$.data.rates.BTC",
                },
              },
            ],
          },
        },
      },
    ],
  }),
  OracleJob.create({
    tasks: [
      {
        oracleTask: {
          chainlinkAddress: "0x942d00008D658dbB40745BBEc89A93c253f9B882",
          chainlinkConfigs: {},
        },
      },
    ],
  }),
  OracleJob.create({
    tasks: [
      {
        oracleTask: {
          edgeId: "BTC/USD",
          edgeConfigs: {},
        },
      },
    ],
  }),
];
