import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  Button,
  Grid,
  Box,
  Typography,
  TextField,
  Autocomplete,
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
  const [positionData, setPositionData] = useState({
    name: "",
    departmentName: "",
    departmentId: "",
  });
  const [company, setCompany] = useState("");
  const [statusLabel, setStatusLabel] = useState("");
  const [offerBtn, setOfferBtn] = useState(false);
  const [removeBtn, setRemoveBtn] = useState(false);
  const [terminateBtn, setTerminateBtn] = useState(false);
  const [completeBtn, setCompleteBtn] = useState(false);
  const [retractBtn, setRetractBtn] = useState(false);
  const [userSearch, setUserSearch] = useState([]);
  const [userValue, setUserValue] = useState(null);
  const { currentUser } = useAuth();
  const details = useRef();
  const [companyData, setCompanyData] = useState({
    id: "",
    name: "",
  });
  const [productionData, setProductionData] = useState({
    name: "",
  });
  const [status, setStatusBase] = useState("");

  //id is document id of user/userposition
  //userId is document id of user in the position
  const [userPositionId, setUserPositionId] = useState({
    id: "",
    userId: "",
  });
  const [isHead, setIsHead] = useState(false);

  useEffect(() => {
    const getOffer = async () => {
      setLoading(true);
      try {
        let companyId = "";
        const productionRef = doc(db, "production", productionId);
        await getDoc(productionRef).then((res) => {
          setProductionData({ name: res.data().name });

          setCompany(res.data().productioncompanyid);
          companyId = res.data().productioncompanyid;
        });

        const companyRef = doc(db, "productioncompany", companyId);
        await getDoc(companyRef).then((res) => {
          setCompanyData({
            name: res.data().name,
            id: res.id,
          });
        });
        const userRef = collection(db, "user");
        const querySnapshot = await getDocs(userRef);
        let arr = [];

        querySnapshot.forEach((user) => {
          arr.push({
            id: user.id,
            displayName: user.data().displayname,
            Avatar: user.data().avatarurl,
          });
        });
        setUserSearch(arr);

        const positionRef = doc(
          db,
          "production",
          productionId,
          "position",
          positionId
        );
        let status = "";
        let userId = "";
        await getDoc(positionRef).then((res) => {
          setPositionData({
            name: res.data().name,
            departmentName: res.data().departmentname,
            departmentId: res.data().departmentid,
          });
          setIsHead(res.data().isdepartmenthead);
          userId = res.data().userid;
          status = res.data().status;
        });
        if (userId !== "") {
          const posHis = query(
            collection(db, "user", userId, "userposition"),
            where("positionid", "==", positionId)
          );
          const snap = await getDocs(posHis);
          let id = "";
          snap.forEach((res) => {
            id = res.id;
            console.log(res.id);
          });
          setUserPositionId({
            id: id,
            userId: userId,
          });
        }

        if (status.includes("created")) {
          setStatusLabel("Unfilled");
          setOfferBtn(true);
          setRemoveBtn(true);
        }
        if (status.includes("offered")) {
          setStatusLabel("Offered");
          setRetractBtn(true);
        }
        if (status.includes("active")) {
          setStatusLabel("Filled");
          setTerminateBtn(true);
          setCompleteBtn(true);
        }
        if (status.includes("declined")) {
          setStatusLabel("Offer Declined");
          setOfferBtn(true);
          setRemoveBtn(true);
          setCompleteBtn(true);
        }
        if (status.includes("retracted")) {
          setStatusLabel("Offer Retracted");
          setOfferBtn(true);
          setRemoveBtn(true);
          setCompleteBtn(true);
        }
        if (status.includes("terminated")) {
          setStatusLabel("Terminated");
          setOfferBtn(true);
          setCompleteBtn(true);
        }
        if (status.includes("quit")) {
          setStatusLabel("Quit");
          setOfferBtn(true);
          setCompleteBtn(true);
        }
        if (status.includes("completed")) {
          setStatusLabel("Complete");
        }
        if (status.includes("removed")) {
          setStatusLabel("Removed");
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        navigate("/production-crew-list");
      }
    };
    getOffer();
  }, [navigate, positionId, productionId]);

  const handleDepartment = () => {
    setDepartmentId(positionData.departmentId);
    setProductionId(productionId);
    navigate("/edit-department");
  };

  const handlePosition = () => {
    console.log(positionId);
    console.log(productionId);
    console.log(company);
    setProductionId(productionId);
    setPositionId(positionId);
    setProductionCompany(company);
    navigate("/position-edit");
  };

  const handleOffer = async () => {
    const posRef = doc(db, "production", productionId, "position", positionId);
    const hisRef = collection(
      db,
      "production",
      productionId,
      "position",
      positionId,
      "positionhistory"
    );
    const userPosRef = collection(db, "user", userValue.id, "userposition");
    await updateDoc(posRef, {
      status: "offered",
      userid: userValue.id,
    });
    await addDoc(hisRef, {
      status: "offered",
      date: serverTimestamp(),
      updatedbyid: currentUser.uid,
      positiondetails: details.current.value,
      userid: userValue.id,
    });
    await addDoc(userPosRef, {
      status: "offered",
      productioncompanyid: companyData.id,
      productioncompanyname: companyData.name,
      productionid: productionId,
      positionid: positionId,
      productionname: productionData.name,
      departmentname: positionData.departmentName,
      departmentid: positionData.departmentId,
      positionname: positionData.name,
      positiondetails: details.current.value,
      date: serverTimestamp(),
    });
    navigate("/production-crew-list");
  };

  const hanldeRetract = async () => {
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
      userPositionId.userId,
      "userposition",
      userPositionId.id
    );
    await updateDoc(posRef, {
      status: "retracted",
      userid: "",
    });

    await addDoc(hisRef, {
      status: "retracted",
      date: serverTimestamp(),
      updatedbyid: currentUser.uid,
      positiondetails: "",
      userid: userPositionId.userId,
    });

    await deleteDoc(userPosRef);
    navigate("/production-crew-list");
  };

  const handleRemoved = async () => {
    const posRef = doc(db, "production", productionId, "position", positionId);
    const hisRef = collection(
      db,
      "production",
      productionId,
      "position",
      positionId,
      "positionhistory"
    );
    await updateDoc(posRef, {
      status: "removed",
      userid: "",
    });

    await addDoc(hisRef, {
      status: "removed",
      date: serverTimestamp(),
      updatedbyid: currentUser.uid,
      positiondetails: "",
      userid: userPositionId.userId,
    });

    navigate("/production-crew-list");
  };

  const handleTerminated = async () => {
    if (isHead !== true) {
      const posRef = doc(
        db,
        "production",
        productionId,
        "position",
        positionId
      );
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
        userPositionId.userId,
        "userposition",
        userPositionId.id
      );
      await updateDoc(posRef, {
        status: "terminated",
        userid: "",
      });

      await addDoc(hisRef, {
        status: "terminated",
        date: serverTimestamp(),
        updatedbyid: currentUser.uid,
        positiondetails: "",
        userid: userPositionId.userId,
      });
      await deleteDoc(userPosRef);

      navigate("/production-crew-list");
    } else {
      setStatusBase({
        lvl: "error",
        msg: "Must change department head before removing this position",
        key: Math.random(),
      });
    }
  };

  const handleComplete = async () => {
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
      userPositionId.userId,
      "userposition",
      userPositionId.id
    );
    await updateDoc(posRef, {
      status: "completed",
      userid: "",
    });

    await addDoc(hisRef, {
      status: "completed",
      date: serverTimestamp(),
      updatedbyid: currentUser.uid,
      positiondetails: "",
      userid: userPositionId.userId,
    });
    await deleteDoc(userPosRef);

    navigate("/production-crew-list");
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
          {status ? (
            <AlertMessage
              level={status.lvl}
              key={status.key}
              message={status.msg}
            />
          ) : null}
          <Grid item xs={12} textAlign="center">
            <Typography
              onClick={handleDepartment}
              style={{ cursor: "pointer" }}
              variant="h4"
            >
              {positionData.departmentName}
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography
              onClick={handlePosition}
              style={{ cursor: "pointer" }}
              variant="h5"
            >
              {positionData.name}
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography onClick={handlePosition} variant="h5">
              {statusLabel}
            </Typography>
          </Grid>
          <Grid item xs={5} md={2} textAlign="center" sx={{ mb: 1 }}>
            <Button variant="outlined">Position History </Button>
          </Grid>
          <Grid
            container
            direction="row"
            marginBottom={1}
            justifyContent="center"
          >
            {offerBtn ? (
              <Grid item xs={5} md={2} textAlign="center">
                <Button
                  disabled={!userValue}
                  onClick={handleOffer}
                  variant="outlined"
                >
                  Make Offer
                </Button>
              </Grid>
            ) : (
              <></>
            )}
            {removeBtn ? (
              <Grid item xs={5} md={2} textAlign="center">
                <Button onClick={handleRemoved} variant="outlined">
                  Remove
                </Button>
              </Grid>
            ) : (
              <></>
            )}
            {terminateBtn ? (
              <Grid item xs={5} md={2} textAlign="center">
                <Button onClick={handleTerminated} variant="outlined">
                  Terminated
                </Button>
              </Grid>
            ) : (
              <></>
            )}
            {completeBtn ? (
              <Grid item xs={5} md={2} textAlign="center">
                <Button onClick={handleComplete} variant="outlined">
                  Complete
                </Button>
              </Grid>
            ) : (
              <></>
            )}
            {retractBtn ? (
              <Grid item xs={5} md={2} textAlign="center">
                <Button onClick={hanldeRetract} variant="outlined">
                  Retract Offer
                </Button>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
          {offerBtn ? (
            <>
              <Grid item>
                <Autocomplete
                  sx={{ width: 300 }}
                  options={userSearch}
                  onChange={(event, value) => setUserValue(value)}
                  autoHighlight
                  getOptionLabel={(option) => option.displayName}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...props}
                    >
                      <img
                        loading="lazy"
                        width="20"
                        src={option.Avatar}
                        srcSet={`${option.Avatar} 2x`}
                        alt=""
                      />
                      {option.displayName}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Choose a user:"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <TextField
                  sx={{ width: 300 }}
                  label="Additional Information:"
                  multiline={true}
                  rows={2}
                  inputRef={details}
                />
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>
      ) : (
        "loading..."
      )}
    </div>
  );
}
