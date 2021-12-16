import React from "react";
import { useEffect, useState, useRef } from "react";
import { Button, Grid } from "@mui/material";
import {
  doc,
  getDoc,
  updateDoc,
  query,
  collection,
  where,
  deleteDoc,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard({
  productionId,
  positionId,
  setProductionId,
  setProductionCompany,
}) {
  const { currentUser } = useAuth();
  const [productionData, setProductionData] = useState({
    name: "",
  });
  const [position, setPositionData] = useState();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const reasonRef = useRef();
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
        const posRef = doc(
          db,
          "production",
          productionId,
          "position",
          positionId
        );
        await getDoc(posRef).then((res) => {
          setPositionData(res.data().name);
        });
      } catch {
        navigate("/production-list");
      }
      setLoading(false);
    };
    getProduction();
  }, [navigate, positionId, productionId]);

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
    const updateDocs = async () => {
      if (e.target.id === "Agree") {
        // position history
        const posHisRef = collection(
          db,
          "production",
          productionId,
          "position",
          positionId,
          "positionhistory"
        );

        await addDoc(posHisRef, {
          status: "quit",
          date: serverTimestamp(),
          updatedbyid: currentUser.uid,
          positiondetails: reasonRef.current.value,
          userid: "",
        });
        // deletes position document in userposition
        const userPosRef = query(
          collection(db, "user", currentUser.uid, "userposition"),
          where("positionid", "==", positionId)
        );
        console.log(positionId);
        let id = "";
        const querySnap = await getDocs(userPosRef);
        querySnap.forEach((doc) => {
          id = doc.id;
        });
        await deleteDoc(doc(db, "user", currentUser.uid, "userposition", id));

        //update position
        const posRef = doc(
          db,
          "production",
          productionId,
          "position",
          positionId
        );
        await updateDoc(posRef, { status: "quit", userid: "" });

        navigate("/production-list");
      }
    };
    updateDocs();
  };

  return (
    <div>
      {!loading ? (
        <Grid container>
          <Grid item xs={12} textAlign={"center"}>
            <Typography
              onClick={handleProductionView}
              style={{ cursor: "pointer" }}
              variant="h5"
            >
              {productionData.name}
            </Typography>
            <Typography>{position}</Typography>
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
                <TextField
                  autoFocus
                  inputRef={reasonRef}
                  margin="dense"
                  label="Reason for quiting(optional)"
                  type="text"
                  fullWidth
                  variant="standard"
                />
              </DialogContent>
              <DialogActions>
                <Button id="Agree" onClick={handleClose} autoFocus>
                  Quit Position
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
            <Button onClick={handleCrewPage}>Crew Page</Button>
          </Grid>
        </Grid>
      ) : (
        "loading..."
      )}
    </div>
  );
}
