const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose');
const User = require("./models/user.model")

// MongoDB connection
const connectDb = async () => {
  try {
      await mongoose.connect('mongodb://localhost:27017/mydatabase')
      console.log('Connected to the database!')
  } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      process.exit(1);
  }
}

// Set up CORS, bodyParser, and other middleware
app.use(cors());
app.use(bodyParser.json());
connectDb();


//add user
app.post("/adduser", async (req, res) => {
  const incomingData = req.body;

  try {
      const user = new User(incomingData);
      await user.save();
      res.json({ success: true, message: "User added successfully!" });
  } catch (error) {
      console.error("Error adding User:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//read users
app.get("/viewusers", async (req, res) => {
  try {
      const users = await User.find({});
      res.json(users);
  } catch (error) {
      console.error("Error reading student data:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//update user
app.post("/updateuser", async (req, res) => {
  const incomingData = req.body;

  try {
      const user = await User.findOne({ email: incomingData.email });
      if (!user) {
          res.json({ success: false, message: "User not found" });
      } else {
          Object.assign(user, incomingData);
          await user.save();
          res.json({ success: true, message: "User updated successfully!" });
      }
  } catch (error) {
      console.error("Error updating User:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add a new student
app.post("/AddStudent", (req, res) => {
  const studentData = req.body;

  let existingData = [];
  try {
    existingData = JSON.parse(fs.readFileSync("students.json"));
  } catch (error) {
    // File might not exist, or it might be empty
  }

  // Add new student data to the existing array
  existingData.push(studentData);

  // Write the updated data back to the file
  fs.writeFileSync("students.json", JSON.stringify(existingData, null, 2));

  // Update the state with the newly added user
  res.json({ success: true, message: "Student added Successfully!", newStudent: studentData });
});

// Route to view students
app.get("/viewStudents", (req, res) => {
  try {
    const studentData = JSON.parse(fs.readFileSync("students.json"));
    res.json(studentData);
  } catch (error) {
    console.error("Error reading student data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update student information
app.put("/students/:id", (req, res) => {
  const studentId = req.params.id;
  const updatedStudentData = req.body;

  try {
    let existingData = JSON.parse(fs.readFileSync("students.json"));

    // Find the index of the student with the given ID
    const index = existingData.findIndex(student => student.IdNumber === studentId);

    if (index !== -1) {
      // Update the student data at the found index
      existingData[index] = { ...existingData[index], ...updatedStudentData };

      // Write the updated data back to the file
      fs.writeFileSync("students.json", JSON.stringify(existingData, null, 2));

      res.json({ success: true, message: "Student updated successfully!" });
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    console.error("Error updating student data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update the student.json file
app.put("/updateStudentJson", (req, res) => {
  const updatedData = req.body;
  fs.writeFileSync("students.json", JSON.stringify(updatedData, null, 2));
  res.json({ success: true, message: "student.json updated successfully" });
});

// Start the Express server
const port = 1337;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.json({ message: "User not found" });
      }

      if (password !== user.password) {
          return res.json({ message: "Invalid password" });
      }

      res.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//MARK: AUTH
//login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.json({ message: "User not found" });
      }

      if (password !== user.password) {
          return res.json({ message: "Invalid password" });
      }

      res.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//signup
app.post("/signup", async (req, res) => {
  const incomingData = req.body;

  try {
      const user = new User(incomingData);
      await user.save();
      res.json({ success: true, message: "User signed up successfully!" });
  } catch (error) {
      console.error("Error adding User:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//MARK: MANAGE STUDENTS
//add student
app.post("/addstudentmongo", async (req, res) => {
  const incomingData = req.body;

  try {
      const user = new Student(incomingData);
      await user.save();
      res.json({ success: true, message: "Student added successfully!" });
  } catch (error) {
      console.error("Error adding User:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//read students
app.get("/viewstudentsmongo", async (req, res) => {
  try {
      const users = await Student.find({});
      res.json(users);
  } catch (error) {
      console.error("Error reading student data:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//update student
app.post("/updatestudentmongo", async (req, res) => {
  const incomingData = req.body;

  try {
      const user = await Student.findOne({ id: incomingData.id });
      if (!user) {
          res.json({ success: false, message: "Student not found" });
      } else {
          Object.assign(user, incomingData);
          await user.save();
          res.json({ success: true, message: "Student updated successfully!" });
      }
  } catch (error) {
      console.error("Error updating User:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

