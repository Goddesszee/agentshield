import { createClient } from "genlayer-js";
import { testnetBradbury, studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";

// AgentShield talks to the deployed Intelligent Contract on GenLayer.
// Default network is Bradbury (production-like testnet with real LLM
// validators). Set VITE_GL_NETWORK=studionet for the free hosted dev net.
const NETWORK = import.meta.env.VITE_GL_NETWORK === "studionet" ? studionet : testnetBradbury;

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

let client = null;

export function getChainLabel() {
  return NETWORK === studionet ? "Studionet" : "Bradbury Testnet";
}

// Connects to the browser wallet (MetaMask or any EIP-1193 provider) and
// returns the connected address. The user must have GenLayer Bradbury
// added to their wallet (see docs.genlayer.com/developers/networks).
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("No wallet found. Install MetaMask to use AgentShield.");
  }
  const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
  client = createClient({
    chain: NETWORK,
    account: address,
    provider: window.ethereum,
  });
  await client.connect(NETWORK.name ?? "genlayer");
  return address;
}

function requireClient() {
  if (!client) throw new Error("Wallet not connected");
  return client;
}

export async function readContract(functionName, args = []) {
  const c = requireClient();
  return c.readContract({
    address: CONTRACT_ADDRESS,
    functionName,
    args,
  });
}

// Sends a write transaction and waits for it to be ACCEPTED by consensus.
// AgentShield surfaces "pending validator review" state to the user while
// this resolves — for evaluation calls this is where the 5 AI validators
// actually run.
export async function writeContract(functionName, args = [], valueWei = 0n) {
  const c = requireClient();
  const hash = await c.writeContract({
    address: CONTRACT_ADDRESS,
    functionName,
    args,
    value: valueWei,
  });

  const receipt = await c.waitForTransactionReceipt({
    hash,
    status: TransactionStatus.ACCEPTED,
    retries: 60,
    interval: 5000,
  });

  if (receipt?.status && receipt.status !== "ACCEPTED" && receipt.statusName !== "ACCEPTED") {
    throw new Error(`Transaction did not reach ACCEPTED status: ${receipt.statusName ?? receipt.status}`);
  }

  return { hash, receipt };
}

export function genToWei(gen) {
  return BigInt(Math.round(Number(gen) * 1e9)) * 1_000_000_000n; // GEN has 18 decimals
}

export function weiToGen(wei) {
  try {
    return Number(BigInt(wei)) / 1e18;
  } catch {
    return 0;
  }
}
