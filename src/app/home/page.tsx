"use client";
import Event from "@/app/components/events/Event";
import Footer from "@/app/components/footer/Footer";
import Info from "@/app/components/info/Info";
import NavBar from "@/app/components/navbar/NavBar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  where,
  updateDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import VaccineDashboard from "../components/dashbord/Dashboard";
import VaccineImp from "../components/impvaccine/VaccineImp";

function HomePage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [hasEvents, setHasEvents] = useState(false);
  const [loading, setLoading] = useState(true); // For loading state
  const auth = getAuth();
  const db = getFirestore();

  // Check user status on load
  useEffect(() => {
    const checkUserStatus = async () => {
      const user = auth.currentUser;

      if (user) {
        // User is logged in
        setIsRegistered(true);

        try {
          // Check if user has completed their profile
          const userDocRef = doc(db, "Users", user.uid);
          await updateDoc(userDocRef, {
            profileCompleted: true, // Set this to true when the user completes the profile
          });
          const unsubscribeUserProfile = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              console.log("User Data:", userData); // Check what data is being fetched

              if (userData.profileCompleted) {
                setHasProfile(true);
              } else {
                console.log("Profile not completed!");
                setHasProfile(false);
              }
            } else {
              console.log("User document not found!");
              setHasProfile(false);
            }
          });
          // Listen for real-time updates to the user's events
          const eventQuery = query(
            collection(db, "vaccineReminders"),
            where("userId", "==", user.uid)
          );
          const unsubscribe = onSnapshot(eventQuery, (snapshot) => {
            if (!snapshot.empty) {
              setHasEvents(true);
              console.log(
                "Events found:",
                snapshot.docs.map((doc) => doc.data())
              );
            } else {
              setHasEvents(false);
              console.log("No events found!");
            }
          });
          setLoading(false); // Data loading finished

          return () => {
            unsubscribe();
            unsubscribeUserProfile();
          }; // Clean up listener on unmount
        } catch (error) {
          console.error("Error fetching user or event data:", error);
        }
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        checkUserStatus(); // Check user status when logged in
      } else {
        setLoading(false); // If no user, stop loading
      }
    });
  }, [auth, db]);

  // Show loading while checking user status
  if (loading) {
    return <p>Loading...</p>; // Optionally use a spinner
  }

  return (
    <div>
      <NavBar />
      {/* Conditionally render the dashboard and other sections */}
      {isRegistered && hasProfile && hasEvents ? (
        <>
       
          <VaccineDashboard />
          <Event />
          <VaccineImp />
        </>
      ) : isRegistered && hasProfile ? (
        // Show Event component so the user can add their first event
        <div>
          <p>Please add at least one event to access the dashboard:</p>
          <Event />
        </div>
      ) : isRegistered && !hasProfile? (
        <div>Please complete your profile to access the dashboard.</div>
      ) : (
        <div>Please log in or register to access the dashboard.</div>
      )}
      <Info />
      <Footer />
    </div>
  );
}

export default HomePage;
