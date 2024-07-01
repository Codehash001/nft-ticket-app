import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase-client';
import { FaCircleDot } from "react-icons/fa6";
import { GiPodiumWinner } from "react-icons/gi";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import PhaseModal from './phaseModal';
import Image from 'next/image';

export default function PhaseSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPhaseStatus, setCurrentPhaseStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) {
      console.error(error);
      toast.error('Error fetching settings');
    } else {
      setSettings(data);
      checkCurrentPhaseStatus(data);
    }

    setLoading(false);
  };

  const checkCurrentPhaseStatus = (settings) => {
    const now = new Date();
    const currentPhase = settings.find(setting => {
      const start = new Date(setting.start_time);
      const end = new Date(setting.end_time);
      return now >= start && now <= end;
    });

    if (currentPhase) {
      setCurrentPhaseStatus('Current mint phase is not finished yet.');
    } else {
      setCurrentPhaseStatus('');
    }
  };

  const getStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return 'Starts Soon';
    } else if (now >= start && now <= end) {
      return 'Ongoing';
    } else {
      return 'Ended';
    }
  };

  const handleCreateNewPhase = () => {
    if (currentPhaseStatus) {
      toast.error(currentPhaseStatus);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSavePhase = async (newPhase) => {
    const { phaseName, startTime, endTime, imagePath } = newPhase;
    const { data, error } = await supabase
      .from('settings')
      .insert([{ 
        phase_name: phaseName, 
        start_time: startTime, 
        end_time: endTime,
        image_path: imagePath,
      }]);

    if (error) {
      toast.error('Error creating new phase.');
      console.error(error);
    } else {
      toast.success('New phase created successfully!');
      setIsModalOpen(false);
      fetchSettings(); // Refresh the settings after adding a new phase
    }
  };

  const fetchTokenOwners = async (phaseId) => {
    const { data, error } = await supabase
      .from('token_transactions')
      .select('token_owner')
      .eq('phase_id', phaseId);

    if (error) {
      console.error(error);
      toast.error('Error fetching token owners');
      return [];
    } else {
      return data.map((transaction) => transaction.token_owner);
    }
  };

  const handleChooseWinner = async (phaseId) => {
    const tokenOwners = await fetchTokenOwners(phaseId);
    if (tokenOwners.length === 0) {
      toast.error('No token owners found for this phase');
      return;
    }

    const randomIndex = Math.floor(Math.random() * tokenOwners.length);
    const winner = tokenOwners[randomIndex];

    const { data, error } = await supabase
      .from('settings')
      .update({ winners_wallet: winner })
      .eq('phase_id', phaseId);

    if (error) {
      console.error(error);
      toast.error('Error choosing winner');
    } else {
      toast.success('Winner chosen successfully!');
      fetchSettings(); // Refresh the settings after choosing a winner
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Mint phases</h1>
        <button 
          onClick={handleCreateNewPhase} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 flex items-center"
        >
          Create new phase
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {settings.map((setting) => (
          <div key={setting.phase_id} className="bg-white shadow-lg rounded-lg p-6 relative">
            <div className="absolute top-2 right-2">
              <div className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatus(setting.start_time, setting.end_time) === 'Ongoing' ? 'bg-green-500' : getStatus(setting.start_time, setting.end_time) === 'Starts Soon' ? 'bg-yellow-400' : 'bg-red-500'}`}>
                {getStatus(setting.start_time, setting.end_time)}
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">{setting.phase_name}</h2>
            <div className="text-gray-600 mb-4">
              <p className="flex items-center">
                <span className='text-black font-semibold'>Start Time - </span>{new Date(setting.start_time).toLocaleString()}
              </p>
              <p className="flex items-center">
                <span className='text-black font-semibold'>End Time - </span>{new Date(setting.end_time).toLocaleString()}
              </p>
            </div>
            {setting.image_path && (
              <div className="mb-4">
                <img 
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/image/${setting.image_path}`}
                  alt={`Phase ${setting.phase_name} image`}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            )}
            <hr className="my-4"/>
            <div className="text-gray-600">
              <p className="flex items-center mb-2">
                <FaCircleDot className="w-5 h-5 mr-2 text-gray-500" size={18}/>
                <strong>Phase ID:</strong> {setting.phase_id}
              </p>
              <p className="flex items-center mb-2">
                <GiPodiumWinner className="w-5 h-5 mr-2 text-gray-500" size={18}/>
                <strong>Winner:</strong> {setting.winners_wallet || 'Will be announced soon'}
              </p>
              {!setting.winners_wallet && getStatus(setting.start_time, setting.end_time) === 'Ended' && (
                <button
                  onClick={() => handleChooseWinner(setting.phase_id)}
                  className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-4 py-2 rounded-lg mb-4 flex items-center"
                >
                  Choose Winner
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <PhaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSavePhase} 
      />
    </div>
  );
}
