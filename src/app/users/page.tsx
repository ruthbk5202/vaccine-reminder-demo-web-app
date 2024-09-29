"use client";

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import Register from '../register/page';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); 
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create a new document in Firestore
      const response = await setDoc(doc(db,'Users',user.uid), {
        Name: '',
        lastName: '',
        email: email,
        isAdmin: false,
        dob: '',
        profilePicture: '',
        id: user.uid,
      });

      console.log("Document written with ID: ", user.uid);

      // Mark success
      setSuccess(true);
      alert('User Created successfully');
    } catch (err) {
      setError('Failed to sign In: ' + (err as Error).message);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'Users', user.uid);

        // Update the user document with additional information
        await updateDoc(userDocRef, {
          Name:name,
          dob:dob,
          id: user.uid,
        });

        alert('Profile updated successfully');
      } else {
        setError('No user is logged in.');
      }
    } catch (err) {
      setError('Failed to update profile: ' + (err as Error).message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h1>{ }</h1>
      {!success ? (  <Register/>          
     /* <form onSubmit={handleSignUp}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Login</button>
        </form>*/

      ) : (
        <form onSubmit={handleUpdateProfile}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label>Date of Birth:</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Update Profile</button>
        </form>
      )}
    </div>
  );
};

export default SignInPage;
