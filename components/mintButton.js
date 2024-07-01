import { Metaplex } from "@metaplex-foundation/js";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState, useEffect } from "react";
import { walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/utils/supabase-client";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import getActivePhaseId from "@/utils/getActivephase";

const connection = new Connection("https://api.testnet.solana.com", "confirmed");
const mx = Metaplex.make(connection);
const ownerWallet = process.env.NEXT_PUBLIC_OWNER_WALLET;
const ownerPublicKey = new PublicKey(`${ownerWallet}`);

const NFT_NAME = process.env.NEXT_PUBLIC_NFT_NAME || "MY NFT";
const NFT_SYMBOL = process.env.NEXT_PUBLIC_NFT_SYMBOL || "MNFT";
const MINT_COST = parseFloat(process.env.NEXT_PUBLIC_MINT_COST || "0.01");

import React from 'react';

export function ShareModal({ isOpen, onClose, shareLink }) {
  if (!isOpen) return null;

  const handleCopyAndClose = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      toast.success('Link copied to clipboard!');
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg min-w-[300px]">
        <h2 className="text-xl font-bold mb-4">Share to get a chance for free mint!</h2>
        <p className="mb-4">Use this link to share and earn raffle points</p>
        <input
          type="text"
          value={shareLink}
          readOnly
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={handleCopyAndClose}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Copy and Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MintButton({ raffleWallet }) {
  const wallet = useWallet();
  const mpx = mx.use(walletAdapterIdentity(wallet));

  const [isMinting, setIsMinting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [nextTokenId, setNextTokenId] = useState(1);
  const [nftUri, setNftUri] = useState("");
  const [activePhaseID, setActivePhaseID] = useState(null);
  const [raffleAmount , setRaffleAmout] = useState(0);

  useEffect(() => {
    const fetchActivePhase = async () => {
      try {
        const phaseId = await getActivePhaseId();
        setActivePhaseID(phaseId);
        console.log("Active Phase ID:", phaseId);
      } catch (error) {
        console.error("Error fetching active phase ID:", error);
        toast.error("Failed to fetch active phase");
      }
    };

    fetchActivePhase();
  }, []);

  useEffect(() => {
    if (activePhaseID !== null) {
      fetchLastTokenId();
      fetchNftUri();

      if (wallet.publicKey) {
        checkRaffleAmount(wallet.publicKey.toString());
      }
    }
  }, [activePhaseID , wallet]);

  const fetchLastTokenId = async () => {
    const { data, error } = await supabase
      .from('token_transactions')
      .select('token_id')
      .order('token_id', { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching last token ID", error);
    } else if (data && data.length > 0) {
      setNextTokenId(data[0].token_id + 1);
    }
  };

  const fetchNftUri = async () => {
    if (activePhaseID) {
      const { data, error } = await supabase
        .from('settings')
        .select('image_path')
        .eq('phase_id', activePhaseID)
        .single()

      console.log('image data', data)

      if (error) {
        console.error("Error fetching NFT URI", error);
      } else if (data) {
        setNftUri(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/image/${data.image_path}`);
        console.log(nftUri)
      }
    }
  };

  const encryptWallet = (wallet) => {
    const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-secret-key";
    return CryptoJS.AES.encrypt(wallet, secretKey).toString();
  };

  const generateShareLink = (wallet) => {
    const encryptedWallet = encryptWallet(wallet);
    return `${window.location.origin}/raffles/${encodeURIComponent(encryptedWallet)}/mint`;
  };


  const sendTransaction = async () => {
    try {
      if (activePhaseID == null) {
        toast.error("Mint is not active yet")
        throw new Error("No active phase found");
      }

      if (!wallet || !wallet.publicKey) {
        toast.error("Please connect your wallet first")
        throw new Error("Wallet not connected");
      }

      if (wallet.publicKey.toString() == raffleWallet) {
        toast.error("Cannot use raffle link for the same wallet");
        throw new Error("Cannot use raffle link for the same wallet");
      }

      toast.info("Minting started")
      setIsMinting(true);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: ownerPublicKey,
          lamports: MINT_COST * LAMPORTS_PER_SOL,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");

      return true;
    } catch (error) {
      console.error("Transaction failed", error);
      return false;
    }
  };

  const updateRaffleDatabase = async (raffleWallet) => {
    if (!raffleWallet) return;

    const { data, error } = await supabase
      .from('raffles')
      .select('raffle_amount')
      .eq('wallet_address', raffleWallet)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 indicates no row found
      console.error("Error checking raffle wallet", error);
      return;
    }

    if (data) {
      // Wallet exists, update raffle_amount
      const { error } = await supabase
        .from('raffles')
        .update({ raffle_amount: data.raffle_amount + 1 })
        .eq('wallet_address', raffleWallet);

      if (error) {
        console.error("Error updating raffle amount", error);
      }
    } else {
      // Wallet does not exist, insert new row
      const { error } = await supabase
        .from('raffles')
        .insert([{ wallet_address: raffleWallet, raffle_amount: 1 }]);

      if (error) {
        console.error("Error inserting new raffle wallet", error);
      }
    }
  };

  const updateDatabase = async (tokenOwner, transactionTime, isUsingRaffel, raffelWallet, tokenId, success, cost, phase_id) => {
    const { data, error } = await supabase
      .from('token_transactions')
      .insert([
        { token_owner: tokenOwner, transaction_time: transactionTime, is_using_raffle: isUsingRaffel, raffle_wallet: raffelWallet, token_id: tokenId, success: success, cost: cost, phase_id: phase_id }
      ]);

    if (error) {
      console.error("Error updating database", error);
    } else {
      console.log("Database updated successfully", data);
    }

    // Update raffles table if raffleWallet is provided
    await updateRaffleDatabase(raffelWallet);
  };

  const checkRaffleAmount = async (walletAddress) => {
    const { data, error } = await supabase
      .from('raffles')
      .select('raffle_amount')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) {
      console.error("Error fetching raffle amount", error);
      return 0;
    }

    setRaffleAmout(data.raffle_amount);
  };

  const mintNFT = async () => {
    console.log("minting started")
    await fetchNftUri();
    if (!nftUri) {
      toast.error("NFT image not available for the current phase");
      return;
    }


    if (raffleAmount >= 5) {
      const transactionSuccess = true; // Free mint, so transaction is considered successful
      if (transactionSuccess) {
        try {
          const data = await mpx.nfts().create({
            name: `${NFT_NAME} #${nextTokenId}`,
            symbol: NFT_SYMBOL,
            uri: nftUri,
          });

          console.log(data);

          await updateDatabase(
            wallet.publicKey.toString(),
            new Date().toISOString(),
            Boolean(raffleWallet),
            raffleWallet ? raffleWallet : null,
            nextTokenId,
            true,
            `0 SOL`, // Free mint, so cost is 0
            activePhaseID
          );
          toast.success("Free mint successful!");
          const link = generateShareLink(wallet.publicKey.toString());
          setShareLink(link);
          setIsModalOpen(true);

          setNextTokenId(prevId => prevId + 1);
        } catch (error) {
          console.error("Minting failed", error);
        }
      } else {
        console.log("Transaction was not successful. Minting dismissed.");
      }
    } else {
      const transactionSuccess = await sendTransaction();
      if (transactionSuccess) {
        try {
          const data = await mpx.nfts().create({
            name: `${NFT_NAME} #${nextTokenId}`,
            symbol: NFT_SYMBOL,
            uri: nftUri,
          });

          console.log(data);

          await updateDatabase(
            wallet.publicKey.toString(),
            new Date().toISOString(),
            Boolean(raffleWallet),
            raffleWallet ? raffleWallet : null,
            nextTokenId,
            true,
            `${MINT_COST} SOL`,
            activePhaseID
          );
          toast.success("Transaction success!");
          const link = generateShareLink(wallet.publicKey.toString());
          setShareLink(link);
          setIsModalOpen(true);

          setNextTokenId(prevId => prevId + 1);
        } catch (error) {
          console.error("Minting failed", error);
        }
      } else {
        console.log("Transaction was not successful. Minting dismissed.");
      }
    }

    setIsMinting(false);
  };

  return (
    <div className="w-full z-40">
      <p className="text-xs text-center w-full mb-1 font-semibold">{raffleAmount >=5 ? "Congratulations! You are eligible for free mint 🎉" : ""}</p>
      <button
        className="w-full flex justify-center px-4 py-2 bg-gradient-to-r hover:bg-gradient-to-l from-violet-900 via-indigo-600 to-violet-800 text-white text-sm font-bold rounded cursor-pointer"
        onClick={mintNFT}
      >
        {isMinting ? <span className="flex items-center space-x-2"><h1 className="text-sm">Minting</h1><FaSpinner className="animate-spin" /></span> : raffleAmount >=5 ? "Mint for free" : 'Buy now'}
      </button>
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shareLink={shareLink}
      />
    </div>
  );
}
