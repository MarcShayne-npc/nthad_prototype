import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  Button,
  Grid,
  Box,
  Typography,
  TextField,
  Autocomplete,
  Card,
  Avatar,
} from "@mui/material";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
  addDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AlertMessage from "../Tools&Hooks/AlertMessage";

export default function OfferInformation({
  companyId,
  productionId,
  positionId,
  setProductionCompany,
  setProductionId,
  setUserId,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productionData, setProductionData] = useState({
    name: "",
  });
  const [companyData, setCompanyData] = useState({
    name: "",
  });
  const [manager, setManager] = useState({});
  const [managerId, setManagerId] = useState("");
  useEffect(() => {
    const offerInfo = async () => {
      setLoading(true);
      try {
        const productionRef = doc(db, "production", productionId);

        await getDoc(productionRef).then((res) => {
          setProductionData({ name: res.data().name });
          setManagerId(res.data().owners[0]);
          const managerRef = doc(db, "user", res.data().owners[0]);
          getDoc(managerRef).then((res) => {
            setManager(res.data());
          });
        });
        const companyRef = doc(db, "productioncompany", companyId);
        await getDoc(companyRef).then((res) => {
          setCompanyData({
            name: res.data().name,
          });
        });

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        navigate("/position-offer");
      }
    };
    offerInfo();
  }, [companyId, navigate, productionId]);
  const handleProduction = () => {
    setProductionCompany(companyId);
    setProductionId(productionId);
    navigate("/production-profile-view");
  };
  const handleCompany = () => {
    setProductionCompany(companyId);
    navigate("/production-company-profile");
  };
  const handleUser = () => {
    setUserId(managerId);
    navigate("/user-profile");
  };
  return (
    <div>
      {!loading ? (
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          <Grid item xs={12} textAlign="center">
            <Typography
              onClick={handleProduction}
              style={{ cursor: "pointer" }}
              variant="h4"
            >
              {productionData.name}
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography
              onClick={handleCompany}
              style={{ cursor: "pointer" }}
              variant="h5"
            >
              {companyData.name}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Card
              variant="outlined"
              onClick={handleUser}
              style={{ cursor: "pointer", padding: "1px" }}
            >
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <Avatar
                    sx={{ height: "50px", width: "50px" }}
                    src={manager.avatarurl}
                    alt="ProfilePic"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h5">{manager.displayname}</Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      ) : (
        "loading..."
      )}
    </div>
  );
}
