import React from "react";
import { useState, useRef, useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { db } from "../../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import AlertMessage from "../Tools&Hooks/AlertMessage";
import { useNavigate } from "react-router-dom";

export default function ProductionProfileEdit({ productionId, companyId }) {
  //Set AlertMessage Status and passes to Alertmessage hook
  const [status, setStatusBase] = useState("");
  //current user that is logged in
  const navigate = useNavigate();
  //All the references for the fields in Production
  const nameRef = useRef();
  const autoRef = useRef();
  const aboutRef = useRef();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "",
  });
  const [productionData, setProductionData] = useState({
    name: "",
    shortname: "",
    about: "",
  });
  useEffect(() => {
    const getCompany = async () => {
      setLoading(true);

      try {
        const docRef = doc(db, "productioncompany", companyId);
        await getDoc(docRef).then((res) => {
          setCompanyData({
            name: res.data().name,
          });
        });
      } catch {
        navigate("/producer-page");
      }
      setLoading(false);
    };
    const getProduction = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "production", productionId);
        await getDoc(docRef).then((res) => {
          setProductionData({
            name: res.data().name,
            shortname: res.data().shortname,
            about: res.data().description,
          });
        });
      } catch {
        navigate("/producer-page");
      }
      setLoading(false);
    };
    getProduction();
    getCompany();
  }, [companyId, navigate, productionId]);

  //When user press submit button
  const handleEditUser = async () => {
    //Gets all the reference and add document to firestore
    try {
      //validation if name & short name has value
      if (nameRef.current.value !== "" && autoRef.current.value !== "") {
        setError(false);
        const docRef = doc(db, "production", productionId);
        await updateDoc(docRef, {
          name: nameRef.current.value,
          shortname: autoRef.current.value,
          description: aboutRef.current.value,
        });

        //set the Alert to Success and display message
        setStatusBase({
          lvl: "success",
          msg: "Production Company Updated",
          key: Math.random(),
        });
        setTimeout(() => {
          //set the Alert to Success and display message
          navigate("/production-dashboard");
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

  const handleBack = () => {
    navigate("/producer-page");
  };

  const handleAuto = (e) => {
    let x = e.target.value;

    if (x.length <= 15) {
      autoRef.current.value = e.target.value;
    }
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
              <h2>
                Edit [{productionData.name}] in [{companyData.name}]
              </h2>
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
                defaultValue={productionData.name}
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
                defaultValue={productionData.shortname}
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
                defaultValue={productionData.about}
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
        "loading..."
      )}
    </form>
  );
}
