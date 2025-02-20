"use client";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { Value } from "react-calendar/dist/cjs/shared/types";
import { BsFillCalendar2EventFill } from "react-icons/bs";
import {
  FaCalendarAlt,
  FaCamera,
  FaHistory,
  FaHome,
  FaSignOutAlt,
  FaSyringe,
  FaUserCircle,
} from "react-icons/fa";
import { storage } from "../appwite-config"; // Adjust the import path
import { auth, db } from "../firebaseConfig";
import "./dash.css";

interface VaccineReminders {
  id: string;
  vaccineName: VaccineDetails;
  vaccineType: string;
  fullName: string;
  preferredDate: string;
  userId: string;
  healthConditions?: string;
  notes?: string;
  email?: string;
  phone?: string;
  reminderDate?: string;
  confirmed?: boolean;
}
interface VaccineDetails {
  age_group: string;
  doses: string;
  label: string;
  protection_against: string;
  type: string;
  value: string;
}

const VaccineDashboard: React.FC = () => {
  const [events, setEvents] = useState<VaccineReminders[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [activeSection, setActiveSection] = useState<
    "today" | "upcoming" | "history"
  >("today");
  const [profilePicture, setProfilePictureUrl] = useState<string | null>(null);

  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const normalizeDate = (date: string) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const todaysReminders = events.filter(
    (reminder) =>
      normalizeDate(reminder.preferredDate) === today && !reminder.confirmed
  );
  const upcomingReminders = events.filter(
    (reminder) =>
      normalizeDate(reminder.preferredDate) > today && !reminder.confirmed
  );
  const pastReminders = events.filter(
    (reminder) =>
      normalizeDate(reminder.preferredDate) < today && reminder.confirmed
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Auth state is ${auth.currentUser}`);

        if (!auth.currentUser) return;

        const userId = auth.currentUser.uid;

        const remindersQuery = query(
          collection(db, "VaccineReminders"),
          where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(remindersQuery);

        const remindersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as VaccineReminders[];

        setEvents(remindersData);

        const userDocRef = doc(db, "Users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUsername(userData?.FirstName || "User");
          setProfilePictureUrl(userData?.profilePicture || null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && auth.currentUser) {
      try {
        console.log("File selected:", file.name);

        // Upload the file to Appwrite Storage
        const response = await storage.createFile(
          "your-bucket-id", // Replace with your Appwrite Bucket ID
          "unique()", // Unique file ID
          file
        );
        console.log("File uploaded to Appwrite Storage:", response);

        // Get the file URL
        const fileUrl = storage.getFileView("your-bucket-id", response.$id);
        console.log("File URL from Appwrite Storage:", fileUrl);

        // Save the file URL in Firestore
        const userDocRef = doc(db, "Users", auth.currentUser.uid);
        await updateDoc(userDocRef, { profilePicture: fileUrl });
        console.log("Firestore document updated successfully!");

        // Update the profile picture URL in the state
        setProfilePictureUrl(fileUrl);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    } else {
      console.error("No file selected or user not authenticated.");
    }
  };

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.some(
      (reminder) =>
        normalizeDate(reminder.preferredDate) === dateStr && !reminder.confirmed
    ) ? (
      <FaCalendarAlt className="calendar-pin" />
    ) : null;
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setCalendarDate(value);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      router.push("/"); // Redirect to homepage if user is logged in
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const confirmVaccination = async (reminderId: string) => {
    try {
      const reminderDocRef = doc(db, "VaccineReminders", reminderId);
      await updateDoc(reminderDocRef, {
        confirmed: true,
      });
      console.log("Vaccination confirmed!");

      setEvents((prevEvents) =>
        prevEvents.map((reminder) =>
          reminder.id === reminderId
            ? { ...reminder, confirmed: true }
            : reminder
        )
      );
    } catch (error) {
      console.error("Error confirming vaccination:", error);
    }
  };

  const deleteVaccinationReminder = async (reminderId: string) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this reminder?"
      );
      if (!confirmDelete) return;

      const reminderDocRef = doc(db, "VaccineReminders", reminderId);
      await deleteDoc(reminderDocRef);
      console.log("Vaccination reminder deleted!");

      setEvents((prevEvents) =>
        prevEvents.filter((reminder) => reminder.id !== reminderId)
      );
    } catch (error) {
      console.error("Error deleting vaccination reminder:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="profile-icon-container">
            <label
              htmlFor="profile-picture-input"
              className="profile-icon-label"
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="profile-icon"
                />
              ) : (
                <FaUserCircle className="profile-icon" />
              )}
              <div className="camera-icon">
                <FaCamera />
              </div>
            </label>
            <input
              id="profile-picture-input"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          {username && <div className="username">{username}</div>}
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeSection === "today" ? "active" : ""}
            onClick={() => setActiveSection("today")}
          >
            <FaHome className="menu-icon" />
            <span>Today's Vaccination</span>
          </li>
          <li
            className={activeSection === "upcoming" ? "active" : ""}
            onClick={() => setActiveSection("upcoming")}
          >
            <FaSyringe className="menu-icon" />
            <span>Upcoming Vaccines</span>
          </li>
          <li
            className={activeSection === "history" ? "active" : ""}
            onClick={() => setActiveSection("history")}
          >
            <FaHistory className="menu-icon" />
            <span>Vaccine History</span>
          </li>
          <li onClick={() => router.push("/details")}>
            <BsFillCalendar2EventFill className="menu-icon" />
            <span>Add Event</span>
          </li>
          {/* Add Home Button */}
          <li onClick={() => router.push("/home")}>
            <FaHome className="menu-icon" />
            <span>Home</span>
          </li>
        </ul>

        <button onClick={handleLogout} className="sidebar-button logout-button">
          <FaSignOutAlt className="button-icon" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="calendar-section">
        <h3>Calendar</h3>
        <Calendar
          onChange={handleDateChange}
          value={calendarDate}
          tileContent={tileContent}
        />
      </div>

      <div className="vaccination-details">
        <section className="vaccination-card">
          <h3>
            {activeSection === "today"
              ? "Today's Vaccination"
              : activeSection === "upcoming"
              ? "Upcoming Vaccines"
              : "Vaccine History"}
          </h3>
          <div className="vaccination-content">
            {activeSection === "today" && todaysReminders.length === 0 && (
              <p>No reminders for today.</p>
            )}
            {activeSection === "upcoming" && upcomingReminders.length === 0 && (
              <p>No upcoming vaccines.</p>
            )}
            {activeSection === "history" && pastReminders.length === 0 && (
              <p>No past vaccinations.</p>
            )}
            {(activeSection === "today"
              ? todaysReminders
              : activeSection === "upcoming"
              ? upcomingReminders
              : pastReminders
            ).map((reminder) => {
              const t = JSON.stringify(reminder.vaccineName);
              const r = JSON.stringify(t);

              return (
                <div key={reminder.id} className="vaccination-item">
                  <p>{reminder.vaccineName.label}</p>
                  <p>{reminder.vaccineName.age_group}</p>
                  <p>{reminder.vaccineName.doses}</p>

                  <p>{reminder.preferredDate}</p>
                  <p>{reminder.fullName}</p>
                  {reminder.confirmed ? (
                    <span>Vaccinated</span>
                  ) : (
                    <button
                      onClick={() => confirmVaccination(reminder.id)}
                      className="confirm-btn"
                    >
                      Confirm Vaccination
                    </button>
                  )}
                  <button
                    onClick={() => deleteVaccinationReminder(reminder.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default VaccineDashboard;
