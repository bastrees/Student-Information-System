import React, { useState } from 'react';
import './AddStudent.css';
import { TextField, Button, MenuItem } from '@mui/material';
import Sidebar from './Sidebar.js';
 
function AddStudent() {
  const [IdNumber, setIdNumber] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [MiddleName, setMiddleName] = useState("");
  const [Course, setCourse] = useState("");
  const [Year, setYear] = useState("");
 
  const isAddButtonDisabled = !IdNumber || !FirstName || !LastName || !MiddleName || !Course || !Year;
 
  function handleIdNumberChange(e) {
    const value = e.target.value;
    if (/^\d{0,8}$/.test(value)) {
      setIdNumber(value);
    }
  }
 
  function handleNameChange(setter, e) {
    const value = e.target.value;
    if (/^[A-Za-z\s]+$/.test(value)) {
      setter(value);
    }
  }
 
  async function handleAddStudent() {
    const studentData = {
      IdNumber,
      FirstName,
      LastName,
      MiddleName,
      Course,
      Year,
    };
 
    try {
      const response = await fetch("http://localhost:1337/AddStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });
 
      if (!response.ok) {
        throw new Error("Failed to add student. Please try again.");
      }
 
      const result = await response.json();
 
      if (result.success) {
        setIdNumber("");
        setFirstName("");
        setLastName("");
        setMiddleName("");
        setCourse("");
        setYear("");
        alert(result.message);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error adding student: ", error);
      alert("An error occurred. Please try again.");
    }
  }
 
  return (
    <div className='container'>
      <Sidebar />
      <div className='halu'>
        <h1>ADD STUDENT</h1>
        <TextField
          id="idNumber"
          label="ID Number"
          variant="outlined"
          margin="normal"
          value={IdNumber}
          onChange={handleIdNumberChange}
        />
        <TextField
          id="firstName"
          label="First Name"
          variant="outlined"
          margin="normal"
          value={FirstName}
          onChange={(e) => handleNameChange(setFirstName, e)}
        />
        <TextField
          id="lastName"
          label="Last Name"
          variant="outlined"
          margin="normal"
          value={LastName}
          onChange={(e) => handleNameChange(setLastName, e)}
        />
        <TextField
          id="middleName"
          label="Middle Name"
          variant="outlined"
          margin="normal"
          value={MiddleName}
          onChange={(e) => handleNameChange(setMiddleName, e)}
        />
        <TextField
          id="course"
          label="Course"
          variant="outlined"
          margin="normal"
          value={Course}
          onChange={(e) => setCourse(e.target.value.replace(/[^A-Za-z]/ig, ''))}
        />
        <TextField
          id="year"
          label="Year"
          variant="outlined"
          margin="normal"
          select
          value={Year}
          onChange={(e) => setYear(e.target.value)}
        >
          {[1, 2, 3, 4].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleAddStudent} disabled={isAddButtonDisabled}>
          Add Student
        </Button>
      </div>
    </div>
  );
}
 
export default AddStudent;