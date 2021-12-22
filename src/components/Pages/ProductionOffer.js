import React from "react";
import { useEffect, useState, useRef } from "react";
import { Button, Grid, Card, Typography } from "@mui/material";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import SvgIcon from "@mui/material/SvgIcon";

export default function ProductionOffer({
  productionId,
  positionId,
  setProductionId,
  setDepartmentId,
  setPositionId,
  setProductionCompany,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productionData, setProductionData] = useState({
    name: "",
    departmentName: "",
    departmentId: "",
  });
  const [company, setCompany] = useState("");
  const [statusLabel, setStatusLabel] = useState("");
  useEffect(() => {
    const getOffer = async () => {
      setLoading(true);
      try {
        const positionRef = doc(
          db,
          "production",
          productionId,
          "position",
          positionId
        );
        let status = "";
        await getDoc(positionRef).then((res) => {
          setProductionData({
            name: res.data().name,
            departmentName: res.data().departmentname,
            departmentId: res.data().departmentid,
          });
          status = res.data().status;
        });
        if (status.includes("created")) {
          setStatusLabel("Unfilled");
        }
        if (status.includes("offered")) {
          setStatusLabel("Offered");
        }
        if (status.includes("active")) {
          setStatusLabel("Filled");
        }
        if (status.includes("declined")) {
          setStatusLabel("Offer Declined");
        }
        if (status.includes("retracted")) {
          setStatusLabel("Offer Retracted");
        }
        if (status.includes("terminated")) {
          setStatusLabel("Terminated");
        }
        if (status.includes("quit")) {
          setStatusLabel("Quit");
        }
        if (status.includes("completed")) {
          setStatusLabel("Complete");
        }
        if (status.includes("removed")) {
          setStatusLabel("Removed");
        }
        const productionRef = doc(db, "production", productionId);
        await getDoc(productionRef).then((res) => {
          setCompany(res.data().productioncompanyid);
        });
      } catch (err) {
        navigate("/producer-page");
      }
      setLoading(false);
    };
    getOffer();
  }, [navigate, positionId, productionId]);

  const handleDepartment = () => {
    setDepartmentId(productionData.departmentId);
    setProductionId(productionId);
    navigate("/edit-department");
  };

  const handlePosition = () => {
    console.log(company);
    setProductionId(productionId);
    setPositionId(positionId);
    setProductionCompany(company);
    navigate("/position-edit");
  };
  return (
    <div>
      {!loading ? (
        <Grid container>
          <Grid item xs={12} textAlign="center">
            <Typography
              onClick={handleDepartment}
              style={{ cursor: "pointer" }}
              variant="h4"
            >
              {productionData.departmentName}
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography
              onClick={handlePosition}
              style={{ cursor: "pointer" }}
              variant="h5"
            >
              {productionData.name}
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography onClick={handlePosition} variant="h5">
              {statusLabel}
            </Typography>
          </Grid>
        </Grid>
      ) : (
        "loading..."
      )}
    </div>
  );
}
