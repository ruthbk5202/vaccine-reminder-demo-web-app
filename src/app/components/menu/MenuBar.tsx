import React from "react";
import { FaBell, FaCog, FaHistory, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom"; // If using React Router
import "./menu.css"; // Import icons from Font Awesome

const MenuBar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Vaccine App</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/">
            <FaHome className="icon" /> {/* Home icon */}
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/">
            <FaBell className="icon" /> {/* Bell icon */}
            <span>Reminders</span>
          </Link>
        </li>
        <li>
          <Link to="/">
            <FaHistory className="icon" /> {/* History icon */}
            <span>History</span>
          </Link>
        </li>
        <li>
          <Link to="/">
            <FaCog className="icon" /> {/* Settings icon */}
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuBar;
