// utils/metaplex.js
import { Metaplex, keypairIdentity, bundlrStorage , walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';


const connection = new Connection(clusterApiUrl("devnet"));

const wallet = new PhantomWalletAdapter();

const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet));

export default metaplex;
