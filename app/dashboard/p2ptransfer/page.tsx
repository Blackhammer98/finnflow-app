"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ArrowRight, AlertCircle, CheckCircle, Loader } from "lucide-react";


interface TransferResult {
  message?: string;
  error?: string;
  transactionId?: number;
}

interface RecipientInfo {
  id: number;
  name: string;
  email: string;
}

export default function P2PTransferPage() {
  const { data: session } = useSession();
  const [recipientId, setRecipientId] = useState("");
  const [recipientInfo, setRecipientInfo] = useState<RecipientInfo | null>(null);
  const [amount, setAmount] = useState("");
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  // Fetch user balance on component mount
  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch("/api/balance");
      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.totalBalance);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchRecipientDetails = async (id: string) => {
    setFetchingUser(true);
    try {
      console.log("Fetching user with ID:", id);
      const recipientIdInt = parseInt(id);
      if (isNaN(recipientIdInt)) {
        throw new Error("Invalid recipient ID");
      }
  
      const response = await fetch(`/api/users/${recipientIdInt}`);
      console.log("API response status:", response.status);
      
      const responseData = await response.json();
      console.log("API response data:", responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || "User not found");
      }
  
      setRecipientInfo(responseData);
      return responseData;
    } catch (error:any) {
      console.error("Error in fetchRecipientDetails:", error);
      setTransferResult({ error: error.message || "Failed to find recipient" });
      return null;
    } finally {
      setFetchingUser(false);
    }
  };

  const handleSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (showConfirmation) {
      setIsLoading(true);
      await processTransfer();
      setIsLoading(false);
      setShowConfirmation(false);
    } else {
      await validateAndShowConfirmation();
    }
  };

  const validateAndShowConfirmation = async () => {
    setTransferResult(null);

    // Basic validation
    if (!recipientId || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setTransferResult({
        error: "Please provide a valid Recipient ID and amount",
      });
      return;
    }

    // Check if amount exceeds balance
    if (Number(amount) > userBalance) {
      setTransferResult({
        error: "Insufficient balance for this transfer",
      });
      return;
    }

    // Fetch recipient details to show in confirmation
    const recipient = await fetchRecipientDetails(recipientId);
    if (recipient) {
      setShowConfirmation(true);
    }
  };

  const processTransfer = async () => {
    try {
      if (session?.user?.id) {
        // Convert to appropriate types before sending
        const recipientIdInt = parseInt(recipientId);
        const amountValue = parseFloat(amount);

        const response = await fetch("/api/transfer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientId: recipientIdInt,
            amount: amountValue,
            description: description,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setTransferResult({
            message: data.message,
            transactionId: data.transactionId,
          });
          setRecipientId("");
          setAmount("");
          setDescription("");
          // Refresh balance after successful transfer
          fetchBalance();
        } else {
          setTransferResult({ error: data.error || "Transfer failed." });
        }
      } else {
        setTransferResult({ error: "Not authenticated. Please log in." });
      }
    } catch (error: any) {
      console.error("Error initiating transfer:", error);
      setTransferResult({ error: "An unexpected error occurred." });
    }
  };

  const cancelTransfer = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border border-gray-200 rounded-lg shadow-md bg-white">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Transfer Funds</h1>
          <p className="text-gray-500 mt-1">Send money to another user instantly</p>
          <div className="mt-2 p-2 bg-blue-50 rounded-md">
            <p className="text-blue-700">Available Balance: ₹{userBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        {!showConfirmation ? (
          <form onSubmit={handleSubmitTransfer} className="p-6 space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Recipient User ID
              </label>
              <input
                type="number"
                id="recipientId"
                className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Enter recipient's user ID"
                disabled={isLoading || fetchingUser}
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <input
                  type="number"
                  id="amount"
                  className="shadow-sm border border-gray-300 rounded-md w-full py-3 pl-8 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  max={userBalance}
                  step="0.01"
                  disabled={isLoading || fetchingUser}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a note (e.g., Rent payment)"
                rows={2}
                disabled={isLoading || fetchingUser}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
              disabled={isLoading || fetchingUser}
            >
              {fetchingUser ? (
                <>
                  <Loader className="animate-spin mr-2 h-4 w-4" />
                  Verifying Recipient...
                </>
              ) : (
                <>
                  Continue to Review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="p-6 space-y-5">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h2 className="text-lg font-medium text-blue-800 mb-2">Confirm Transfer Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="font-medium">{recipientInfo?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipient ID:</span>
                  <span className="font-medium">{recipientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{recipientInfo?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹ {amount}</span>
                </div>
                {description && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium">{description}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                onClick={cancelTransfer}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
                onClick={handleSubmitTransfer}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  "Confirm Transfer"
                )}
              </button>
            </div>
          </div>
        )}

        {transferResult?.message && (
          <div className="p-6 bg-green-50 border-t border-green-200 rounded-b-lg">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium">{transferResult.message}</p>
                <p className="text-green-600 text-sm">Transaction ID: {transferResult.transactionId}</p>
              </div>
            </div>
          </div>
        )}

        {transferResult?.error && (
          <div className="p-6 bg-red-50 border-t border-red-200 rounded-b-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <p className="text-red-800 font-medium">{transferResult.error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}