import React from "react";
import { useState, useRef, useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import Button from "@mui/material/Button";
import { db } from "../../firebase";
import { serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import AlertMessage from "../Tools&Hooks/AlertMessage";
import { useNavigate } from "react-router-dom";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function ProductionCompanyProfileEdit({ companyId }) {
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

  const [companyData, setCompanyData] = useState({
    name: "",
    email: "",
    web: "",
    about: "",
    code: "+1",
    phone: "",
    country: "",
    city: "",
    state: "",
    street: "",
    street2: "",
  });

  useEffect(() => {
    const getProductionCompany = async () => {
      setLoading(true);
      console.log(companyId);
      try {
        const docRef = doc(db, "productioncompany", companyId);
        await getDoc(docRef).then((res) => {
          setCompanyData({
            name: res.data().name,
            email: res.data().email,
            web: res.data().webpage,
            about: res.data().about,
            code: res.data().countrycode,
            phone: res.data().number,
            country: res.data().country,
            city: res.data().city,
            state: res.data().state,
            street: res.data().street,
            street2: res.data().street2,
          });
          setSearchable(res.data().searchable);
        });
      } catch {
        setStatusBase({
          lvl: "error",
          msg: "Production Company was not selected",
          key: Math.random(),
        });
        navigate("/producer-page");
      }
      setLoading(false);
    };
    getProductionCompany();
  }, [companyId, navigate]);

  //When user press submit button
  const handleEditUser = async () => {
    try {
      if (nameRef.current.value !== "" && emailRef.current.value !== "") {
        setError(false);
        const docRef = doc(db, "productioncompany", companyId);
        await updateDoc(docRef, {
          updated: serverTimestamp(),
          updatedby: currentUser.uid,
          name: nameRef.current.value,
          searchable: searchable,
          email: emailRef.current.value,
          webpage: webRef.current.value,
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
        });
        setStatusBase({
          lvl: "success",
          msg: "Production Company Updated",
          key: Math.random(),
        });
        setTimeout(() => {
          //set the Alert to Success and display message
          navigate("/production-company-dashboard");
        }, 1000);
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
    navigate("/production-company-dashboard");
  };

  return (
    <form>
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
              <h2>Edit Production Company</h2>
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
                defaultValue={companyData.name}
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
                    <Checkbox
                      onChange={handleCheckbox}
                      defaultChecked={searchable}
                    />
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
                type="email"
                defaultValue={companyData.email}
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
                defaultValue={companyData.web}
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
                defaultValue={companyData.about}
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
                defaultValue={companyData.code}
                inputRef={codeRef}
                sx={{ width: 1 }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={4} textAlign="center">
              <TextField
                label="Phone number"
                type="tel"
                defaultValue={companyData.phone}
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
                defaultValue={companyData.country}
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
                defaultValue={companyData.city}
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
                defaultValue={companyData.state}
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
                defaultValue={companyData.street}
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
                defaultValue={companyData.street2}
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
                Update
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
