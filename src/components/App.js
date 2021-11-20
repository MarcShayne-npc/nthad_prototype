import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import SignUp from './SignUp';
import { BrowserRouter as Router, Routes , Route, Outlet } from 'react-router-dom'
import { Container } from '@material-ui/core';
import Dashboard from './Dashboard';
import Login from './LogIn';
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './ForgotPassword';
import EditUser from './EditUser';


function App() {
  
  function Messages () {
    return (
      <Container>
        <Dashboard />
        <EditUser />
        <Outlet />
      </Container>
    )
  }
  return (
    <AuthProvider>
    <Container>
      <Router>
          <Routes>
            <Route exact path="/" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />}/>
              <Route exact path ="/edit-profile" element={<EditUser />} />
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
