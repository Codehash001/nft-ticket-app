import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Metaplex } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";

import { walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet } from '@solana/wallet-adapter-react';
import WalletConnectButton from "@/components/connect-wallet-button";

import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { FaCalendarCheck , FaCircleDot } from "react-icons/fa6";
import { RiPriceTag3Fill } from "react-icons/ri";
import Ticket from "@/components/ticket";


const connection = new Connection(clusterApiUrl("devnet"));
const mx = Metaplex.make(connection);
const ownerWallet = process.env.NEXT_PUBLIC_OWNER_WALLET
const ownerPublicKey = new PublicKey(`${ownerWallet}`);

export default function Home() {

    const wallet = useWallet();
    const mpx = mx.use(walletAdapterIdentity(wallet));

    const sendTransaction = async () => {
        try {
            if (!wallet || !wallet.publicKey) {
                throw new Error("Wallet not connected");
            }

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: ownerPublicKey,
                    lamports: 0.01 * LAMPORTS_PER_SOL, // 0.01 SOL
                })
            );

            const signature = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "processed");

            return true; // Transaction successful
        } catch (error) {
            console.error("Transaction failed", error);
            return false; // Transaction failed
        }
    };

    const mintNFT = async () => {
        const transactionSuccess = await sendTransaction();
        if (transactionSuccess) {
            try {
                const data = await mpx.nfts().create({
                    name: "MY Ticket",
                    symbol: "MNFT",
                    uri: "https://collection URI",
                });

                console.log(data);
            } catch (error) {
                console.error("Minting failed", error);
            }
        } else {
            console.log("Transaction was not successful. Minting dismissed.");
        }
    };

    return (
        <div className="w-full h-full">
            <Head>
                <title>Buy tickets</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex items-center justify-center w-full h-full overflow-hidden">
                <Ticket/>
            </div>
        </div>
    );
}
