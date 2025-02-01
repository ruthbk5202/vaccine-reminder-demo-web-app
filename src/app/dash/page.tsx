"use client";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import type { Value } from "react-calendar/dist/cjs/shared/types"; // Import Calendar and Value
import "react-calendar/dist/Calendar.css";
import {
  FaCalendarAlt,
  FaCog,
  FaHome,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { auth, db } from "../firebaseConfig";
import "./dash.css";

interface vaccineReminders {
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

const VaccineDashboard: React.FC = () => {
  const [events, setEvents] = useState<vaccineReminders[]>([]);
  const [today, setToday] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);

  // Key for local storage
  const LOCAL_STORAGE_KEY = "vaccineReminders";

  // Fetch data from Firestore
  const fetchData = async () => {
    try {
      // Check if the user is authenticated
      if (!auth.currentUser) {
        console.error("No authenticated user found.");
        return;
      }

      // Query Firestore for documents where userId matches the current user's UID
      const q = query(
        collection(db, "vaccineReminders"),
        where("userId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      // Map the documents to the VaccineReminders interface
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as unknown as vaccineReminders[];

      // Set the fetched data to the state
      setEvents(data);

      // Save the data to local storage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Load data from local storage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      setEvents(JSON.parse(savedData));
      setLoading(false); // Data is already loaded from local storage
    } else {
      fetchData(); // Fetch data from Firestore if local storage is empty
    }
  }, []);

  // Normalize date for comparison
  const normalizeDate = (date: string) => date.split("T")[0];

  // Filter data for today, upcoming, and past vaccinations
  const todaysReminders = events.filter(
    (reminder) => normalizeDate(reminder.preferredDate) === today
  );
  const upcomingReminders = events.filter(
    (reminder) => normalizeDate(reminder.preferredDate) > today
  );
  const pastReminders = events.filter(
    (reminder) => normalizeDate(reminder.preferredDate) < today
  );

  // Highlight vaccination dates on the calendar
  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split("T")[0];
    const hasVaccination = events.some(
      (reminder) => normalizeDate(reminder.preferredDate) === dateStr
    );
    return hasVaccination ? <FaCalendarAlt className="calendar-pin" /> : null;
  };

  // Handle date change for the calendar
  const handleDateChange = (
    value: Value,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (value instanceof Date) {
      setCalendarDate(value); // Update the calendar date state
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setCalendarDate(value[0]); // Handle range selection (use the first date)
    } else if (value === null) {
      // Handle null case (optional)
      console.log("Date selection was cleared.");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear local storage
      console.log("User signed out successfully.");
      window.location.href = "/"; // Redirect to login page
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Display loading state while fetching data
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Menu Bar */}
      <div className="menu-bar">
        <h1>Vaccine Dashboard</h1>
        <div className="menu-icons">
          <FaHome className="icon" />
          <FaUser className="icon" />
          <FaCog className="icon" />
        </div>
        <div className="profile-section">
          <span>{auth.currentUser?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Left Section: Calendar */}
        <div className="calendar-section">
          <h3>Calendar</h3>
          <Calendar
            onChange={handleDateChange} // Use the custom handler
            value={calendarDate}
            tileContent={tileContent}
          />
        </div>

        {/* Right Section: Vaccination Details */}
        <div className="vaccination-details">
          <section>
            <h3>Today&apos;s Vaccination</h3>
            {todaysReminders.length > 0 ? (
              todaysReminders.map((reminder, index) => (
                <div key={index} className="vaccine-card">
                  <h4>{reminder.vaccineName}</h4>
                  <p>{reminder.fullName}</p>
                  <p>{reminder.vaccineType}</p>
                  <p>{reminder.preferredDate}</p>
                </div>
              ))
            ) : (
              <p>No vaccinations today.</p>
            )}
          </section>

          <section>
            <h3>Upcoming Vaccines</h3>
            {upcomingReminders.length > 0 ? (
              upcomingReminders.map((reminder, index) => (
                <div key={index} className="vaccine-card">
                  <h4>{reminder.vaccineName}</h4>
                  <p>{reminder.fullName}</p>
                  <p>{reminder.vaccineType}</p>
                  <p>{reminder.preferredDate}</p>
                </div>
              ))
            ) : (
              <p>No upcoming vaccines.</p>
            )}
          </section>

          <section>
            <h3>Vaccine History</h3>
            {pastReminders.length > 0 ? (
              pastReminders.map((reminder, index) => (
                <div key={index} className="vaccine-card">
                  <h4>{reminder.vaccineName}</h4>
                  <p>{reminder.fullName}</p>
                  <p>{reminder.vaccineType}</p>
                  <p>{reminder.preferredDate}</p>
                </div>
              ))
            ) : (
              <p>No vaccine history.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default VaccineDashboard;