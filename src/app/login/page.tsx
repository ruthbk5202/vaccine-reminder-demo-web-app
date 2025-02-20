"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { AppUser } from "../home/page";
import { doc, getDoc } from "firebase/firestore";
import "./login.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user's name from Firestore
      const userDocRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const fetchedName = userDoc.data()?.FirstName || "User"; // Assuming the field is "FirstName"
        setUserName(fetchedName);

        // Store the user's name in localStorage
        localStorage.setItem("username", fetchedName);

        // Create the AppUser object
        const appUser: AppUser = {
          id: user.uid,
          email: user.email || "",
          name: fetchedName, // Set the name with the fetched username
        };

        // Store the AppUser object in localStorage
        localStorage.setItem("user", JSON.stringify(appUser));

        console.log("Login successful! User data stored in localStorage:", appUser);
        router.push("/dash");
      } else {
        setError("User document not found in Firestore.");
        alert("Error: User document not found in Firestore.");
      }
    } catch (error: any) {
      setError(error.message);
      alert("Error: " + error.message);
    }
  };

  // Fetch the username from localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUserName(storedUsername);
    }
  }, []);

  return (
    <div className="login-container">
      <div className="grid-container">
        <div className="image-section">
          <img src="assets/svg/undraw.svg" alt="Login Illustration" />
        </div>
        <div className="form-section">
          <h1>Login</h1>
          <form id="login" onSubmit={handleLogin}>
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
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Login</button>

            {/* Link to Register Page */}
            <p className="register-link">
              Don't have an account?
              <a
                href="/register"
                className="register-link-text text-sky-500 mx-1"
              >
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;