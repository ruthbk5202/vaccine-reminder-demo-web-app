"use client";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import "./impvaccine.css";

interface Vaccines {
  name: string;
  type: string;
  age_group: string;
  protection_against: string;
  doses: string;
}

const VaccineImp: React.FC = () => {
  const [vaccines, setVaccines] = useState<Vaccines[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Vaccines"));
        console.log("Query Snapshot:", querySnapshot.docs); // Debugging
        const vaccineData: Vaccines[] = [];
        querySnapshot.forEach((doc) => {
          vaccineData.push(doc.data() as Vaccines);
        });
        console.log("Vaccine Data:", vaccineData); // Debugging
        setVaccines(vaccineData);
      } catch (error) {
     
        console.error("Error fetching vaccine data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccines();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="scrollable-section">
      {vaccines.map((vaccine, index) => (
        <div className="vaccine-card-scroll" key={index}>
          <h6>{vaccine?.name}</h6>
          <div className="group-content">
            <p>Type: {vaccine.type}</p>
            <p>Age Group: {vaccine.age_group}</p>
            <p>Protection Against: {vaccine.protection_against}</p>
            <p>Doses: {vaccine.doses}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VaccineImp;
