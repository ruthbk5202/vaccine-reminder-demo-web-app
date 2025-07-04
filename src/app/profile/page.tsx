"use client";

import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { auth, db } from "../firebaseConfig";
import "./profile.css";

const UpdateProfile: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("No user is logged in!");
      return;
    }

    try {
      setIsLoading(true);

      const userDocRef = doc(db, "Users", user.uid);
      const updateData = {
        FirstName: firstName,
        lastName: lastName,
        dob: dob,
      };

      await updateDoc(userDocRef, updateData);
      console.log("Profile updated successfully in Firestore!");
      alert("Profile updated successfully!");

      setTimeout(() => {
        router.push("/dash");
      }, 1000);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSkip() {
    router.push("/dash");
  }

  return (
    <div className="update-profile-container">
      <div className="grid-container">
        <Image src="assets/svg/update.svg" alt="Update Profile" ></Image>
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </button>

          <button
            type="button"
            className="skip-button mt-6 text-left"
            onClick={handleSkip}
          >
            Skip
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
