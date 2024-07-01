// components/FAQs.js

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from './faqModal';
import { MdKeyboardArrowDown , MdKeyboardArrowUp } from "react-icons/md";

export default function FAQSettings() {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      setFaqs(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching FAQs:', error.message);
    }
  };

  const handleAddFAQ = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('faqs')
        .insert([{ question: newQuestion, answer: newAnswer }]);
      
      if (error) {
        throw error;
      }

      setFaqs([...faqs, data[0]]);
      closeAndResetModal();
      toast.success('New FAQ added successfully!');
    } catch (error) {
      console.error('Error adding FAQ:', error.message);
      toast.error('Failed to add FAQ.');
    }
  };

  const openModal = () => setIsModalOpen(true);

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setNewQuestion('');
    setNewAnswer('');
  };

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto p-4">
        <div className='w-full flex items-center justify-between mb-4'>
        <h1 className="text-xl font-semibold">FAQs</h1>
      
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 flex items-center"
        onClick={openModal}
      >
        Add new FAQ
      </button>
        </div>

      <div className="space-y-4">
        {isLoading ? (
          <p>Loading FAQs...</p>
        ) : faqs.map((faq, index) => (
          <div key={faq.id} className="border rounded">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleAccordion(index)}
            >
              <h2 className="text-lg font-semibold">{faq.question}</h2>
              <button>
                {expandedIndex === index ? <MdKeyboardArrowUp size={25}/> : <MdKeyboardArrowDown size={25}/>}
              </button>
            </div>
            <div 
              className={`overflow-hidden transition-all duration-400 ${expandedIndex === index ? 'max-h-screen' : 'max-h-0'}`}
            >
              <div className="p-4">
                <p className="text-gray-200">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={closeAndResetModal}>
          <h2 className="text-2xl font-bold mb-4">Add New FAQ</h2>
          <form onSubmit={handleAddFAQ}>
            <div className="mb-4">
              <label htmlFor="question" className="block text-gray-700">Question</label>
              <input
                type="text"
                id="question"
                className="border rounded w-full p-2"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="answer" className="block text-gray-700">Answer</label>
              <textarea
                id="answer"
                className="border rounded w-full p-2"
                rows="4"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                onClick={closeAndResetModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add FAQ
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
