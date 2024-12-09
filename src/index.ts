import { FeedHash, OracleJob, CrossbarClient } from "@switchboard-xyz/common";
import chalk from "chalk";
import { jobs } from "./jobs";

(async () => {
  console.log(chalk.bold.yellowBright("Running simulation...\n"));

  // Print the jobs that are being run.
  const jobJson = JSON.stringify({ jobs: jobs.map((job) => job.toJSON()) });
  console.log("Job Json:\n", jobJson);
  console.log();

  // Serialize the jobs to base64 strings.
  const serializedJobs = jobs.map((oracleJob) => {
    const encoded = OracleJob.encodeDelimited(oracleJob).finish();
    const base64 = Buffer.from(encoded).toString("base64");
    return base64;
  });

  const queueBytes = Buffer.from(
    // "86807068432f186a147cf0b13a30067d386204ea9d6c8b04743ac2ef010b0752",
    "d9cd6a04191d6cd559a5276e69a79cc6f95555deeae498c3a2f8b3ee670287d1",
    "hex"
  );
  const feedHash = FeedHash.compute(queueBytes, jobs);
  console.log("Feed Hash:\n", feedHash.toString("hex"));
  console.log();

  jobs.forEach((j) => {
    console.log(
      Buffer.from(OracleJob.encodeDelimited(j).finish()).toString("base64")
    );
  });
  console.log();

  const simulatePath = "http://staging.simulator.switchboard.xyz/simulate";
  // Call the simulation server.
  console.log("Simulating on", simulatePath, "\n");
  const response = await fetch(simulatePath, {
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
