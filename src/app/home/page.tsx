"use client";
import Event from "@/app/components/events/Event";
import Footer from "@/app/components/footer/Footer";
import Info from "@/app/components/info/Info";
import NavBar from "@/app/components/navbar/NavBar";
import "./home.css";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import AboutUs from "../components/about/AboutUs";
import VaccineDashboard from "../components/dashbord/Dashboard";
import BackgroundSlider from "../components/imageslider/ImageSlider";
import VaccineImp from "../components/impvaccine/VaccineImp";

interface VaccineReminders {
  id?: string;
  vaccineName: string;
  vaccineType: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  preferredDate: string;
  reminderDate: string;
  healthConditions?: string;
  notes?: string;
  userId: string;
}

function HomePage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [hasEvents, setHasEvents] = useState(false);
  const [userEvents, setUserEvents] = useState<VaccineReminders[]>([]);
  const [loading, setLoading] = useState(true);
  const [FirstName, setFullName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkUserStatus = async () => {
      const user = auth.currentUser;

      if (user) {
        setIsRegistered(true);

        try {
          const userDocRef = doc(db, "Users", user.uid);
          await updateDoc(userDocRef, {
            profileCompleted: true,
          });

          const unsubscribeUserProfile = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.profileCompleted) {
                setFullName(userData.FirstName);

                setHasProfile(true);
              } else {
                setHasProfile(false);
              }
            } else {
              setHasProfile(false);
            }
          });

          const eventQuery = query(
            collection(db, "vaccineReminders"),
            where("userId", "==", user.uid)
          );

          const unsubscribe = onSnapshot(eventQuery, (snapshot) => {
            if (!snapshot.empty) {
              const events = snapshot.docs
                .map((doc) => {
                  const eventData = doc.data();
                  if (
                    eventData &&
                    eventData.userId &&
                    eventData.vaccineName &&
                    eventData.vaccineType
                  ) {
                    return {
                      id: doc.id,
                      ...eventData,
                    } as VaccineReminders;
                  } else {
                    console.warn(
                      `Document with ID ${doc.id} has incomplete data:`,
                      eventData
                    );
                    return null;
                  }
                })
                .filter((event): event is VaccineReminders => event !== null);

              console.log("Fetched events:", events);
              setUserEvents(events);
              setHasEvents(true);
            } else {
              setHasEvents(false);
              setUserEvents([]);
            }
          });

          setLoading(false);

          return () => {
            unsubscribe();
            unsubscribeUserProfile();
          };
        } catch (error) {
          console.error("Error fetching user or event data:", error);
        }
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        checkUserStatus();
      } else {
        setLoading(false);
      }
    });
  }, [auth, db]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <NavBar
        profilePicture={profileImage}
        firstName={FirstName}
        isRegistered={isRegistered}
        hasProfile={hasProfile}
        hasEvents={hasEvents}
      />
      {!isRegistered ? (
        <>
          <BackgroundSlider />
        </>
      ) : isRegistered && hasProfile && hasEvents ? (
        <>
          <p>welcome {FirstName}!</p>

          <VaccineDashboard events={userEvents} />
          <Event />
        </>
      ) : isRegistered && hasProfile && !hasEvents ? (
        <div>
          <p>Please add at least one event to access the dashboard:</p>
          <Event />
        </div>
      ) : isRegistered && !hasProfile ? (
        <div>
          <p>Please complete your profile to access the dashboard.</p>
          <Event />
        </div>
      ) : (
        <div>Please log in or register to access the dashboard.</div>
      )}
      <VaccineImp />
      <Info />
      <AboutUs />
      <Footer />
    </div>
  );
}

export default HomePage;
