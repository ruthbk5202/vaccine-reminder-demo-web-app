"use client";
import React, { useEffect, useState } from "react";
import "./dashboard.css";

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

interface VaccineDashboardProps {
  events: vaccineReminders[];
}

const VaccineDashboard: React.FC<VaccineDashboardProps> = ({ events }) => {
  const [today, setToday] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const normalizeDate = (date: string) => date.split("T")[0];

  const todaysReminders = events.filter(
    (reminder) => normalizeDate(reminder.preferredDate) === today
  );
  const upcomingReminders = events.filter(
    (reminder) => normalizeDate(reminder.preferredDate) > today
  );
  const pastReminders = events.filter(
    (reminder) => normalizeDate(reminder.preferredDate) < today
  );

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  return (
    <div className="dashboard-container">
      <section>
        <h3>Today&apos;s Vaccination</h3>
        <div className="today-card">
          <div className="today-date">
            <span className="today-day">{new Date().getDate()}</span>
            <span className="today-month">
              {new Date().toLocaleString("default", { month: "short" })}
            </span>
          </div>
          <div className="today-details">
            {todaysReminders.length > 0 ? (
              todaysReminders.map((reminder, index) => (
                <div key={index}>
                  <h4>{reminder.vaccineName}</h4>
                  <p>{reminder.fullName}</p>
                  <p>{reminder.vaccineType}</p>
                </div>
              ))
            ) : (
              <p>No vaccinations today.</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h3>Upcoming Vaccines</h3>
        {upcomingReminders.length > 0 ? (
          <div className="upcoming-cards-container">
            {upcomingReminders.map((reminder, index) => (
              <div key={index} className="vaccine-card">
                <div className="vaccine-date">
                  <span className="vaccine-day">
                    {new Date(reminder.preferredDate).getDate()}
                  </span>
                  <span className="vaccine-month">
                    {new Date(reminder.preferredDate).toLocaleString(
                      "default",
                      { month: "short" }
                    )}
                  </span>
                </div>
                <div className="vaccine-details">
                  <h4>{reminder.vaccineName}</h4>
                  <p>{reminder.vaccineType}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming vaccines.</p>
        )}
      </section>

      <section>
        <h3>Vaccine History</h3>
        {pastReminders.length > 0 ? (
          <div className="history-cards-container">
            {pastReminders.map((reminder, index) => (
              <div key={index} className="vaccine-card">
                <div className="vaccine-date">
                  <span className="vaccine-day">
                    {new Date(reminder.preferredDate).getDate()}
                  </span>
                  <span className="vaccine-month">
                    {new Date(reminder.preferredDate).toLocaleString(
                      "default",
                      { month: "short" }
                    )}
                  </span>
                </div>
                <div className="vaccine-details">
                  <h4>{reminder.vaccineName}</h4>
                  <p>{reminder.vaccineType}</p>
                  <p>
                    <strong>Full Name:</strong> {reminder.fullName}
                  </p>
                  <p>
                    <strong>Reminder Date:</strong> {reminder.reminderDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No vaccine history.</p>
        )}
      </section>
    </div>
  );
};

export default VaccineDashboard;
