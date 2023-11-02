import { CashuMint, CashuWallet } from "@cashu/cashu-ts";
import { env } from "../env";

export const mint = new CashuMint(env.MINT_URL);
export const wallet = new CashuWallet(mint);
