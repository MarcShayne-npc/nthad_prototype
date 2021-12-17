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
import ProductionCompanyProfileView from "./Pages/ProductionCompanyProfileView";
import ProductionDashboard from "./Pages/ProductionDashboard";
import ProductionProfileEdit from "./Pages/ProductionProfileEdit";
import ProductionProfileView from "./Pages/ProductionProfileView";
import ProductionCrewList from "./Pages/ProductionCrewList";
import CreateDepartment from "./Pages/CreateDepartment";
import ProductionOffer from "./Pages/ProductionOffer";
import CreatePosition from "./Pages/CreatePosition";
import EditDepartment from "./Pages/EditDepartment";
import Dashboard from "./Pages/Dashboard";
import PositionHistory from "./Pages/PositionHistory";
import PositionEdit from "./Pages/PositionEdit";

function App() {
  //this is so that I can pass data between components
  const [productionCompany, setProductionCompany] = useState("");
  const [productionId, setProductionId] = useState("");
  const [userId, setUserId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  return (
    <Container>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/" element={<PrivateRoute />}>
              <Route
                path="/production-list"
                exact
                element={
                  <ProductionList
                    setPositionId={setPositionId}
                    setProductionId={setProductionId}
                  />
                }
              />
              <Route path="/edit-profile" element={<EditUser />} />
              <Route
                path="/producer-page"
                element={
                  <ProducerPage
                    setProductionCompany={setProductionCompany}
                    setProductionId={setProductionId}
                  />
                }
              />
              <Route
                path="/user-profile"
                element={<UserProfile userId={userId} />}
              />
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
                path="/production-profile-create"
                exact
                element={
                  <ProductionProfileCreate companyId={productionCompany} />
                }
              />
              <Route
                path="/production-company-dashboard"
                exact
                element={
                  <ProductionCompanyDashboard
                    companyId={productionCompany}
                    setProductionCompany={setProductionCompany}
                    setProductionId={setProductionId}
                  />
                }
              />
              <Route
                path="/production-company-profile"
                exact
                element={
                  <ProductionCompanyProfileView companyId={productionCompany} />
                }
              />
              <Route
                path="/production-dashboard"
                exact
                element={
                  <ProductionDashboard
                    productionId={productionId}
                    setProductionId={setProductionId}
                    setProductionCompany={setProductionCompany}
                  />
                }
              />
              <Route
                path="/production-profile-edit"
                exact
                element={
                  <ProductionProfileEdit
                    productionId={productionId}
                    companyId={productionCompany}
                  />
                }
              />
              <Route
                path="/production-profile-view"
                exact
                element={
                  <ProductionProfileView
                    productionId={productionId}
                    companyId={productionCompany}
                    setUserId={setUserId}
                    setProductionCompany={setProductionCompany}
                  />
                }
              />
              <Route
                path="/production-crew-list"
                exact
                element={
                  <ProductionCrewList
                    productionId={productionId}
                    companyId={productionCompany}
                    setProductionId={setProductionId}
                    setProductionCompany={setProductionCompany}
                    setDepartmentId={setDepartmentId}
                  />
                }
              />
              <Route
                path="/department-create"
                exact
                element={
                  <CreateDepartment
                    productionId={productionId}
                    companyId={productionCompany}
                  />
                }
              />
              <Route path="/production-offer" element={<ProductionOffer />} />
              <Route
                path="/position-create"
                element={
                  <CreatePosition
                    productionId={productionId}
                    companyId={productionCompany}
                    departmentId={departmentId}
                  />
                }
              />
              <Route
                path="/edit-department"
                element={
                  <EditDepartment
                    productionId={productionId}
                    departmentId={departmentId}
                  />
                }
              />
              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    positionId={positionId}
                    productionId={productionId}
                    setProductionId={setProductionId}
                    setProductionCompany={setProductionCompany}
                  />
                }
              />
              <Route path="/position-history" element={<PositionHistory />} />
              <Route
                path="/position-edit"
                element={
                  <PositionEdit
                    productionId={productionId}
                    companyId={productionCompany}
                    positionId={departmentId}
                  />
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
