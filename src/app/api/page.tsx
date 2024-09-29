
"use client";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { auth, db } from '../firebaseConfig';

const ProfileUpdate = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');

  

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
      <h1>Update Profile</h1>
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
    </div>
  );
};

export default ProfileUpdate;
