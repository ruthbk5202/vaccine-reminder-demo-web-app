"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { auth, db } from "../firebaseConfig";
import "./register.css";

const Register: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
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

      const response = setDoc(doc(db, "Users", user.uid), {
        FirstName: "",
        lastName: "",
        email: email,
        isAdmin: false,
        dob: "",
        profilePicture: "",
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
                  type={showPassword ? "text" : "password"} // Toggle input type
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                  {/* Toggle icon */}
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
            <div className="py-2"></div>

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
