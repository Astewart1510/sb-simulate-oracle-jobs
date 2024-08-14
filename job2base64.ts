import { OracleJob } from "@switchboard-xyz/common";
import chalk from "chalk";

// Serialize the jobs to base64 strings.
const base64EncodeJob = (oracleJob: OracleJob) => {
  const encoded = OracleJob.encodeDelimited(oracleJob).finish();
  const base64 = Buffer.from(encoded).toString("base64");
  return base64;
};

const print = (oracleJob: OracleJob) => {
  console.log();
  console.log(chalk.bold.yellowBright("Job:"));
  console.log(JSON.stringify(oracleJob.toJSON(), null, 2));
  console.log(chalk.bold.yellowBright("Encoded:"));
  console.log(base64EncodeJob(oracleJob));
};

(() => {
  const oracleJob = new OracleJob({
    tasks: [{ unixTimeTask: {} }],
  });
  print(oracleJob);
})();

(() => {
  const oracleJob = new OracleJob({
    tasks: [{ httpTask: { url: "https://google.com" } }],
  });
  print(oracleJob);
})();
