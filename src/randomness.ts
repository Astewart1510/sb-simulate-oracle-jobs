import {
    ON_DEMAND_DEVNET_QUEUE,
    ON_DEMAND_MAINNET_QUEUE, Randomness, getDefaultDevnetQueue, getProgramId
  } from "@switchboard-xyz/on-demand";
  import * as sb from "@switchboard-xyz/on-demand";
import * as anchor from "@coral-xyz/anchor";
import { OracleJob } from "@switchboard-xyz/common";
import { CrossbarClient, FeedHash } from "@switchboard-xyz/common";
import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
} from "@solana/web3.js";
import { solana } from "@switchboard-xyz/common/networks";
import type { Commitment } from "@solana/web3.js";

const txOpts = {
    commitment: "processed" as Commitment,
    skipPreflight: false,
    maxRetries: 0,
  };

export async function loadSbProgram(
    provider: anchor.Provider
  ): Promise<anchor.Program> {
    const sbProgramId = await getProgramId(provider.connection);
    const sbIdl = await anchor.Program.fetchIdl(sbProgramId, provider);
    const sbProgram = new anchor.Program(sbIdl!, provider);
    return sbProgram;
  }
//async main

async function main() {
    const queuePubkey = ON_DEMAND_DEVNET_QUEUE;
    const solanaRpcUrl = "https://api.devnet.solana.com";
    let queue = await getDefaultDevnetQueue(solanaRpcUrl);
    const connection = new Connection(solanaRpcUrl, {
        commitment: "confirmed",
      });
      const payerKeypair = await sb.AnchorUtils.initKeypairFromFile(
        "/Users/alexstewart/.config/solana/id.json"
      );
      const payer = new anchor.Wallet(payerKeypair);
    console.log("Payer public key", payer.publicKey.toString());

    const provider = new anchor.AnchorProvider(
        connection,
        payer,
        anchor.AnchorProvider.defaultOptions()
      );
    const sbProgram = await loadSbProgram(provider);
    console.log("Switchboard program id", sbProgram.programId.toString());
// create randomness acccount
    const rngKp = Keypair.generate();
    const [randomness, ix] = await Randomness.create(sbProgram, rngKp, queuePubkey);
    
    // const randomnesspubkey = new PublicKey(
    // //     "83YniBTzoT9knkrAhH7cNzWHyumsbjozfrctr2jQyb5z".toString()
    // //   );
    // const randomness = new Randomness(
    //     sbProgram,
    //     randomnesspubkey);
    console.log("\nCreated randomness account..");
    console.log("Randomness account", randomness.pubkey.toString());

    const createRandomnessTx = await sb.asV0Tx({
    connection: sbProgram.provider.connection,
    ixs: [ix],
    payer: payer.publicKey,
    signers: [payer.payer, rngKp],
    computeUnitPrice: 75_000,
    computeUnitLimitMultiple: 1.3,
    });

    const simulateResult = await connection.simulateTransaction(createRandomnessTx, txOpts);
    if (simulateResult.value.err) {
        console.log("Error simulating transaction", simulateResult.value.err);
        console.log(simulateResult);
    }

    const sig = await queue.program.provider.connection.sendTransaction(createRandomnessTx, {
        preflightCommitment: "processed",
        skipPreflight: true,
      });
      console.log("Transaction signature", sig);    
      console.log("Randomness account created");
    

        // Commit to randomness Ix
  console.log("\nCommit to randomness...");
  const commitIx = await randomness.commitIx(queuePubkey);

  const commitTx = await sb.asV0Tx({
    connection: sbProgram.provider.connection,
    ixs: [commitIx],
    payer: payer.publicKey,
    signers: [payer.payer],
    computeUnitPrice: 75_000,
    computeUnitLimitMultiple: 1.3,
  });
  // pause for 5 seconds
 await new Promise((resolve) => setTimeout(resolve, 5000));

  const sim4 = await connection.simulateTransaction(commitTx, txOpts);
  const sig4 = await connection.sendTransaction(commitTx, txOpts);
  const COMMITMENT = "confirmed";

  await connection.confirmTransaction(sig4, COMMITMENT);
  console.log("  Transaction Signature commitTx", sig4);

  const revealIx = await randomness.revealIx();
  const revealTx = await sb.asV0Tx({
    connection: sbProgram.provider.connection,
    ixs: [revealIx],
    payer: payer.publicKey,
    signers: [payer.payer],
    computeUnitPrice: 75_000,
    computeUnitLimitMultiple: 1.3,
  });

    const sim5 = await connection.simulateTransaction(revealTx, txOpts);
    const sig5 = await connection.sendTransaction(revealTx, txOpts);
    await connection.confirmTransaction(sig5, COMMITMENT);
    console.log("  Transaction Signature revealTx", sig5);


    }


    main();
