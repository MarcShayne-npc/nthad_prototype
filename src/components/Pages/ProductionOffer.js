import React from "react";
import { useEffect, useState } from "react";
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

export default function ProductionOffer({ productionId, positionId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productionData, setProductionData] = useState({
    name: "",
    departmentName: "",
  });

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

        await getDoc(positionRef).then((res) => {
          setProductionData({
            name: res.data().name,
            departmentName: res.data().departmentname,
          });
        });
      } catch (err) {
        navigate("/producer-page");
      }
      setLoading(false);
    };
    getOffer();
  }, [navigate, positionId, productionId]);

  return (
    <div>
      <Grid container>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h4">{productionData.departmentName}</Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h5">{productionData.name}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}
