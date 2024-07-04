import React, { useState } from 'react';
import WalletConnectButton from "@/components/connect-wallet-button";
import { FaTelegram, FaBars, FaTimes } from "react-icons/fa";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from "next/link";

export default function NavHeader() {
    const { publicKey } = useWallet();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="w-full bg-primary/60 py-2 px-3 shadow-md z-50 sticky top-0">
            <div className="flex items-center justify-between">
                <div className="text-xl font-bold"><span>Logo</span></div>
                
                {/* Mobile menu button */}
                <button className="md:hidden" onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
                </button>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link href={'/'} className="hover:scale-105"><span>Buy tickets</span></Link>                   
                    <Link href={'/faqs'} className="hover:scale-105"><span>FAQs</span></Link>
                    <Link href={`${process.env.NEXT_PUBLIC_TELEGRAM_LINK}`} target="_blank" rel="noopener noreferrer" className="hover:scale-105">
                        <FaTelegram size={25}/>
                    </Link>
                    <WalletMultiButton />
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden mt-4 space-y-4">
                    <Link href={'/'} className="block hover:scale-105"><span>Buy tickets</span></Link>                   
                    <Link href={'/faqs'} className="block hover:scale-105"><span>FAQs</span></Link>
                    <Link href={`${process.env.NEXT_PUBLIC_TELEGRAM_LINK}`} target="_blank" rel="noopener noreferrer" className="block hover:scale-105">
                        <FaTelegram size={25}/>
                    </Link>
                    <div className="mt-4">
                        <WalletMultiButton />
                    </div>
                </div>
            )}
        </div>
    );
}