"use client";
import { useRouter } from "next/navigation";
import { IoMdAdd } from "react-icons/io";

import "./event.css";
const Event = () => {
  const router = useRouter();
  const handleAddEvent = () => {
    router.push("/details");
  };
  return (
    <div>
      <div className="event-button">
        <button onClick={handleAddEvent} className="btn">
          <IoMdAdd size={24} />
        </button>
      </div>
    </div>
  );
};

export default Event;
