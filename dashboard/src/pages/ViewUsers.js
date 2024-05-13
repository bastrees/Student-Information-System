import React from "react";
import "./ViewUsers.css";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Modal,
  Box,
  Table,
  TableContainer,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
function ViewUsers() {
  const [dataList, setDataList] = useState([]);
  const [refreshDataList, setRefreshDataList] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [initialData, setInitialData] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    email: "",
    password: "",
  });

  const [currentData, setCurrentData] = useState(initialData);

  const openModal = (data, isEdit = false) => {
    setCurrentData(data);
    setIsEditMode(isEdit);
    setModalState(true);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const closeModal = () => {
    setModalState(false);
    setShowPassword(false);
  };

  const handleChange = (e) => {
    setCurrentData({
      ...currentData,
      [e.target.name || e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:1337/viewusers`)
      .then((response) => {
        setDataList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [refreshDataList]);

  const handleAddData = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:1337/adduser",
        currentData
      );

      const result = await response.data;

      if (result.success) {
        setRefreshDataList(!refreshDataList);
        setModalState(false);
      }
      alert(result.message);
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occured. Please try again.");
    }
  };

  const handleUpdateData = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:1337/updateuser",
        currentData
      );

      const result = response.data;

      if (result.success) {
        alert(result.message);
        setRefreshDataList(!refreshDataList);
        setModalState(false);
      } else {
        alert("Failed to update user. Please try again!.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occured. Please try again.");
    }
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="content">
        <h1>View Users</h1>

        <Button
          className="tablebutton"
          variant="contained"
          onClick={() => openModal(initialData, false)}
        >
          ADD USER
        </Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Middle Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>EDIT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataList.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>{user.firstname}</TableCell>
                  <TableCell>{user.lastname}</TableCell>
                  <TableCell>{user.middlename}</TableCell>
                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => openModal(user, true)}
                    >
                      EDIT
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal open={modalState} onClose={closeModal}>
          <Box className="modal">
            {/* it will only render the typography if not null */}
            {currentData && (
              <form
                className="modalform"
                onSubmit={isEditMode ? handleUpdateData : handleAddData}
              >
                <TextField
                  id="firstname"
                  required
                  label="first name"
                  variant="outlined"
                  value={currentData.firstname}
                  onChange={handleChange}
                />

                <TextField
                  id="lastname"
                  required
                  label="last name"
                  variant="outlined"
                  value={currentData.lastname}
                  onChange={handleChange}
                />

                <TextField
                  id="middlename"
                  required
                  label="middle name"
                  variant="outlined"
                  value={currentData.middlename}
                  onChange={handleChange}
                />

                <TextField
                  id="email"
                  required
                  disabled={isEditMode}
                  label="email"
                  variant="outlined"
                  value={currentData.email}
                  onChange={handleChange}
                />

                <TextField
                  id="password"
                  required
                  label="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={currentData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <div className="buttonsmodal">
                  <Button
                    className="formbutton"
                    variant="contained"
                    type="submit"
                  >
                    {isEditMode ? "UPDATE" : "ADD"}
                  </Button>
                </div>
              </form>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default ViewUsers;
