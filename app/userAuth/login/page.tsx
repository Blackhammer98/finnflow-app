
"use client";

import { signIn } from "next-auth/react";

import { useSearchParams,useRouter } from "next/navigation";

import { useState } from "react";

export default function LoginPage() {
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState('');
    const [error , setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
 
    const handleSubmit = async (e:React.FormEvent) => {
       e.preventDefault();

       const result = await signIn('credentials' ,{
        redirect : false ,
        email,
        password,
        callbackUrl,
       });

       if(result?.error) {
        setError(result.error);
       } else if(result?.ok) {
        router.push(callbackUrl);
       }
    }
      

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>
          <form onSubmit={handleSubmit}>
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
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Sign In
            </button>
         
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Don't have an account? <a href="/userAuth/signup" className="text-blue-500 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    ) 
}