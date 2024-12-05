"use client";

import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import "./navbar.css";

const NavBar: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "Users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();

            setFirstName(data.FirstName || null);
            setIsRegistered(true);
            setHasProfile(!!data.FirstName);
          } else {
            setIsRegistered(false);
            setHasProfile(false);
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
      } else {
        setFirstName(null);
        setIsRegistered(false);
        setHasProfile(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        setFirstName(null);
        setIsRegistered(false);
        setHasProfile(false);
        router.push("/");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <nav>
      <div>
        <div className="nav-icon">
          <Link href="/">
            <img src="assets/images/vaccine.png" alt="Vaccine App Logo" />
          </Link>
        </div>
        <div className="links text-slate-400">
          <Link href="/">The Vaccine App</Link>

          {isRegistered && hasProfile ? (
            <div className="user-info">
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link href="/register">
              <button>Register</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
