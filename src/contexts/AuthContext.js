import React from "react";
import { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  //Sign up hook
  function signup(email, password) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((currentUser) => {
        currentUser.user.sendEmailVerification();
        console.log("Email Varification Sent");
        alert("Email Verification sent");
      })
      .catch(alert);
  }

  //login hook
  function login(email, password) {
    console.log("Logged in");
    return auth.signInWithEmailAndPassword(email, password);
  }

  //logout hook
  function logout() {
    console.log("Logged out");
    return auth.signOut();
  }

  //resest password hook
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  //When the program starts get's current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  //To make hooks global
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
