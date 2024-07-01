import WalletConnectButton from "@/components/connect-wallet-button";
import { FaTelegram } from "react-icons/fa";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from "next/link";

export default function NavHeader() {
    const { publicKey } = useWallet();
    return(
        <div className="w-full h-16 bg-primary/60 flex items-center py-2 px-3 justify-between space-x-10 shadow-md z-50 sticky top-0">
            <div className="w-full flex justify-between items-center h-full z-40">
                <div className="text-xl font-bold"><span>Logo</span></div>
                <div className="flex space-x-10">
                    <Link href={'/'} className="hover:scale-105"><span>Buy tickets</span></Link>                   
                    <Link href={'/faqs'} className="hover:scale-105"><span>FAQs</span></Link>
                    <Link href={`${process.env.NEXT_PUBLIC_TELEGRAM_LINK}`} target="blank" className="hover:scale-105"><FaTelegram size={25}/></Link>                   
                    {/* <FaTwitter size={25}/> */}
                </div>
            </div>
            <div className="w-[12%] flex items-center justify-end z-40">
            <WalletMultiButton />
            </div>
          </div>
    )
}