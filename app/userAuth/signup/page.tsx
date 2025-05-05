

"use client";
import React, { useState } from 'react';
import { CircleDollarSign, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data.message);
        router.push('/userAuth/login?message = Registration successful. Please log in')
      } else {
        setError('Registration failed!');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    }
  };

  const features = [
    'Fast and secure transactions',
    'Low transaction fees',
    '24/7 customer support',
  ];

  return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center p-2">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-indigo-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Side - Feature Highlights */}
        <div className="bg-blue-600 p-8 md:p-12 relative overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <CircleDollarSign className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">FinnFlow</span>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start your financial journey with us
            </h1>
            <p className="text-white/90 text-lg mb-12">
              Secure, fast, and convenient payments. Join thousands of users who trust
              FinnFlow for their financial needs.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl transform translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-700/20 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="p-8 md:p-12 bg-indigo-900">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
            <p className="text-gray-400 mb-8">
              Join FinnFlow today and take control of your finances
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-indigo-800 border border-indigp-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-indigo-800 border border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-indigo-800 border border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  placeholder="Create a strong password"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-indigo-800 border border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {error && (
                <p className="text-error-500 text-sm">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Create Account
              </button>
            </form>

            {/* Sign In Link */}
            <p className="mt-6 text-center text-gray-400">
              Already have an account?{' '}
              <Link href="/userAuth/login" className="text-blue-400 hover:text-blue-300">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

// import { useRouter } from "next/navigation";
// import React, { useState } from "react";

// export default function SignupPage ()  {


//     const [name , setName] = useState("");
//     const [email , setEmail] = useState('');
//     const [password , setPassword] = useState('');
//     const [confirmPassword , setConfirmPassword] = useState('');
//     const [error , setError] = useState<string | null>(null);
//     const router = useRouter();

//     const handleSubmit  = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if(password !== confirmPassword) {
//             setError('Password do not match');
//             return;
//         }

//         try {
//             const response = await fetch('/api/register' , {
//                 method : 'POST',
//                 headers: {
//                     'Content-Type' : 'application/json',
//                 },
//                 body:JSON.stringify({name,email,password}),
//             });

//             const data = await response.json();

//             if(response.ok) {
//                 console.log('Registration successful:', data.message);
//                 router.push('/userAuth/login?message = Registration successful. Please log in')
//             } else {
//                 setError('Registraion failed!')
//             }
//         } catch (error:any) {
//             setError(error.message || 'An unexpected error occurred');
//         }
//     }

//     return(
//         <div className="flex justify-center items-center h-screen bg-gray-100">
//         <div className="bg-white p-8 rounded shadow-md w-96">
//           <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
//           <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//               <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
//                 Name
//               </label>
//               <input
//                 type="name"
//                 id="name"
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="full name"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="example012@gmail.com"
//                 required
//               />
//             </div>
//             <div className="mb-6">
//               <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="0123456789"
//                 required
//               />
//             </div>
//             <div className="mb-6">
//               <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//                Confirm Password
//               </label>
//               <input
//                 type="password"
//                 id="Password"
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 placeholder="password"
//                 required
//               />
//             </div>
//             {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//             >
//               Sign Up
//             </button>
//           </form>
//           <p className="mt-4 text-sm text-gray-600 text-center">
//             Don't have an account? <a href="/userAuth/login" className="text-blue-500 hover:underline">Login</a>
//           </p>
//         </div>
//       </div>
//     )
// }