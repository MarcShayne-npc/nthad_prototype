import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import SignUp from './SignUp';
import { BrowserRouter as Router, Routes , Route, Outlet } from 'react-router-dom'
import { Container } from '@material-ui/core';
import ProductionList from './ProductionList';
import Login from './LogIn';
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './ForgotPassword';
import EditUser from './EditUser';
import ProductionCompany from './ProductionCompany';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../firebase'
import { useState, useEffect } from 'react';

function App() {

  

  return (
    <AuthProvider>
    <Container>
      <Router>
          <Routes>
            <Route exact path="/" element={<PrivateRoute />}>
              <Route path="/production-list" element={<ProductionList />}/>
              <Route exact path ="/edit-profile" element={<EditUser />} />
              <Route exact path ="/producer-page" element={<ProductionCompany />} />
            </Route>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
          </Routes>
      </Router>
    </Container>
        </AuthProvider>
  )}

export default App;
