import { OracleJob } from "@switchboard-xyz/common";

export const jobs: OracleJob[] = [
  new OracleJob({
    tasks: [
      {
        cacheTask: {
          cacheItems: [
            {
              variableName: "ST_CORE_HEX",
              job: {
                tasks: [
                  {
                    httpTask: {
                      url: "https://rpc.coredao.org/",
                      method: 2,
                      headers: [
                        { key: "content-type", value: "application/json" },
                      ],
                      body: '{"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"to":"0xf5fa1728babc3f8d2a617397fac2696c958c3409","data":"0x3ca967f3"},"latest"]}',
                    },
                  },
                  {
                    jsonParseTask: {
                      path: "$.result",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        valueTask: {
          hex: "0x0000000000000010c7ee",
        },
      },
    ],
  }),
];
