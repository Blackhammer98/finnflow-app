"use client";


import React, { useState, useEffect } from 'react';
import { CircleDollarSign, Menu, X } from 'lucide-react';
import Link from 'next/link';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-navy-900/95 backdrop-blur-md py-4 shadow-lg' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              <CircleDollarSign className="h-8 w-8 text-primary-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">FinnFlow</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link href="#home" className="text-white hover:text-primary-400 transition-colors">Home</Link>
            <Link href="#features" className="text-white hover:text-primary-400 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-white hover:text-primary-400 transition-colors">How It Works</Link>
            
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/userAuth/login" 
              className="text-white hover:text-primary-400 transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link 
              href="/userAuth/signup" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Sign Up
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 mt-2 py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="#home" 
              className="text-white hover:text-primary-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="#features" 
              className="text-white hover:text-primary-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-white hover:text-primary-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
              <Link 
                href="/userAuth/login"
                className="text-white hover:text-primary-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/userAuth/signup" 
                className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;