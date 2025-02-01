"use client";

import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { auth, db, storage } from "../firebaseConfig"; // Ensure `storage` is imported
import "./profile.css";

const UpdateProfile: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");

  const router = useRouter();

  async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("No user is logged in!");
      return;
    }

    try {
      let profilePictureURL = "";

      if (profilePicture) {
        const storageRef = ref(
          storage,
          `profilePictures/${user.uid}/${profilePicture.name}`
        );
        await uploadBytes(storageRef, profilePicture);
        profilePictureURL = await getDownloadURL(storageRef);
      }

      const userDocRef = doc(db, "Users", user.uid);

      await updateDoc(userDocRef, {
        FirstName: firstName,
        lastName: lastName,
        dob: dob,
      });

      alert("Profile updated successfully!");
      router.push("/home");
    } catch (error: any) {
      alert("Error updating profile: " + error.message);
    }
  }

  return (
    <div className="update-profile-container">
      <div className="grid-container">
        <img src="assets/svg/update.svg"></img>
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
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
            <label htmlFor="lastName">Last Name</label>
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
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
