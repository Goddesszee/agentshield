// GenLayer Testnet + contract configuration.
// AgentShield's agreement/escrow/evaluation logic lives entirely in a
// GenLayer Intelligent Contract (see /contract/agentshield.py) — there is
// no separate EVM escrow chain. Populate with the real deployed contract
// address before switching out of mock mode.
// Scaffolded in Milestone 1, corrected from an earlier Arc Testnet
// assumption, wired up in Milestone 5 (Escrow architecture).

export const GENLAYER_TESTNET_CHAIN_ID = 4221; // GenLayer Testnet (Asimov)

// MetaMask's "add network" flow calls net_version, which the GenLayer RPC
// endpoint does not implement. Use the Chain RPC endpoint for wallet
// connections; the GenLayer RPC endpoint is for SDK/CLI use instead.
export const GENLAYER_WALLET_RPC_URL = "https://rpc.testnet-chain.genlayer.com";
export const GENLAYER_SDK_RPC_URL = "https://rpc-bradbury.genlayer.com";

export const AGENTSHIELD_CONTRACT_ADDRESS = undefined; // TODO: set once contract/agentshield.py is deployed to testnet
export const GENLAYER_EXPLORER_URL = undefined; // TODO: confirm official GenLayer Testnet explorer URL

export const IS_MOCK_MODE = true;
