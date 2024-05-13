import { useEffect, useState } from "react";
import "./ViewStudent.css";
import Sidebar from "./Sidebar";
import axios from "axios";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Modal, Box, Typography, TextField, MenuItem } from "@mui/material";
 
function ViewStudents() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
 
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [Students, setStudents] = useState([]);
  const [editedStudent, setEditedStudent] = useState({
    IdNumber: "",
    FirstName: "",
    LastName: "",
    MiddleName: "",
    Course: "",
    Year: ""
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
 
  useEffect(() => {
    axios
      .get(`http://localhost:1337/viewStudents`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  }, []);
 
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditedStudent({
      IdNumber: student.IdNumber,
      FirstName: student.FirstName,
      LastName: student.LastName,
      MiddleName: student.MiddleName,
      Course: student.Course,
      Year: student.Year
    });
    handleOpen();
  };
 
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    // Validating fields for first name, last name, middle name, and course
    if (name === "FirstName" || name === "LastName" || name === "MiddleName" || name === "Course") {
      if (/^[A-Za-z\s]+$/.test(value)) {
        setEditedStudent(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    } else {
      setEditedStudent(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
 
  const handleSave = () => {
    const { IdNumber, ...updatedData } = editedStudent;
 
    const index = Students.findIndex(student => student.IdNumber === selectedStudent.IdNumber);
 
    if (index !== -1) {
      const updatedStudents = [...Students];
      updatedStudents[index] = { ...selectedStudent, ...updatedData };
 
      setStudents(updatedStudents);
 
      axios.put(`http://localhost:1337/students/${selectedStudent.IdNumber}`, updatedStudents)
          .then(response => {
              console.log("Student data updated successfully:", response.data);
              axios.put(`http://localhost:1337/updateStudentJson`, updatedStudents)
                  .then(response => {
                      console.log("student.json updated successfully");
                  })
                  .catch(error => {
                      console.error("Error updating student.json:", error);
                  });
          })
          .catch(error => {
              console.error("Error updating student data:", error);
          });
    }
 
    handleClose();
  };
 
  const isSaveDisabled = !editedStudent.FirstName || !editedStudent.LastName || !editedStudent.MiddleName || !editedStudent.Course || !editedStudent.Year;
 
  return (
    <>
      <div className="container">
        <Sidebar />
        <div className="halu">
          <h1>View Student</h1>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Student ID</TableCell>
                  <TableCell align="right">First Name</TableCell>
                  <TableCell align="right">Last Name</TableCell>
                  <TableCell align="right">Middle Name</TableCell>
                  <TableCell align="right">Course</TableCell>
                  <TableCell align="right">Year</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Students.map((student) => (
                  <TableRow
                    key={student.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="right">{student.IdNumber}</TableCell>
                    <TableCell align="right">{student.FirstName}</TableCell>
                    <TableCell align="right">{student.LastName}</TableCell>
                    <TableCell align="right">{student.MiddleName}</TableCell>
                    <TableCell align="right">{student.Course}</TableCell>
                    <TableCell align="right">{student.Year}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleEdit(student)}>EDIT</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
 
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h4" component="h2">
                Edit Student Information
              </Typography>
              <TextField
                label="Student ID"
                name="IdNumber"
                value={selectedStudent ? selectedStudent.IdNumber : ''}
                disabled
                InputProps={{
                  style: { color: 'black', fontWeight: 'bold' },
                  readOnly: true,
                }}
                fullWidth
                margin="normal"
              />
              <TextField
                label="First Name"
                name="FirstName"
                value={editedStudent.FirstName}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                name="LastName"
                value={editedStudent.LastName}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Middle Name"
                name="MiddleName"
                value={editedStudent.MiddleName}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Course"
                name="Course"
                value={editedStudent.Course}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
              <TextField
                select
                label="Year"
                name="Year"
                value={editedStudent.Year}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              >
                {[1, 2, 3, 4].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                onClick={handleSave}
                style={{ backgroundColor: '#4caf50', color: 'white', marginRight: '10px' }}
                disabled={isSaveDisabled}
              >
                Save
              </Button>
              <Button
                variant="contained"
                onClick={handleClose}
                style={{ backgroundColor: '#f44336', color: 'white' }}
              >
                Cancel
              </Button>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
}
 
export default ViewStudents;