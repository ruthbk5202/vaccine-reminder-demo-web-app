"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth, db, storage } from "../firebaseConfig";
import "./register.css";

const Register: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const router = useRouter();

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isChecked) {
      alert("You must agree to the terms and conditions to proceed.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let profilePictureUrl = "";
      if (profilePicture) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePicture);
        profilePictureUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "Users", user.uid), {
        FirstName: name,
        lastName: "",
        email: email,
        isAdmin: false,
        dob: "",
        profilePicture: profilePictureUrl,
        id: user.uid,
      });

      alert("User Created successfully");
      router.push("/profile");
    } catch (error: any) {
      alert("Error found: " + error.message);
    }
  }

  return (
    <div className="registration-container">
      <div className="grid-container">
        <div className="image-section">
          <img src="assets/svg/undraw.svg"></img>
        </div>
        <div className="form-section">
          <h1>Register</h1>
          <form id="signUp" onSubmit={handleSignUp}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group password-input-container">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                </button>
              </div>
            </div>

            <label>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              I agree to the terms and conditions
            </label>
            <div className="register-btn">
              <button type="submit">Register</button>
            </div>
            <div className="sign-in">
              <p>Known to Vaccine Reminder? </p>
              <span className="link-sign">
                <a href="/login">Sign In</a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
