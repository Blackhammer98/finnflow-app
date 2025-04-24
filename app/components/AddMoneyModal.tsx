// components/AddMoneyModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";


interface AddMoneyModalProps {
  onClose: () => void;
  onSuccess?: (transaction: any) => void;
}

export default function AddMoneyModal({ onClose, onSuccess }: AddMoneyModalProps) {
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("bank_transfer")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter amount, Step 2: Payment confirmation

  const modalRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the modal to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (!isSubmitting) {
          onClose();
        }
      }
    }

    // Handle escape key press
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose, isSubmitting]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and a single decimal point
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (step === 1) {
      // Move to confirmation step
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/onRamp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`₹${parseFloat(amount).toFixed(2)} added to your wallet successfully!`);
        setStep(3); // Success step
        
        if (onSuccess) {
          onSuccess(data.transaction);
        }
        
        // Auto close after success (3 seconds)
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(data.error || "Failed to add money");
        setStep(1); // Go back to first step on error
      }
    } catch (error) {
      console.error("Error adding money:", error);
      setError("An unexpected error occurred");
      setStep(1); // Go back to first step on error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment method options
  const paymentMethods = [
    { id: "bank_transfer", name: "Bank Transfer", icon: "🏦", },
    { id: "credit_card", name: "Credit Card", icon: "💳" },
    { id: "upi", name: "UPI", icon: "📱" },
    { id: "netbanking", name: "Net Banking", icon: "🖥️" },
  ];

  // Quick amount options
  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transition-all duration-300 transform"
      >
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Money to Wallet</h2>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {successMessage && step === 3 && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {successMessage}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-600">₹</span>
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={handleInputChange}
                    className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Quick Amount</label>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      type="button"
                      onClick={() => setAmount(quickAmount.toString())}
                      className={`py-2 border ${
                        parseFloat(amount) === quickAmount
                          ? "bg-blue-100 border-blue-500 text-blue-700"
                          : "bg-gray-50 border-gray-300 text-gray-800 hover:bg-gray-100"
                      } rounded-lg transition-colors`}
                    >
                      ₹{quickAmount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setProvider(method.id)}
                      className={`cursor-pointer p-3 border ${
                        provider === method.id
                          ? "bg-blue-50 border-blue-400"
                          : "border-gray-300 hover:bg-gray-50"
                      } rounded-lg transition-colors`}
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{method.icon}</span>
                        <span className="text-sm">{method.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-3 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center"
                  disabled={!amount || isSubmitting || parseFloat(amount) <= 0}
                >
                  Continue
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Payment Summary</h3>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">₹{parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">
                    {paymentMethods.find(m => m.id === provider)?.name}
                  </span>
                </div>
                <div className="flex justify-between py-2 mt-2">
                  <span className="text-gray-800 font-medium">Total</span>
                  <span className="text-blue-600 font-bold">₹{parseFloat(amount).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mr-3 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Confirm Payment"
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p className="text-gray-600">Redirecting back to wallet...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}