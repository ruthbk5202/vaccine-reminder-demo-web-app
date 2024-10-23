"use client";

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import "./register.css";

const Register: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [name, setName] = useState("");
  const router = useRouter();

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isChecked) {
      alert("You must agree to the terms and conditions to proceed.");
      return; 
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
   
      const response = setDoc(doc(db, 'Users', user.uid), {
        FirstName: '',
        lastName: '',
        email: email,
        isAdmin: false,
        dob: '',
        profilePicture: '',
        id: user.uid,
      });
      alert('User Created successfully');
      router.push('/api');
    } catch (error: any) {
      alert("Error found: " + error.message);
    }
  }

 

  return (
    <div className="registration-container">
      <div className="group-form-section">
        <div className="image-section">
          <img
            src="assets/images/chay.jpg" // Replace with your image URL
            alt="Registration Illustration"
            className="registration-image"
          />
        </div>
        <div className="form-section">
          <h1>Register</h1>
          <form id="signUp" onSubmit={handleSignUp}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)} // Update name state
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
              />
            </div>
            <label>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              I agree to the terms and conditions
            </label>
            <div className="py-2"></div>
            
            <button type="submit">Register</button>
          
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 