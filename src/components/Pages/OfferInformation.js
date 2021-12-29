import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  Dialog,
  Card,
  Avatar,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
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
  departmentId,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productionData, setProductionData] = useState({
    name: "",
  });
  const [companyData, setCompanyData] = useState({
    name: "",
  });
  const [departmentData, setDepartmentData] = useState({});
  const [positionData, setPositionData] = useState({});
  const [manager, setManager] = useState({});
  const [managerId, setManagerId] = useState("");
  const { currentUser } = useAuth();
  const [posHisTime, setPosHisTime] = useState("");
  const [posDetails, setPosDetails] = useState("");
  const [open, setOpen] = useState(false);
  const [userPositionId, setUserPositionId] = useState("");
  const reason = useRef("");
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
        console.log(departmentId);
        const departmentRef = doc(
          db,
          "production",
          productionId,
          "department",
          departmentId
        );
        await getDoc(departmentRef).then((res) => {
          setDepartmentData(res.data());
        });
        const posRef = doc(
          db,
          "production",
          productionId,
          "position",
          positionId
        );
        await getDoc(posRef).then((res) => {
          setPositionData(res.data());
        });
        const posHisRef = query(
          collection(
            db,
            "production",
            productionId,
            "position",
            positionId,
            "positionhistory"
          ),
          where("status", "==", "offered"),
          where("userid", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(posHisRef);
        querySnapshot.forEach((doc) => {
          setPosHisTime(
            doc
              .data()
              .date.toDate()
              .toLocaleString("en-US", { timeZone: "UTC" }) + " UTC+8"
          );
          setPosDetails(doc.data().positiondetails);
        });

        const userPos = query(
          collection(db, "user", currentUser.uid, "userposition"),
          where("positionid", "==", positionId)
        );
        const snap = await getDocs(userPos);
        let id = "";
        snap.forEach((res) => {
          id = res.id;
        });
        setUserPositionId(id);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        navigate("/position-offer");
      }
    };
    offerInfo();
  }, [
    companyId,
    currentUser.uid,
    departmentId,
    navigate,
    positionId,
    productionId,
  ]);
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
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDecline = async () => {
    const posRef = doc(db, "production", productionId, "position", positionId);
    const hisRef = collection(
      db,
      "production",
      productionId,
      "position",
      positionId,
      "positionhistory"
    );
    const userPosRef = doc(
      db,
      "user",
      currentUser.uid,
      "userposition",
      userPositionId
    );
    await updateDoc(posRef, {
      status: "declined",
      userid: "",
    });

    await addDoc(hisRef, {
      status: "declined",
      date: serverTimestamp(),
      updatedbyid: currentUser.uid,
      positiondetails: reason.current.value,
      userid: currentUser.uid,
    });
    await deleteDoc(userPosRef);

    navigate("/position-offer");
  };
  const handleAccept = async () => {
    const posRef = doc(db, "production", productionId, "position", positionId);
    const hisRef = collection(
      db,
      "production",
      productionId,
      "position",
      positionId,
      "positionhistory"
    );
    const userPosRef = doc(
      db,
      "user",
      currentUser.uid,
      "userposition",
      userPositionId
    );
    await updateDoc(posRef, {
      status: "active",
      userid: currentUser.uid,
    });

    await addDoc(hisRef, {
      status: "active",
      date: serverTimestamp(),
      updatedbyid: currentUser.uid,
      positiondetails: "",
      userid: currentUser.uid,
    });
    await updateDoc(userPosRef, { status: "active" });

    navigate("/position-offer");
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
          <Grid item xs={12} textAlign="center">
            <Typography variant="h5">
              Department: {departmentData.name}
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="h5">Position: {positionData.name}</Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="h5">Offered at: {posHisTime}</Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
                <Button onClick={handleAccept} variant="outlined">
                  Accept
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={handleClickOpen} variant="outlined">
                  Decline
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Decline</DialogTitle>
            <DialogContent>
              <DialogContentText>
                What is your reason for declining?
              </DialogContentText>
              <TextField
                autoFocus
                label="Reason(Optional)"
                fullWidth
                variant="standard"
                inputRef={reason}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDecline}>Decline Offer</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Dialog>
          <Grid item md={6} xs={12}>
            <TextField
              id="outlined-read-only-input"
              defaultValue={posDetails}
              label="Position Details"
              multiline
              rows={3}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      ) : (
        "loading..."
      )}
    </div>
  );
}
