import React from "react";
import { AuthProvider } from "../contexts/AuthContext";
import SignUp from "./Pages/SignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@material-ui/core";
import ProductionList from "./Pages/ProductionList";
import Login from "./Pages/LogIn";
import PrivateRoute from "./Tools&Hooks/PrivateRoute";
import ForgotPassword from "./Pages/ForgotPassword";
import EditUser from "./Pages/EditUser";
import ProductionCompany from "./Pages/ProductionCompany";

function App() {
  return (
    <Container>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Login />} />
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
