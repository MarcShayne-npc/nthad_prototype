import React from "react";
import { useRef, useState } from "react";
import { Box, Card, Grid, TextField, Button } from "@material-ui/core";
import { useAuth } from "../../contexts/AuthContext";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  //references and state
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //styling
  const cardStyle = {
    padding: 20,
    height: "450px",
    width: 280,
    margin: "120px auto",
  };

  //handles signup function
  async function handleSubmit(e) {
    e.preventDefault();
    //check's if the both password are the same
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError(
        "Password do not match or needs to be 6 characters or more"
      );
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/edit-profile");
    } catch {
      setError("Failed to create account");
    }
    setLoading(false);
  }

  return (
    <Grid container>
      <Card elevation={10} align="center" variant="outlined" style={cardStyle}>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          already have an account? <Link to="/">Log In</Link>
          <Grid item>
            <TextField
              label="Email"
              type="email"
              inputRef={emailRef}
              required
              variant="outlined"
              style={{ marginTop: "8px", marginBottom: "8px" }}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              inputRef={passwordRef}
              required
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Password Confirmation"
              type="password"
              inputRef={passwordConfirmRef}
              required
              variant="outlined"
              style={{ marginTop: "8px", marginBottom: "8px" }}
              fullWidth
            />
          </Grid>
          <Box m={2}>
            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              SignUp
            </Button>
          </Box>
        </form>
      </Card>
    </Grid>
  );
};
export default SignUp;
