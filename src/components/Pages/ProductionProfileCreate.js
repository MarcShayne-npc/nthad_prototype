import React from "react";
import { useState, useRef } from "react";
import { Grid, TextField } from "@mui/material";
import Header from "../Tools&Hooks/Header";
import { useAuth } from "../../contexts/AuthContext";
import Button from "@mui/material/Button";
import { db } from "../../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import AlertMessage from "../Tools&Hooks/AlertMessage";
import { useNavigate } from "react-router-dom";

export default function ProductionProfileCreate({ companyId }) {
  //Set AlertMessage Status and passes to Alertmessage hook
  const [status, setStatusBase] = useState("");
  //current user that is logged in
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  //All the references for the fields in Production
  const nameRef = useRef();
  const autoRef = useRef();
  const aboutRef = useRef();
  const [error, setError] = useState(false);

  //When user press submit button
  const handleEditUser = async () => {
    //Gets all the reference and add document to firestore
    try {
      //validation if name & short name has value
      if (nameRef.current.value !== "" && autoRef.current.value !== "") {
        setError(false);
        const productionRef = await addDoc(collection(db, "production"), {
          created: serverTimestamp(),
          name: nameRef.current.value,
          shortname: autoRef.current.value,
          hasposter: false,
          owners: [currentUser.uid],
          productioncompanyid: companyId,
          description: aboutRef.current.value,
        });
        await updateDoc(doc(db, "user", currentUser.uid), {
          productionsowned: arrayUnion(productionRef.id),
        });
        await updateDoc(doc(db, "productioncompany", companyId), {
          productions: arrayUnion(productionRef.id),
        });
        //set the Alert to Success and display message
        setStatusBase({
          lvl: "success",
          msg: "Production Company Created",
          key: Math.random(),
        });
        navigate("/producer-page");
      } else {
        //if user required fields are empty
        setError(true);
        setStatusBase({
          lvl: "error",
          msg: "Required fields are empty",
          key: Math.random(),
        });
      }
    } catch {
      //something went wrong
      setStatusBase({
        lvl: "error",
        msg: "Failed to Create Company.",
        key: Math.random(),
      });
    }
  };

  const handleBack = () => {
    navigate("/producer-page");
  };

  const handleAuto = (e) => {
    let x = e.target.value;
    console.log(x.length);
    if (x.length <= 15) {
      autoRef.current.value = e.target.value;
    }
  };
  return (
    <form>
      <Header />
      <Grid>
        {/*==================Avatar Picture Section==================*/}
        <Button onClick={handleBack}>Back</Button>
        {/*==================Account Information Section==================*/}
        <Grid
          container
          columnSpacing={1}
          rowSpacing={1}
          direction="row"
          justifyContent="center"
          alignItems="center"
          marginBottom={1}
        >
          <Grid item xs={11} sm={8} md={6}>
            <h2>Create Production for [{companyId}]</h2>
          </Grid>
        </Grid>
        {/*==================Name & short Name Section==================*/}
        <Grid
          container
          columnSpacing={1}
          rowSpacing={1}
          direction="row"
          justifyContent="center"
          alignItems="center"
          marginBottom={1}
        >
          <Grid item xs={11} sm={8} md={3}>
            Name:
            <TextField
              id="outlined-required"
              type="text"
              variant="outlined"
              inputRef={nameRef}
              onChange={handleAuto}
              error={error}
              required
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={11} sm={8} md={3}>
            Short name:
            <TextField
              inputProps={{ maxLength: 15 }}
              placeholder="This will be used throughout Nth AD"
              id="outlined-required"
              type="text"
              variant="outlined"
              inputRef={autoRef}
              onChange={handleAuto}
              error={error}
              required
              sx={{ width: "100%" }}
            />
          </Grid>
        </Grid>
        {/*==================About Section==================*/}
        <Grid
          container
          columnSpacing={1}
          rowSpacing={1}
          direction="row"
          justifyContent="center"
          alignItems="center"
          marginBottom={1}
        >
          <Grid item xs={11} sm={8} md={6} textAlign="center">
            <TextField
              label="About"
              type="text"
              variant="outlined"
              sx={{ width: 1 }}
              inputRef={aboutRef}
              multiline
              rows={2}
              rowsmax={4}
            />
          </Grid>
        </Grid>
        {/*==================Alert & Button Section==================*/}
        <Grid
          container
          columnSpacing={5}
          rowSpacing={5}
          direction="row"
          justifyContent="right"
          alignItems="center"
          marginBottom={1}
        >
          <Grid item xs={4}>
            <Button onClick={handleEditUser} variant="outlined">
              Create
            </Button>
            {status ? (
              <AlertMessage
                level={status.lvl}
                key={status.key}
                message={status.msg}
              />
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
