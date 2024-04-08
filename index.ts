import { OracleJob } from "@switchboard-xyz/common";
import chalk from "chalk";

const jobs: OracleJob[] = [
  new OracleJob({
    tasks: [
      {
        conditionalTask: {
          attempt: [
            {
              jupiterSwapTask: {
                inTokenAddress: "WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk",
                outTokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                baseAmount: 100_000,
                slippage: 1, // NOTE: This is confusing, but it is already represented as a percent (1 === 1%)
              },
            },
            {
              divideTask: {
                scalar: 100_000,
              },
            },
          ],
          onFailure: [
            {
              lpExchangeRateTask: {
                orcaPoolAddress: "CpbNcvqxXdQyQ3SRPDPSwLfzd9sgzBm8TjRFsfJL7Pf4",
              },
            },
          ],
        },
      },
    ],
  }),
];

(async () => {
  console.log(chalk.bold.yellowBright("Running simulation...\n"));

  // Print the jobs that are being run.
  const jobJson = JSON.stringify({ jobs: jobs.map((job) => job.toJSON()) });
  console.log(jobJson);
  console.log();

  // Call the simulation server.
  const response = await fetch("https://api.switchboard.xyz/api/test", {
    method: "POST",
    headers: [["Content-Type", "application/json"]],
    body: jobJson,
  });

  // Check response.
  if (response.ok) {
    const data = await response.json();
    console.log(chalk.greenBright(`Response is good (${response.status})`));
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(chalk.redBright(`Response is bad (${response.status})`));
  }
})();
