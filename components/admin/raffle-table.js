import { supabase } from '@/utils/supabase-client';
import { useEffect, useState } from 'react';

const Raffledetails = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('raffles')
        .select('*');

      if (error) {
        console.error('Error fetching token transactions:', error);
      } else {
        setTransactions(data);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="w-full pl-5 text-sm">
      <h1 className="text-lg font-bold mb-4">Raffle Details</h1>
      <div className='h-[500px] overflow-y-auto'>
        <table className="border border-gray-200 relative overflow-y-">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Wallet Address</th>
              <th className="py-2 px-4 border-b">Raffle Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id} className='hover:bg-black'>
                <td className="py-2 px-4 border-b">{transaction.id}</td>
                <td className="py-2 px-4 border-b">{transaction.wallet_address}</td>
                <td className="py-2 px-4 border-b">{transaction.raffle_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Raffledetails;
