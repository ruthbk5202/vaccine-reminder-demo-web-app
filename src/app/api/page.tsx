"use client";

import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import "./profile.css";

const UpdateProfile: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [profilePicture, setProfilePicture] = useState(""); // Store image URL or file path
  const router = useRouter();

  async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("No user is logged in!");
      return;
    }

    try {
      
      const userDocRef = doc(db, "Users", user.uid);

      await updateDoc(userDocRef, {
        FirstName: firstName,
        lastName: lastName,
        dob: dob,
        profilePicture: profilePicture,
      });

      alert("Profile updated successfully!");
      router.push("/home"); 
    } catch (error: any) {
      alert("Error updating profile: " + error.message);
    }
  }

  return (
    <div className="update-profile-container">
      <h1>Update Profile</h1>
      <form onSubmit={handleUpdateProfile}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture URL:</label>
          <input
            type="text"
            id="profilePicture"
            name="profilePicture"
            required
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
        </div>

        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
