import { OracleJob } from "@switchboard-xyz/common";

export const jobs: OracleJob[] = [
  // OracleJob.create({
  //   tasks: [
  //     { solayerSusdTask: {} },
  //     // {
  //     //   solanaAccountDataFetchTask: {
  //     //     pubkey: "2wMDWx7a1PpbrsnNAHGJLPMgRs7H3pcYxqmmkQrzLxHg",
  //     //   },
  //     // },
  //     // {
  //     //   bufferLayoutParseTask: {
  //     //     offset: 152,
  //     //     endian: OracleJob.BufferLayoutParseTask.Endian.LITTLE_ENDIAN,
  //     //     type: OracleJob.BufferLayoutParseTask.BufferParseType.u64,
  //     //   },
  //     // },
  //     // {
  //     //   divideTask: {
  //     //     big: "100000",
  //     //   },
  //     // },
  //     // {
  //     //   multiplyTask: {
  //     //     job: {
  //     //       tasks: [
  //     //         {
  //     //           oracleTask: {
  //     //             switchboardAddress:
  //     //               "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR",
  //     //           },
  //     //         },
  //     //       ],
  //     //     },
  //     //   },
  //     // },
  //   ],
  // }),
  OracleJob.create({
    tasks: [
      {
        curveFinanceTask: {
          chain: OracleJob.CurveFinanceTask.Chain.CHAIN_ETHEREUM,
          poolAddress: "0x98a7f18d4e56cfe84e3d081b40001b3d5bd3eb8b",
        },
      },
    ],
  }),
];
