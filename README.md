# sb-simulate-oracle-jobs

To execute:

```ts
bun install
bun run src/index.ts
```


to test the gateway fetch_signatures and consensus routes. 
run this command
```ts
bun run src/test_local_gateway.ts --mode consensus_devnet --duration 10
```
you can select the different modes (baseline is the fetch_signatures endpoint. )
- consensus_devnet
- consensus_main
- consensus_local
- baseline_local
- baseline_main
- baseline_devnet
