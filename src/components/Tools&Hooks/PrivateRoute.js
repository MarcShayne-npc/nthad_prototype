import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "./Header";
export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  return currentUser ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
}
