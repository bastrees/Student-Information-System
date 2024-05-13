import {
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { React, useState, useEffect } from "react";
import axios from "axios";
import "./Login.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Login() {
  //MARK: LOGIC
  const initialData = {
    email: "",
    password: "",
  };
  const [user, setUser] = useState(initialData);

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:1337/login", user);

      const result = response.data;

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(user));
        console.log(user);
        navigate("/dashboard");
      }
      alert(result.message);
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occured. Please try again.");
    }
  };

  const handleRedirectToSignUp = async (e) => {
    e.preventDefault();

    navigate("/signup");
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name || e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    const authenticateUser = async () => {
      const storedCreds = JSON.parse(localStorage.getItem("user"));

      if (user) {
        try {
          const response = await axios.post(
            "http://localhost:1337/login",
            storedCreds
          );

          const result = response.data;

          if (result.success) {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error authenticating:", error);
          alert("An error occured. Please try again.");
        }
      }
    };

    authenticateUser();
  }, []);
  //MARK: FRONT
  return (
    <div className="logincontent">
      <Card className="logincard">
        <CardContent className="logincardcontent">
          <Typography variant="h5">WELCOME BACK</Typography>

          <form className="loginform" onSubmit={handleLogin}>
            <TextField
              id="email"
              className="email"
              required
              label="Email"
              variant="outlined"
              value={user.email}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              id="password"
              className="password"
              type={showPassword ? "text" : "password"}
              required
              label="Password"
              variant="outlined"
              value={user.password}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
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

            <div className="buttongroup">
              <Button variant="contained" type="submit">
                SIGN IN
              </Button>

              <Button variant="contained" onClick={handleRedirectToSignUp}>
                REGISTER
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
