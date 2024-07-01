import { useState } from "react";
import Head from "next/head";
import TokenTransactions from "@/components/admin/token-transactions";
import Raffledetails from "@/components/admin/raffle-table";
import Settings from "@/components/admin/settings";

import {
    Connection,
    PublicKey,
  } from "@solana/web3.js";

  import { walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex } from "@metaplex-foundation/js";
import { IoTicketSharp } from "react-icons/io5";
import { GrTransaction } from "react-icons/gr";
import { IoSettingsSharp } from "react-icons/io5";

const connection = new Connection("https://api.testnet.solana.com", "confirmed");
const mx = Metaplex.make(connection);
const ownerWallet = process.env.NEXT_PUBLIC_OWNER_WALLET;
const ownerPublicKey = new PublicKey(`${ownerWallet}`);

export default function Admin() {

    const wallet = useWallet();

    if(ownerWallet != wallet.publicKey) {
        return(
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4 z-50">
                <p>You have no admin privilage to access this page</p>
            </div>
        )
    }
    const [activeTab, setActiveTab] = useState("transactions");

    const tabs = [
        { id: "transactions", label: "Transactions" , icon: <GrTransaction/> },
        { id: "raffles", label: "Raffles" , icon: <IoTicketSharp/> },
        { id: "settings", label: "Settings" , icon: <IoSettingsSharp/>},
    ];

    return (
        <div className="w-full h-screen flex px-5 relative overflow-hidden mt-10">
            <Head>
                <title>Admin settings</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col items-center justify-start w-1/6 pr-5 border-r h-full z-30 space-y-3 py-5 sticky top-0">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`p-4 cursor-pointer w-full flex items-center space-x-2 transition-all duration-300 rounded-md ${
                            activeTab === tab.id
                                ? "bg-muted text-black"
                                : "hover:bg-gray-600"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-start justify-start w-5/6 h-screen overflow-x-hidden z-40">
                {activeTab === "transactions" && <div className="animate-fadeIn"><TokenTransactions/></div>}
                {activeTab === "raffles" && <div className="animate-fadeIn"><Raffledetails/></div>}
                {activeTab === "settings" && <div className="animate-fadeIn w-full"><Settings/></div>}
            </div>
        </div>
    );
}
