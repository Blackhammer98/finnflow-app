

"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignupPage ()  {


    const [name , setName] = useState("");
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [confirmPassword , setConfirmPassword] = useState('');
    const [error , setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit  = async (e: React.FormEvent) => {
        e.preventDefault();

        if(password !== confirmPassword) {
            setError('Password do not match');
            return;
        }

        try {
            const response = await fetch('/api/register' , {
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body:JSON.stringify({name,email,password}),
            });

            const data = await response.json();

            if(response.ok) {
                console.log('Registration successful:', data.message);
                router.push('/userAuth/login?message = Registration successful. Please log in')
            } else {
                setError('Registraion failed!')
            }
        } catch (error:any) {
            setError(error.message || 'An unexpected error occurred');
        }
    }

    return(
        <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="name"
                id="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="full name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example012@gmail.com"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="0123456789"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
               Confirm Password
              </label>
              <input
                type="password"
                id="Password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Don't have an account? <a href="/userAuth/login" className="text-blue-500 hover:underline">Login</a>
          </p>
        </div>
      </div>
    )
}