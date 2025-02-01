"use client";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { auth, db } from "../firebaseConfig";
import "./details.css";

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
  preferredTime: string;
  reminderDate: string;
  reminderTime: string;
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
    preferredTime: "",
    reminderDate: "",
    reminderTime: "",
    healthConditions: "",
    notes: "",
  });

  const [vaccineOptions, setVaccineOptions] = useState<Vaccine[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();

  // Check authentication state
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

  // Fetch vaccine options from Firestore
  const fetchVaccineOptions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Vaccines"));
      const options = querySnapshot.docs.map((doc) => ({
        label: doc.data().name,
        value: doc.data().name,
        type: doc.data().type,
        age_group: doc.data().age_group,
        protection_against: doc.data().protection_Against,
        doses: doc.data().doses,
      }));
      setVaccineOptions(options);
    } catch (error) {
      console.error("Error fetching vaccine data: ", error);
    }
  };

  useEffect(() => {
    fetchVaccineOptions();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle vaccine selection change
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

  // Validate email
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure user is authenticated
    if (!auth.currentUser) {
      alert("You must be logged in to submit the form.");
      router.push("/login");
      return;
    }

    // Basic validation
    if (
      !formData.vaccineName ||
      !formData.fullName ||
      !formData.dateOfBirth ||
      !formData.email ||
      !formData.phone ||
      !formData.preferredDate ||
      !formData.preferredTime ||
      !formData.reminderDate ||
      !formData.reminderTime
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      // Save data to Firestore
      const docRef = await addDoc(collection(db, "VaccineReminders"), {
        vaccineName: formData.vaccineName.label,
        vaccineType: formData.vaccineType,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        reminderDate: formData.reminderDate,
        reminderTime: formData.reminderTime,
        healthConditions: formData.healthConditions || "",
        notes: formData.notes || "",
        userId: auth.currentUser.uid,
      });

      console.log("Document written with ID: ", docRef.id);

      // Prepare email data
      const emailData = {
        to_email: formData.email,
        to_name: formData.fullName,
        message: `Your vaccine reminder for ${formData.vaccineName.label} has been scheduled for ${formData.preferredDate} at ${formData.preferredTime}. We wish you good health and a better life. Thank you for choosing us!`,
      };

      // Send email using Nodemailer API
      const emailResponse = await axios.post(
        "D:/firebase/vaccine-app/src/app/pages/api/SendEmail.js",
        emailData
      );

      // Check if the email was sent successfully
      if (emailResponse.status === 200) {
        alert(
          "Vaccine details submitted and confirmation email sent successfully!"
        );
      } else {
        throw new Error("Failed to send email.");
      }

      // Reset form after successful submission
      setFormData({
        vaccineName: null,
        vaccineType: "",
        fullName: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        reminderDate: "",
        reminderTime: "",
        healthConditions: "",
        notes: "",
      });

      // Redirect to dashboard
      router.push("/dash");
    } catch (error) {
      console.error("Error adding document or sending email: ", error);

      // Handle errors
      if (error instanceof Error) {
        if (error.message.includes("Failed to send email")) {
          alert(
            "Vaccine details submitted, but the confirmation email failed to send. Please check your email address and try again."
          );
        } else {
          alert("Failed to submit vaccine details. Please try again.");
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Vaccine Reminder Form</h2>

      <label>
        Vaccine Name:
        <Select
          options={vaccineOptions}
          value={formData.vaccineName}
          onChange={handleVaccineChange}
          placeholder="Select a vaccine..."
          isSearchable={true}
          required
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
        />
      </label>

      <label>
        Preferred Vaccination Time:
        <input
          type="time"
          name="preferredTime"
          value={formData.preferredTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Reminder Date:
        <input
          type="date"
          name="reminderDate"
          value={formData.reminderDate}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Reminder Time:
        <input
          type="time"
          name="reminderTime"
          value={formData.reminderTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Health Conditions (Optional):
        <input
          type="text"
          name="healthConditions"
          value={formData.healthConditions}
          onChange={handleChange}
        />
      </label>

      <label>
        Notes (Optional):
        <textarea name="notes" value={formData.notes} onChange={handleChange} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default VaccineForm;
