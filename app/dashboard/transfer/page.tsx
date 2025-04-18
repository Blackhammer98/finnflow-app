"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TranferResult {
    message?  : string;
    error? : string
    transactionId? : number;
} 

interface BalanceDetails {
  totalBalance?  : number ;
  lockedBalance? : number;
  unlockedBalance? : number;
  error?: string;
  loading?: boolean;
}

export default function TransferPage() {

    const [recipientId , setRecipientId] = useState("");
    const [amount , setAmount] = useState('');
    const [transferResult  , setTransferResult] = useState<TranferResult | null>(null);
    const {data: session} = useSession();
    const [balanceDetails , setBalanceDetails] = useState<BalanceDetails>({
      totalBalance  : 0 ,
      lockedBalance : 0,
      unlockedBalance : 0,
      error : undefined,
      loading: true
    });

    useEffect(() => { 
        const fetchBalance = async () => {
          if(session?.user?.id) {
            try {
              const response = await fetch("/api/balance");
              if(response.ok) {
                const data = await response.json();
                setBalanceDetails({
                  totalBalance : data.totalBalance,
                  lockedBalance : data.locked,
                  unlockedBalance: data.totalBalance - data.locked,
                  error : undefined,
                  loading : false,
                });
              } else {
                 const errorData = await response.json();
                 setBalanceDetails({
                  totalBalance: 0,
                  lockedBalance: 0,
                  unlockedBalance: 0,
                  error: errorData.error || 'Failed to fetch balance.',
                  loading: false,
                 })
              }
            } catch (error) {
              console.error('Error fetching balance:',error)    
              setBalanceDetails({
                totalBalance: 0,
                lockedBalance: 0,
                unlockedBalance: 0,
                error: 'An unexpected error occurred while fetching balance.',
                loading: false,
            });
                 
            }
          } else {
            setBalanceDetails(prevState => ({...prevState , loading:false}));
          }
        };
        fetchBalance();
    },[session?.user?.id])

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
      <div className="p-6 flex space-x-4">
      {/* Fund Transfer Card */}
      <div className="w-1/2 border border-gray-200 rounded-lg shadow-sm bg-neutral-50">
          <h1 className="p-4 text-xl font-semibold">Transfer Funds</h1>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                      Recipient User ID:
                  </label>
                  <input
                      type="text"
                      id="recipientId"
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
              <div className="p-4 mt-4 text-green-500">
                  {transferResult.message} (Transaction ID: {transferResult.transactionId})
              </div>
          )}
          {transferResult?.error && <div className="p-4 mt-4 text-red-500">{transferResult.error}</div>}
      </div>

       {/* Balance Details Card */}
       <div className="w-1/2 border border-gray-200 rounded-lg shadow-sm bg-neutral-50">
          <h2 className="p-4 text-xl font-semibold">Balance Details</h2>
          <div className="p-4 space-y-2">
              {balanceDetails.loading ? (
                  <p>Loading balance...</p>
              ) : balanceDetails.error ? (
                  <p className="text-red-500">{balanceDetails.error}</p>
              ) : (
                  <>
                      <div className=" flex justify-between border-b-2 border-slate-100 pb-2">
                           <div>
                            Total Balance:
                           </div>
                           <div>
                           ₹{(balanceDetails?.totalBalance)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </div>
                      </div>
                      <div className=" flex justify-between border-b-2 border-slate-100 py-2">
                           <div>
                           Unlocked Balance: 
                           </div>
                           <div>
                           ₹{(balanceDetails?.unlockedBalance)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </div>
                      </div>
                      <div className=" flex justify-between border-b-2 border-slate-100 py-2">
                           <div>
                           Locked Balance: 
                           </div>
                           <div>
                           ₹{(balanceDetails?.lockedBalance)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </div>
                      </div>
                  </>
              )}
          </div>
      </div>
  </div>
    )
}