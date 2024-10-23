"use client";
import Link from 'next/link';
import React from 'react';
import "./navbar.css";

const NavBar: React.FC = () => {

  const handleNavigate = () => {
    console.log('navigating to register page');
  };

  const handleNavigateLogin = () => {
   
  };

  return (
    <nav>
      <div>
        <div>
          <Link href="/">Logo</Link >
        </div>
        <div className='links'>
          <Link href="/">The Vaccine App</Link>
          <Link href="/">FAQ</Link>
      
         
            <Link href="/register">
              <button onClick={handleNavigate}>Register</button>
            </Link>
          
          <Link href="/login">
            <button onClick={handleNavigateLogin}>Login</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
