import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "./Header";
export default function PrivateRoute({
  productionId,
  component: Component,
  ...rest
}) {
  const { currentUser } = useAuth();

  return currentUser ? (
    <>
      <Header productionId={productionId} />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
}
