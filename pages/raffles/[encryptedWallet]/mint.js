// pages/raffles/[encryptedWallet]/mint.js


import Head from 'next/head';
import Ticket from '@/components/ticket';
import { useRouter } from 'next/router';
import CryptoJS from 'crypto-js';

export default function MintPage() {
  const router = useRouter();
  const { encryptedWallet } = router.query;

  const decryptWallet = (encryptedWallet) => {
    const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-secret-key";
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedWallet), secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const walletAddress = encryptedWallet ? decryptWallet(encryptedWallet) : null;

  // Use walletAddress in your component...

  return (
    <div className="w-full h-full">
            <Head>
                <title>Buy tickets with raffle link</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex items-center justify-center w-full h-full overflow-hidden">
                {/* <div className={styles.container}>
                    <h1 className={styles.title}>NFT Mint Address</h1>
                    <div className={styles.nftForm}>
                        <button onClick={mintNFT}>Mint</button>
                    </div>
                    {nft && (
                        <div className={styles.nftPreview}>
                            <h1>{nft.name}</h1>
                            <img
                                src={nft.json.image}
                                alt="The downloaded illustration of the provided NFT address."
                            />
                        </div>
                    )}
                </div> */}
                <Ticket raffleWallet={walletAddress}/>
            </div>
        </div>
  );
}