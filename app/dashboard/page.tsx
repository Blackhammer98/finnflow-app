


'use client';

import React from 'react';

export default function DashboardHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Account Overview</h2>
          <p>Your current balance: ₹XXXX</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Send Money</h2>
          <p>Feature coming soon...</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
          <p>Your recent transactions will be shown here.</p>
        </div>
        {/* Add more sections for user search, profile, etc. */}
      </div>
    </div>
  );
}