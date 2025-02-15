"use client";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { auth, db } from "../firebaseConfig";
import "./details.css";
require("dotenv").config();

interface Vaccine {
  label: string;
  value: string;
  type: string;
  age_group: string;
  protection_against: string;
  doses: string;
}

interface VaccineFormData {
  vaccineName: Vaccine | null;
  vaccineType: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  preferredDate: string;
  reminderDate: string; // This will now include both date and time
  healthConditions?: string;
  notes?: string;
}

const VaccineForm: React.FC = () => {
  const [formData, setFormData] = useState<VaccineFormData>({
    vaccineName: null,
    vaccineType: "",
    fullName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    preferredDate: "",
    reminderDate: "",
    healthConditions: "",
    notes: "",
  });

  const [vaccineOptions, setVaccineOptions] = useState<Vaccine[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user.uid);
        setIsAuthReady(true);
      } else {
        console.log("No user is authenticated.");
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchVaccineOptions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Vaccines"));
      const options = querySnapshot.docs.map((doc) => ({
        label: doc.data().name,
        value: doc.data().name,
        type: doc.data().type,
        age_group: doc.data().age_group,
        protection_against: doc.data().protection_against,
        doses: doc.data().doses,
      }));
      setVaccineOptions(options);
    } catch (error) {
      console.error("Error fetching vaccine data: ", error);
      setError("Failed to fetch vaccine data. Please try again.");
    }
  };

  useEffect(() => {
    fetchVaccineOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVaccineChange = (option: any) => {
    if (option) {
      setFormData({
        ...formData,
        vaccineName: option,
        vaccineType: option.type,
      });
    } else {
      setFormData({
        ...formData,
        vaccineName: null,
        vaccineType: "",
      });
    }
  };

  const validateForm = () => {
    if (
      !formData.vaccineName ||
      !formData.fullName ||
      !formData.dateOfBirth ||
      !formData.email ||
      !formData.phone ||
      !formData.preferredDate ||
      !formData.reminderDate
    ) {
      alert("Please fill out all required fields.");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    if (!auth.currentUser) {
      alert("You must be logged in to submit the form.");
      router.push("/login");
      setIsSubmitting(false);
      return;
    }

    try {
      // Save data to Firestore
      const docRef = await addDoc(collection(db, "VaccineReminders"), {
        vaccineName: formData.vaccineName,
        vaccineType: formData.vaccineType,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        preferredDate: formData.preferredDate,
        reminderDate: formData.reminderDate,
        healthConditions: formData.healthConditions || "",
        notes: formData.notes || "",
        userId: auth.currentUser.uid,
      });

      console.log("Document written with ID: ", docRef.id);

      // Prepare email data
      const emailData = {
        sender_email: "vreminder15@gmail.com",
        receiver_email: formData.email,
        subject: `Vaccine Reminder for ${formData.fullName}`,
        body: `Dear ${formData.fullName},\n\nThis is a reminder for your upcoming vaccination of ${formData.vaccineName?.label} on ${formData.reminderDate}. Please make sure to be on time.\n\nRegards, Vaccine Reminder System`,
        smtp_username: process.env.NEXT_PUBLIC_SMTP_USERNAME, // Use environment variable
        smtp_password: process.env.NEXT_PUBLIC_SMTP_PASSWORD, // Use environment variable
        reminder_date: new Date(formData.reminderDate).toISOString(), // Ensure proper date format
      };

      // Send data to backend to schedule email
      const response = await fetch("http://127.0.0.1:5000/schedule-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule reminder email.");
      }

      alert(
        "Vaccine details submitted and reminder email scheduled successfully!"
      );

      // Reset form
      setFormData({
        vaccineName: null,
        vaccineType: "",
        fullName: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        preferredDate: "",
        reminderDate: "",
        healthConditions: "",
        notes: "",
      });

      // Redirect to dashboard
      // router.push("/dash");
    } catch (error) {
      console.error("Error adding document or scheduling email: ", error);
      setError("Failed to submit vaccine details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Vaccine Reminder Form</h2>

      {error && <div className="error-message">{error}</div>}

      <label>
        Vaccine Name:
        <Select
          options={vaccineOptions}
          value={formData.vaccineName}
          onChange={handleVaccineChange}
          placeholder="Select a vaccine..."
          isSearchable={true}
          required
          aria-label="Select a vaccine"
        />
      </label>

      <label>
        Vaccine Type:
        <input
          type="text"
          name="vaccineType"
          value={formData.vaccineType}
          onChange={handleChange}
          required
          readOnly
          aria-label="Vaccine Type"
        />
      </label>

      <label>
        Full Name:
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          aria-label="Full Name"
        />
      </label>

      <label>
        Date of Birth:
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          aria-label="Date of Birth"
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-label="Email"
        />
      </label>

      <label>
        Phone:
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          aria-label="Phone"
        />
      </label>

      <label>
        Preferred Vaccination Date:
        <input
          type="date"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          required
          aria-label="Preferred Vaccination Date"
        />
      </label>

      <label>
        Reminder Date and Time:
        <input
          type="datetime-local"
          name="reminderDate"
          value={formData.reminderDate}
          onChange={handleChange}
          required
          aria-label="Reminder Date and Time"
        />
      </label>

      <label>
        Health Conditions (Optional):
        <input
          type="text"
          name="healthConditions"
          value={formData.healthConditions}
          onChange={handleChange}
          aria-label="Health Conditions"
        />
      </label>

      <label>
        Notes (Optional):
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          aria-label="Notes"
        />
      </label>

      <button type="submit" disabled={isSubmitting} aria-label="Submit Form">
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default VaccineForm;
