"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

interface TranferResult {
    message?  : string;
    error? : string
    transactionId? : number;
} 

export default function TransferPage() {

    const [recipientId , setRecipientId] = useState("");
    const [amount , setAmount] = useState('');
    const [transferResult  , setTransferResult] = useState<TranferResult | null>(null);
    const {data: session} = useSession();

    const handleSubmit = async(e : React.FormEvent) => {
        e.preventDefault();
        setTransferResult(null);

        if(!recipientId || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setTransferResult({error : "Please provide a valid recipient ID and amount."})
            return;
        }

        try {

            const response = await fetch("/api/transfer" , {
                method : "POST" ,
                headers : {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipientId, amount }),
            });

            const data = await response.json();

            if(response.ok) {
                setTransferResult({ message: data.message, transactionId: data.transactionId });
                setRecipientId('');
                setAmount('');
            } else {
                setTransferResult({ error : data.error || 'Transfer failed.' });
            }
            
        } catch (error:any) {
            console.error('Error initiating transfer:', error);
      setTransferResult({ error: 'An unexpected error occurred.' });
        }
    }
    return (
        <div className="p-6 max-w-sm border border-gray-200 rounded-lg mt-10 shadow-sm bg-neutral-50 ">
              <h1 className ="text-2xl font-semibold mb-4">Transfer Funds </h1>
              <form onSubmit={handleSubmit} className="max-w-md space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Recipient User ID:
                    </label>
                    <input
                    type = "text"
                    id  = "recipientId"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    placeholder="Enter the Recipient's User ID"
                    />
                </div>
                <div>
          <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
            Amount to Transfer (₹):
          </label>
          <input
            type="number"
            id="amount"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Transfer
        </button>
              </form>
              {transferResult?.message && (
        <div className="mt-4 text-green-500">
          {transferResult.message} (Transaction ID: {transferResult.transactionId})
        </div>
      )}
      {transferResult?.error && <div className="mt-4 text-red-500">{transferResult.error}</div>}
        </div>
    )
}