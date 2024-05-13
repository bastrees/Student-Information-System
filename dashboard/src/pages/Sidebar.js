import React from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {Button,} from "@mui/material";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage or perform any other logout actions
    localStorage.removeItem('user'); // Assuming you store a token for authentication
    // Redirect to login or home page
    navigate('/');
  };

  return (
    <div className="sidebar">
      <Link to="/dashboard"><HomeIcon /> Home  </Link>
      <Link to="/addstudent"><PersonAddAltIcon /> Add Student  </Link>
      <Link to="/viewstudent"> View Student  </Link>
      <Link to="/viewusers">View Users </Link>
      <Link to="/managestudent">Manage Student</Link>
      <Button variant="contained" onClick={handleLogout}>Log out</Button>
    </div>
  );
}

export default Sidebar;
