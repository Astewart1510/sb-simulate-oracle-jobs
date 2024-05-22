import { OracleJob } from "@switchboard-xyz/common";
import chalk from "chalk";

const jobs: OracleJob[] = [
  new OracleJob({
    tasks: [
      {
        cacheTask: {
          cacheItems: [
            {
              variableName: "COINBASE_SOL_USDC",
              job: {
                tasks: [
                  {
                    httpTask: {
                      url: "https://api.coinbase.com/v2/prices/sol-usdc/spot",
                    },
                  },
                  {
                    jsonParseTask: {
                      path: "$.data.amount",
                    },
                  },
                ],
              },
            },
            {
              variableName: "JUPITER_SOL_USDC",
              job: {
                tasks: [
                  {
                    jupiterSwapTask: {
                      inTokenAddress:
                        "So11111111111111111111111111111111111111112",
                      outTokenAddress:
                        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                      baseAmount: 100,
                    },
                  },
                  {
                    divideTask: {
                      scalar: 100,
                    },
                  },
                ],
              },
            },
            {
              variableName: "PYTHNET_SOL_USD",
              job: {
                tasks: [
                  {
                    oracleTask: {
                      pythAddress:
                        "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        medianTask: {
          jobs: [
            { tasks: [{ valueTask: { big: "${COINBASE_SOL_USDC}" } }] },
            { tasks: [{ valueTask: { big: "${JUPITER_SOL_USDC}" } }] },
            { tasks: [{ valueTask: { big: "${PYTHNET_SOL_USD}" } }] },
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

  // Serialize the jobs to base64 strings.
  const serializedJobs = jobs.map((oracleJob) => {
    const encoded = OracleJob.encodeDelimited(oracleJob).finish();
    const base64 = Buffer.from(encoded).toString("base64");
    return base64;
  });

  // Call the simulation server.
  const response = await fetch("https://api.switchboard.xyz/api/simulate", {
    method: "POST",
    headers: [["Content-Type", "application/json"]],
    body: JSON.stringify({ cluster: "Mainnet", jobs: serializedJobs }),
  });

  // Check response.
  if (response.ok) {
    const data = await response.json();
    console.log(chalk.greenBright(`Response is good (${response.status})`));
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(chalk.redBright(`Response is bad (${response.status})`));
    console.log(await response.text());
  }
})();
