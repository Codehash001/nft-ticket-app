import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-client';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FechedFaqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase.from('faqs').select('*');
      if (error) throw error;
      setFaqs(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching FAQs:', error.message);
      setIsLoading(false);
    }
  };

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto p-4 mt-10 max-w-3xl z-40">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4 z-40">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="bg-white shadow-md rounded-lg overflow-hidden z-40">
              <button
                className="w-full text-left p-4 focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">{faq.question}</h2>
                  {expandedIndex === index ? (
                    <ChevronUp className="text-blue-500" />
                  ) : (
                    <ChevronDown className="text-gray-500" />
                  )}
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  expandedIndex === index ? 'max-h-96' : 'max-h-0'
                } overflow-hidden`}
              >
                <p className="p-4 text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FechedFaqs;