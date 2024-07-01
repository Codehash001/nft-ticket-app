import { supabase } from '@/utils/supabase-client';
import { useEffect, useState } from 'react';

const TokenTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('token_transactions')
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
    <div className="w-full p-5 text-sm">
      <h1 className="text-lg font-bold mb-4">Token Transactions</h1>
      <div className="overflow-x-auto max-w-6xl">
        <div className="max-h-[calc(100vh-200px)]">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="sticky top-0 bg-gray-100 text-black">
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Token Owner</th>
                <th className="py-2 px-4 border-b">Transaction Time</th>
                <th className="py-2 px-4 border-b">Is Using Raffle</th>
                <th className="py-2 px-4 border-b">Raffle Wallet</th>
                <th className="py-2 px-4 border-b">Token ID</th>
                <th className="py-2 px-4 border-b">Success</th>
                <th className="py-2 px-4 border-b">Cost</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-900 hover:text-white">
                  <td className="py-2 px-4 border-b">{transaction.id}</td>
                  <td className="py-2 px-4 border-b">{transaction.token_owner}</td>
                  <td className="py-2 px-4 border-b">{new Date(transaction.transaction_time).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{transaction.is_using_raffle ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b">{transaction.raffle_wallet}</td>
                  <td className="py-2 px-4 border-b">{transaction.token_id}</td>
                  <td className="py-2 px-4 border-b">{transaction.success ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b">{transaction.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TokenTransactions;