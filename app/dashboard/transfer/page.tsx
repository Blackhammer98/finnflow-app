"use client";

import AddMoneyModal from "@/app/components/AddMoneyModal";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";



interface BalanceDetails {
  totalBalance?  : number ;
  lockedBalance? : number;
  unlockedBalance? : number;
  error?: string;
  loading?: boolean;
}

interface Transaction {
    id : number;
    status  :string;
    token : string;
    provider  : string;
    amount : number;
    startTime  :string
}

interface TransactionHistory {
    transactions : Transaction[];
    error?: string;
    loading : boolean;
}
export default function TransferPage() {

   
    const {data: session} = useSession();
    const [balanceDetails , setBalanceDetails] = useState<BalanceDetails>({
      totalBalance  : 0 ,
      lockedBalance : 0,
      unlockedBalance : 0,
      error : undefined,
      loading: true
    });
    const [transactionHistory , setTransactionHistory] = useState<TransactionHistory>({
        transactions : [],
        error : undefined,
        loading : true
    })
      
    const [isAddMoneyModalOpen , setIsAddMoneyModalOpen] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

    const openAddmoneyModal = () => {
        setIsAddMoneyModalOpen(true)
    }

    const closeAddmoneyModal = () => {
        setIsAddMoneyModalOpen(false)
    }
    const handleTransactionSuccess = (transaction: any) => {
     
      setRefreshTrigger(prev => prev + 1);
  };
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
    },[session?.user?.id ,  refreshTrigger]);

    useEffect(() => {
     const fetchTransactions = async () => {
        if(session?.user?.id) {

            try {
                const response = await fetch("/api/onRamp");
                if(response.ok) {
                    const data = await response.json();
                    setTransactionHistory({
                        transactions : data.transactions || [],
                        error : undefined,
                        loading  : false,
                    });
                } else {
                    const errorData = await response.json();
                    setTransactionHistory({
                        transactions: [],
                        error: errorData.error || 'Failed to fetch transaction history.',
                        loading: false,
                    });
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            setTransactionHistory({
              transactions: [],
              error: 'An unexpected error occurred while fetching transaction history.',
              loading: false,
            });
            }
        } else {
            setTransactionHistory(prevState => ({...prevState , loading: false}))
        }
     };
     fetchTransactions();
    },[session?.user?.id , refreshTrigger ])

     
    const getStatusColor = (status: string) => {
        switch(status.toUpperCase()) {
          case 'SUCCESS':
            return 'text-green-500';
          case 'PROCESSING':
            return 'text-yellow-500';
          case 'FAILURE':
            return 'text-red-500';
          default:
            return 'text-gray-500';
        }
      };
  
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

    return (
      <div className="p-6 flex  space-x-4">
      

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
          <div className="p-4">
            <button
                onClick={openAddmoneyModal}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
            >
                Add Money
            </button>
        </div>
          
      </div>
       {/* Transaction History Card */}
       <div className="w-full border border-gray-200 rounded-lg shadow-sm bg-neutral-50">
          <h2 className="p-4 text-xl font-semibold">Transaction History</h2>
          <div className="p-4">
            {transactionHistory.loading ? (
              <p>Loading transaction history...</p>
            ) : transactionHistory.error ? (
              <p className="text-red-500">{transactionHistory.error}</p>
            ) : transactionHistory.transactions.length === 0 ? (
              <p className="text-gray-500">No transaction history available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">ID</th>
                      <th className="py-3 px-6 text-left">Status</th>
                      <th className="py-3 px-6 text-left">Provider</th>
                      <th className="py-3 px-6 text-right">Amount</th>
                      <th className="py-3 px-6 text-right">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {transactionHistory.transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">
                          {transaction.id}
                        </td>
                        <td className="py-3 px-6 text-left">
                          <span className={`font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-left">
                          {transaction.provider}
                        </td>
                        <td className="py-3 px-6 text-right">
                          +₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-6 text-right">
                          {formatDate(transaction.startTime)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      {isAddMoneyModalOpen && <AddMoneyModal onClose={closeAddmoneyModal} onSuccess={handleTransactionSuccess} />}
  </div>
    );
}