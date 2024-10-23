"use client";
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import './dashboard.css'; 

interface VaccineReminders {
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
}

const VaccineDashboard: React.FC = () => {
  const [reminders, setReminders] = useState<VaccineReminders[]>([]);

  const fetchReminders = () => {
    const unsubscribe = onSnapshot(
      collection(db, 'vaccineReminders'), 
      (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data() as VaccineReminders);
        setReminders(data);
      }, 
      (error) => {
        console.error('Error fetching reminders: ', error);
      }
    );
    
    return unsubscribe; 
  };

  useEffect(() => {
    const unsubscribe = fetchReminders();
    
    
    return () => {
      unsubscribe();
    };
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const todaysReminders = reminders.filter(reminder => reminder.preferredDate === today);
  const upcomingReminders = reminders.filter(reminder => reminder.preferredDate > today);
  const pastReminders = reminders.filter(reminder => reminder.preferredDate < today);

  return (
    <div className="dashboard-container">
      <section>
        <h3>Today's Vaccination</h3>
        <div className="today-card">
          <div className="today-date">
            <span className="today-day">{new Date().getDate()}</span>
            <span className="today-month">{new Date().toLocaleString('default', { month: 'short' })}</span>
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
                  <span className="vaccine-day">{new Date(reminder.preferredDate).getDate()}</span>
                  <span className="vaccine-month">
                    {new Date(reminder.preferredDate).toLocaleString('default', { month: 'short' })}
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
                  <span className="vaccine-day">{new Date(reminder.preferredDate).getDate()}</span>
                  <span className="vaccine-month">
                    {new Date(reminder.preferredDate).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div className="vaccine-details">
                  <h4>{reminder.vaccineName}</h4>
                  <p>{reminder.vaccineType}</p>
                  <p><strong>Full Name:</strong> {reminder.fullName}</p>
                  <p><strong>Reminder Date:</strong> {reminder.reminderDate}</p>
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
