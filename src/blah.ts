import { version as commonVersion } from "@switchboard-xyz/common/package.json";
import { OracleJob } from "@switchboard-xyz/common/protos";
import { normalizeOracleJob } from "@switchboard-xyz/common/utils/oracle-job";

const job = normalizeOracleJob({
  tasks: [
    {
      lstHistoricalYieldTask: {
        lstMint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
        operation: OracleJob.LstHistoricalYieldTask.Operation.OPERATION_MEAN,
      },
    },
  ],
  weight: 100,
});
console.log("common:", commonVersion);
console.log("job", job.toJSON());
