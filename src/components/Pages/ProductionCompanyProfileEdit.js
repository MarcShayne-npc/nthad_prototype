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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function ProductionCompanyProfileEdit() {
  //Set AlertMessage Status and passes to Alertmessage hook
  const [status, setStatusBase] = useState("");
  //Do Api Call first and get promises doc from firestore
  //Then load page
  const [loading, setLoading] = useState(false);

  //current user that is logged in
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const nameRef = useRef();
  const [searchable, setSearchable] = useState(true);
  const emailRef = useRef();
  const webRef = useRef();
  const aboutRef = useRef();
  const codeRef = useRef();
  const phoneRef = useRef();
  const countryRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const streetRef = useRef();
  const street2Ref = useRef();
  const [error, setError] = useState(false);
  //When user press submit button
  const handleEditUser = async () => {
    //regex this is used later to detech letter or space only
    //const re = /^[a-zA-Z\s]*$/;

    try {
      if (nameRef.current.value !== "" && emailRef.current.value !== "") {
        setError(false);
        const productionCompanyRef = await addDoc(
          collection(db, "productioncompany"),
          {
            created: serverTimestamp(),
            updated: serverTimestamp(),
            updatedby: currentUser.uid,
            owners: [currentUser.uid],
            name: nameRef.current.value,
            searchable: searchable,
            email: emailRef.current.value,
            webpage: webRef.current.value,
            haslogo: false,
            phone: {
              countrycode: codeRef.current.value,
              number: phoneRef.current.value,
            },
            address: {
              street: streetRef.current.value,
              street2: street2Ref.current.value,
              city: cityRef.current.value,
              state: stateRef.current.value,
              country: countryRef.current.value,
            },
            about: aboutRef.current.value,
            productions: [""],
          }
        );
        await updateDoc(doc(db, "user", currentUser.uid), {
          productioncompaniesowned: arrayUnion(productionCompanyRef.id),
        });
        //set the Alert to Success and display message
        setStatusBase({
          lvl: "success",
          msg: "Production Company Created",
          key: Math.random(),
        });
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

  const handleCheckbox = (e) => {
    if (searchable === true) {
      setSearchable(false);
    } else {
      setSearchable(true);
    }
    console.log(searchable);
  };

  const handleBack = () => {
    navigate("/producer-page");
  };

  return (
    <form>
      <Header />
      {!loading ? (
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
              <h2>Create Production Company</h2>
            </Grid>
          </Grid>
          {/*==================Name & Searchable Name Section==================*/}
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
              <TextField
                label="Name"
                id="outlined-required"
                type="text"
                variant="outlined"
                inputRef={nameRef}
                error={error}
                required
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox onChange={handleCheckbox} defaultChecked />
                  }
                  label="Allow Company to appear in search results"
                />
              </FormGroup>
            </Grid>
          </Grid>
          {/*==================Email & Webpage Section==================*/}
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
              <TextField
                label="Email"
                id="outlined-required"
                type="E-Mail"
                inputRef={emailRef}
                error={error}
                required
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <TextField
                label="Web Page"
                id="outlined-required"
                type="text"
                inputRef={webRef}
                variant="outlined"
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
          {/*==================Contact Information Section==================*/}
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
              <h2>Contact Information</h2>
            </Grid>
          </Grid>
          {/*==================Country Code & Phone Number Section==================*/}
          <Grid
            container
            columnSpacing={1}
            rowSpacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
            marginBottom={1}
          >
            <Grid item xs={11} sm={8} md={2} textAlign="center">
              <TextField
                label="Country Code"
                type="text"
                variant="outlined"
                inputRef={codeRef}
                sx={{ width: 1 }}
                defaultValue={"+1"}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={4} textAlign="center">
              <TextField
                label="Phone number"
                type="tel"
                inputRef={phoneRef}
                variant="outlined"
                sx={{ width: 1 }}
              />
            </Grid>
          </Grid>
          {/*==================Country Section==================*/}
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
                label="Country"
                type="text"
                variant="outlined"
                inputRef={countryRef}
                sx={{ width: 1 }}
              />
            </Grid>
          </Grid>
          {/*==================City & State Section==================*/}
          <Grid
            container
            columnSpacing={1}
            rowSpacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
            marginBottom={1}
          >
            <Grid item xs={11} sm={8} md={3} textAlign="right">
              <TextField
                label="City"
                type="text"
                inputRef={cityRef}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <TextField
                label="State"
                type="text"
                variant="outlined"
                inputRef={stateRef}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
          {/*==================Street 1 & 2 Section==================*/}
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
              <TextField
                label="Street"
                type="text"
                inputRef={streetRef}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <TextField
                label="Street2"
                type="text"
                variant="outlined"
                inputRef={street2Ref}
                sx={{ width: "100%" }}
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
      ) : (
        "Loading..."
      )}
    </form>
  );
}
