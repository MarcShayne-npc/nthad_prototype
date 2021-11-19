import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import SignUp from './SignUp';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom'
import { Container } from '@material-ui/core';
import Dashboard from './Dashboard';
import Login from './LogIn';
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './ForgotPassword';

function App() {
  return (
    <Container>
      <Router>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={<PrivateRoute />}>
              <Route exact path='/' element={<Dashboard />}/>
            </Route>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
          </Routes>
        </AuthProvider>
      </Router>
    </Container>
  )}

export default App;
