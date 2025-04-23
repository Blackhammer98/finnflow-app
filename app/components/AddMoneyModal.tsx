
import React, { useState } from "react"

interface AddMoneyModalProps {
    onClose : () => void;
}

interface AddMoneyResult {
    message?: string;
    error?: string,
}
const AddMoneyModal: React.FC<AddMoneyModalProps> = ({onClose}) => {
  
    const [addMoneyAmount ,  setAddMoneyAmount] = useState('');
    const [selectedBank , setSelectedBank] = useState('');
    const [addMoneyResult, setAddMoneyResult] = useState<AddMoneyResult | null>(null);

    const handleAddMoney = async (e: React.FormEvent) => {
      e.preventDefault();
      setAddMoneyResult(null);
      


      if (!addMoneyAmount || isNaN(Number(addMoneyAmount)) || Number(addMoneyAmount) <= 0 || !selectedBank) {
        setAddMoneyResult({ error: 'Please provide a valid amount and select a bank.' });
        return;
    }

    try {
        const response = await fetch("/api/add-money" , {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json',
            },

            body : JSON.stringify({amount : addMoneyAmount , bank : selectedBank})
        });

        const data =   await response.json();

        if(response.ok) {
            setAddMoneyResult({ message: data.message });
            setAddMoneyAmount('');
            setSelectedBank('');
        } else {
            setAddMoneyResult({ error: data.error || 'Failed to add money.' });
        }
    } catch (error) {
        
        console.error('Error adding money:', error);
        setAddMoneyResult({ error: 'An unexpected error occurred.' });
    }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="relative p-8 bg-neutral-50 w-full max-w-md rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add Money</h2>
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
               
            </button>
            <form onSubmit={handleAddMoney} className="space-y-4">
                <div>
                    <label htmlFor="addMoneyAmount" className="block text-gray-700 text-sm font-bold mb-2">
                        Amount to Add (₹):
                    </label>
                    <input
                        type="number"
                        id="addMoneyAmount"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={addMoneyAmount}
                        onChange={(e) => setAddMoneyAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </div>
                <div>
                    <label htmlFor="selectedBank" className="block text-gray-700 text-sm font-bold mb-2">
                        Choose Bank:
                    </label>
                    <select
                        id="selectedBank"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                    >
                        <option value="">Select Bank</option>
                        <option value="SimulatedBankA">HDFC</option>
                        <option value="SimulatedBankB">Axis Bank</option>
                        {/* Add more simulated banks as needed */}
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Add Money
                </button>
            </form>
            {addMoneyResult?.message && (
                    <div className="mt-4 text-green-500">{addMoneyResult.message}</div>
                )}
                {addMoneyResult?.error && (
                    <div className="mt-4 text-red-500">{addMoneyResult.error}</div>
                )}
                {addMoneyResult?.message && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">
                            Simulated Transaction: No actual bank transfer will occur.
                        </p>
                    </div>
                )}
            </div>
            </div>
    )
}

export default AddMoneyModal;