"use client";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { db } from "../firebaseConfig";
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
  reminderDate: string;
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

  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      maxHeight: "300px",
      overflowY: "auto",
    }),
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

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.vaccineName) {
      alert("Please select a Vaccine Name.");
      return;
    }

    if (!formData.fullName.trim()) {
      alert("Please enter your Full Name.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email.");
      return;
    }

    if (!formData.dateOfBirth) {
      alert("Please enter your Date of Birth.");
      return;
    }

    if (!formData.preferredDate) {
      alert("Please select a Preferred Vaccination Date.");
      return;
    }

    if (!formData.reminderDate) {
      alert("Please select a Reminder Date.");
      return;
    }

    try {
      const auth = getAuth(); // Initialize Firebase Auth
      const user = auth.currentUser; // Get the current user

      if (!user) {
        alert("User is not logged in.");
        return;
      }

      // Submit the form data along with userId
      await addDoc(collection(db, "vaccineReminders"), {
        ...formData,
        vaccineName: formData.vaccineName?.value, // Only submit the vaccine name, but you can add more if needed
        userId: user.uid, // Add userId to associate event with logged-in user
      });

      alert("Vaccine details submitted successfully!");

      // Reset form after submission
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

      router.push("/home");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to submit vaccine details.");
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
          styles={customStyles}
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
