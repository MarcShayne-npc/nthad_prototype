import React from "react";
import { useState } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import SignUp from "./Pages/SignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@material-ui/core";
import ProductionList from "./Pages/ProductionList";
import Login from "./Pages/LogIn";
import PrivateRoute from "./Tools&Hooks/PrivateRoute";
import ForgotPassword from "./Pages/ForgotPassword";
import EditUser from "./Pages/EditUser";
import ProducerPage from "./Pages/ProducerPage";
import UserProfile from "./Pages/UserProfile";
import ProductionCompanyProfileCreate from "./Pages/ProductionCompanyProfileCreate";
import ProductionCompanyProfileEdit from "./Pages/ProductionCompanyProfileEdit";
import ProductionProfileCreate from "./Pages/ProductionProfileCreate";
import ProductionCompanyDashboard from "./Pages/ProductionCompanyDashboard";

function App() {
  //this is so that I can pass data between components
  const [productionCompany, setProductionCompany] = useState("");

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
              <Route path="/edit-profile" element={<EditUser />} />
              <Route
                path="/producer-page"
                element={
                  <ProducerPage setProductionCompany={setProductionCompany} />
                }
              />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route
                path="/production-company-profile-create"
                element={<ProductionCompanyProfileCreate />}
              />
              <Route
                path="/production-company-profile-edit"
                exact
                element={
                  <ProductionCompanyProfileEdit companyId={productionCompany} />
                }
              />
              <Route
                path="/Production-profile-create"
                exact
                element={
                  <ProductionProfileCreate companyId={productionCompany} />
                }
              />
              <Route
                path="/Production-company-dashboard"
                exact
                element={
                  <ProductionCompanyDashboard companyId={productionCompany} />
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </Container>
  );
}

export default App;
