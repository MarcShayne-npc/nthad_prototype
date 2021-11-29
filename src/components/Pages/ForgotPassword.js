import React from "react";
import { useRef, useState } from "react";
import { Box, Card, Grid, TextField, Button } from "@material-ui/core";
import { useAuth } from "../../contexts/AuthContext";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  //references and state
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //styling
  const cardStyle = {
    padding: 20,
    height: "450px",
    width: 280,
    margin: "120px auto",
  };

  //handles login function
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Email sent in your inbox");
    } catch {
      setError("Failed to reset password");
    }
    setLoading(false);
  }

  return (
    <Grid container>
      <Card elevation={10} align="center" variant="outlined" style={cardStyle}>
        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}
        <form onSubmit={handleSubmit}>
          <h1>Reset Password</h1>
          Have an account <Link to="/">Log in</Link>
          <Grid item>
            <TextField
              label="Email"
              type="email"
              inputRef={emailRef}
              required
              variant="outlined"
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
              Enter
            </Button>
          </Box>
        </form>
      </Card>
    </Grid>
  );
};
export default ForgotPassword;
