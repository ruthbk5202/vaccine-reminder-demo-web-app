"use client"
import React, { useState } from 'react';
import './footer.css'; 

const Footer: React.FC = () => {
    const [name,setName]=useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateEmail(email)) {
      setMessage('Thank you for subscribing!' +name+'!');
      setName('');
      setEmail('');
    } else {
      setMessage('Please enter a valid email address.');
    }
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <footer className="footer">
      <div className='paragraph'>
        <p>The Vaccine App is an official digital vaccine card replacing all paper counterparts globally. 
          Your personal digital vaccine record which you can never lose. From birth to Adulthood.</p>
          
      </div>
      <div className="footer-content">
        <h2>NEWSLETTER</h2>
        <p>Subscribe to our newsletter for the latest updates.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <button type="submit">Subscribe</button>
        </form>
        {message && <p className="message">{message}</p>}
    
      <div className="footer-links">
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms-of-service">Terms of Service</a>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
