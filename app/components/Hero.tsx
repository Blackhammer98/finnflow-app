"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section 
      id="home" 
      className="pt-32 pb-20 md:pt-40 md:pb-28 bg-indigo-950 text-white relative overflow-hidden"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-accent-500/5 z-0"
        aria-hidden="true"
      />
      
      <div className="container mx-12 px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block">Simplify</span>
              <span className="text-blue-400">Payments</span>,
              <span className="block mt-2">Elevate</span>
              <span className="text-blue-400">Experiences</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
              Send money, make transfers, and manage your finances with ease using
              FinnFlow's secure platform.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a href='/userAuth/signup'>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/20 flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              </a>
              <button className="border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm bg-white/5 hover:bg-white/10">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur opacity-30 animate-pulse"></div>
              <div className="relative bg-white rounded-2xl p-1">
                <img 
                  src="https://t4.ftcdn.net/jpg/13/06/99/09/240_F_1306990989_9josTMOqdoOGolNtA4BYlvnVHa7X4CZD.jpg" 
                  alt="Mobile payment illustration" 
                  className="max-w-full h-auto max-h-80 md:max-h-96 object-cover rounded-xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-navy-900 to-transparent z-10"
        aria-hidden="true"
      />
    </section>
  );
};

export default Hero;