import React from "react";
import { AuthProvider } from "../contexts/AuthContext";
import SignUp from "./SignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@material-ui/core";
import ProductionList from "./ProductionList";
import Login from "./LogIn";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import EditUser from "./EditUser";
import ProductionCompany from "./ProductionCompany";

function App() {
  return (
    <Container>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/" element={<PrivateRoute />}>
              <Route path="/production-list" element={<ProductionList />} />
              <Route exact path="/edit-profile" element={<EditUser />} />
              <Route
                exact
                path="/producer-page"
                element={<ProductionCompany />}
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </Container>
  );
}

export default App;
