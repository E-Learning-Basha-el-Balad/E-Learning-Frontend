import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaUserCircle } from 'react-icons/fa'; // Import an icon (e.g., user icon)
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

interface UserMenuProps {
  name: string | undefined;
}

const UserMenu: React.FC<UserMenuProps> = ({ name }) => {
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
      window.location.href = '/'; 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        id="dropdown-basic"
        className="w-10 h-10 rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
        style={{
          border: 'none',    // Remove any border
          padding: 0,        // Remove any padding
          width: 'auto',     // Make the width fit the icon
          height: 'auto',
          backgroundColor: "#31087b"   // Make the height fit the icon
        }}
      >
        {/* Add the icon here */}
        <FaUserCircle size={35} />
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu dropdown-menu-lg" style={{
        minWidth: '400px',  // Set the minimum width of the dropdown
        fontSize: '18px',   // Increase font size
        padding: '15px',    // Add padding to the dropdown items
        maxHeight: '400px', // Optional: Set a maximum height for the menu
        overflowY: 'auto',  // Allow scrolling if content exceeds max height
      }}>
        <h3>Welcome {name}</h3>
        <Dropdown.Item href="#/dashboard">Dashboard</Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserMenu;