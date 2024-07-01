import React, { useState, useEffect } from 'react';
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { FaCalendarCheck, FaCircleDot } from "react-icons/fa6";
import MintButton from "./mintButton";
import { format } from 'date-fns';
import Confetti from 'react-confetti';
import { IoCloseSharp } from "react-icons/io5";

import { supabase } from '@/utils/supabase-client';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg max-w-lg w-full">
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-full bg-white text-purple-500 p-2 hover:bg-purple-100"
        >
          <IoCloseSharp/>
        </button>
      </div>
    </div>
  );
};

export default function Ticket({ raffleWallet }) {
    const [phase, setPhase] = useState(null);
    const [status, setStatus] = useState('loading');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        fetchLatestPhase();
        updateWindowSize();
        window.addEventListener('resize', updateWindowSize);
        return () => window.removeEventListener('resize', updateWindowSize);
    }, []);

    const updateWindowSize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const fetchLatestPhase = async () => {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .order('phase_id', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching phase:', error);
            setStatus('error');
        } else if (data) {
            setPhase(data);
            setStatus(getStatus(data));
            if (data.winners_wallet) {
                setIsModalOpen(true);
            }
        }
    };

    const getStatus = (phaseData) => {
        const now = new Date();
        const startTime = new Date(phaseData.start_time);
        const endTime = new Date(phaseData.end_time);

        if (now < startTime) return 'upcoming';
        if (now >= startTime && now <= endTime) return 'active';
        return 'ended';
    };

    const truncateAddress = (address) => {
        if (address && address.length > 10) {
            return `${address.slice(0, 6)}...${address.slice(-4)}`;
        }
        return address;
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error loading phase information.</div>;
    }

    return (
        <>
            <div className="max-w-md mx-auto bg-background rounded-lg shadow-md overflow-hidden md:max-w-4xl text-muted-foreground z-40">
                <div className="md:flex">
                    <div className="flex items-center justify-center bg-muted md:flex-shrink-0 border-r-2 border-black border-dotted">
                        <div className="px-8 py-4 text-center">
                            <div className="text-4xl font-bold text-black">{format(new Date(phase.end_time), 'd')}</div>
                            <div className="text-xl text-gray-600">{format(new Date(phase.end_time), 'MMMM')}</div>
                        </div>
                    </div>
                    <div className="p-8">
                        <h2 className="text-xl font-bold">
                            {phase && phase.winners_wallet ? "Winner" : 'Next Winner'} 
                        </h2>
                        <h1 className="text-2xl font-bold text-gray-900">
                        {phase && phase.winners_wallet ? `${truncateAddress(phase.winners_wallet)}` : 'will be announced soon...'}
                        </h1>
                        <div className="mt-2 text-gray-600 space-y-2">
                            <div className="flex items-center space-x-2">
                                <FaCalendarCheck />
                                <span>{format(new Date(phase.end_time), 'EEEE do MMMM')}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MdOutlineAccessTimeFilled />
                                <span>@{format(new Date(phase.end_time), 'h:mm a')}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaCircleDot />
                                <span>Grab your ticket and take a chance to win</span>
                            </div>
                        </div>
                        <div className="w-full flex flex-col mt-4">
                            {status === 'active' && <MintButton raffleWallet={raffleWallet} />}
                            {status === 'upcoming' && <p className='bg-gradient-to-r from-rose-700 to-pink-600 p-3 text-white rounded'>Mint will start soon...</p>}
                            {status === 'ended' && <p className='bg-gradient-to-r from-rose-700 to-pink-600 p-3 text-white rounded'>Mint phase has ended, hang tight!</p>}
                        </div>
                    </div>
                    <div className="w-[280px] h-auto rounded-lg p-[1px] bg-muted">
                        <img src="/home-image.png" alt="Home" className="rounded-lg" />
                    </div>
                </div>
            </div>
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
            >
                <h2 className="text-4xl font-bold text-white mb-4">🎉 Congratulations!</h2>
                <p className="text-white font-bold break-all">
                    {phase && phase.winners_wallet ? `${phase.winners_wallet}` : 'No winner yet'}
                </p>
                <p>is the winner of this phase</p>
                {/* <p className="text-white mt-2">Truncated address:</p> */}
                {/* <p className="text-white font-bold">
                    {phase && phase.winners_wallet ? truncateAddress(phase.winners_wallet) : 'N/A'}
                </p> */}
            </Modal>
            {isModalOpen && <Confetti width={windowSize.width} height={window.innerHeight} />}
        </>
    );
}