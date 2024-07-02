import { useState } from 'react';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'react-toastify';

export default function PhaseModal({ isOpen, onClose, onSave }) {
  const [phaseName, setPhaseName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [jsonFile, setJsonFile] = useState(null);
  const [isSaving , setIsSaving] = useState(false);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Upload image to Supabase bucket
      let imagePath = '';
      if (imageFile) {
        const { data: imageData, error: imageError } = await supabase.storage
          .from('image')
          .upload(`public/${Date.now()}-${imageFile.name}`, imageFile);

        if (imageError) throw imageError;
        imagePath = imageData.path;
      }

      onSave({ phaseName, startTime, endTime, imagePath });
      resetForm();
    } catch (error) {
      console.error('Error saving phase:', error);
      toast.error('Error saving phase. Please try again.');
    }
    setIsSaving(false);
  };

  const resetForm = () => {
    setPhaseName('');
    setStartTime('');
    setEndTime('');
    setImageFile(null);
    setJsonFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm text-primary">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Create a New Phase</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Phase Name</label>
          <input 
            type="text" 
            value={phaseName} 
            onChange={(e) => setPhaseName(e.target.value)} 
            className="w-full p-2 border rounded" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Time</label>
          <input 
            type="datetime-local" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
            className="w-full p-2 border rounded" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Time</label>
          <input 
            type="datetime-local" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
            className="w-full p-2 border rounded" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Upload Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e, setImageFile)} 
            className="w-full p-2 border rounded" 
          />
        </div>
        <div className="flex justify-end">
          <button 
            onClick={() => { onClose(); resetForm(); }}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isSaving ? 'Saving...' : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}