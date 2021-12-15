import React from "react";
import { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Dashboard({
  productionId,
  positionId,
  setProductionId,
  setProductionCompany,
}) {
  const [productionData, setProductionData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getProduction = async () => {
      setLoading(true);
      try {
        //get production name
        const docRef = doc(db, "production", productionId);
        await getDoc(docRef).then((res) => {
          setProductionData({
            name: res.data().name,
            productionCompanyId: res.data().productioncompanyid,
          });
        });
      } catch {
        navigate("/production-list");
      }
      setLoading(false);
    };
    getProduction();
  }, [navigate, productionId]);

  const handleProductionView = () => {
    setProductionId(productionId);
    navigate("/production-profile-view");
  };

  const handleCrewPage = () => {
    setProductionId(productionId);
    setProductionCompany(productionData.productionCompanyId);
    navigate("/production-crew-list");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (e) => {
    setOpen(false);

    if (e.target.id === "Agree") {
      //Update db
      navigate("/production-list");
    }
  };

  return (
    <div>
      {!loading ? (
        <Grid container>
          <Button variant="outlined" onClick={handleClickOpen}>
            Quit
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Quit"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you would like to quit this production?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button id="Agree" onClick={handleClose} autoFocus>
                Agree
              </Button>
              <Button onClick={handleClose}>Disagree</Button>
            </DialogActions>
          </Dialog>
          <Grid item md={12} textAlign={"center"}>
            <Typography
              onClick={handleProductionView}
              style={{ cursor: "pointer" }}
              variant="h5"
            >
              {productionData.name}
            </Typography>
            <Typography>Dashboard Page</Typography>
            <Button onClick={handleCrewPage}>Crew Page</Button>
          </Grid>
          <>{positionId}</>
        </Grid>
      ) : (
        "loading..."
      )}
    </div>
  );
}
