import React from "react";
import { useState, useEffect, useRef } from "react";
import { Grid, TextField, Avatar, Typography } from "@mui/material";
import Header from "../Tools&Hooks/Header";
import { useAuth } from "../../contexts/AuthContext";
import Button from "@mui/material/Button";
import { db, storage } from "../../firebase";
import { getDoc, addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { Mail } from "@mui/icons-material";
import AlertMessage from "../Tools&Hooks/AlertMessage";
import { styled } from "@mui/material/styles";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import firebase from "@firebase/app-compat";

//style for upload button from Mui
const Input = styled("input")({
  display: "none",
});

export default function ProductionCompanyProfileEdit() {
  //Set AlertMessage Status and passes to Alertmessage hook
  const [status, setStatusBase] = useState("");
  //Do Api Call first and get promises doc from firestore
  //Then load page
  const [loading, setLoading] = useState(false);

  //current user that is logged in
  const { currentUser, userUpdateEmail } = useAuth();
  const documentId = currentUser.uid;
  const navigate = useNavigate();
  //User Data in firestore this is null if the user is new
  //all the data that is being pass through firestore
  //There is no "productioncompaniesowned" and productionsowned defaulted to be an empty array
  //some values a
  const [productionCompany, setProductionCompany] = useState({
    updatedby: "",
    owners: [""],
    name: "",
    searchable: "",
    email: "",
    webpage: "",
    haslogo: "",
    countrycode: "+",
    number: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    country: "",
    about: "",
    productions: [""],
  });

  //when User first loads in EditUser
  //Get Doc from firebase and set the value to userData
  //then later used to print the value in the TextFields
  //   useEffect(() => {
  //     const getUsers = async () => {
  //       setLoading(true);
  //       //get Document reference from firebase by using current user uid
  //       const docRef = doc(db, "user", documentId);
  //       //asynchronous get date from firebase then set's their data in a useState
  //       await getDoc(docRef)
  //         .then((res) => {
  //           setUserData({
  //             displayname: res.data().user_fields.displayname,
  //             stagename: res.data().user_fields.stagename,
  //             firstname: res.data().user_fields.legalfirstname,
  //             lastname: res.data().user_fields.legallastname,
  //             birthday: res.data().user_fields.birthday,
  //             city: res.data().address.city,
  //             country: res.data().address.country,
  //             postalcode: res.data().address.postalcode,
  //             state: res.data().address.state,
  //             street: res.data().address.street,
  //             unit: res.data().address.unit,
  //             countrycode: res.data().phone.countrycode,
  //             number: res.data().phone.number,
  //           });
  //           setHasAvatar(res.data().user_fields.hasavatar);
  //           setLoading(false);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           setLoading(false);
  //         });
  //     };
  //     getUsers();
  //     return setUserData({});
  //   }, [documentId]);

  //When user press submit button
  const handleEditUser = async () => {
    //regex this is used later to detech letter or space only
    //const re = /^[a-zA-Z\s]*$/;
    //try {
    await addDoc(collection(db, "productioncompany"), {
      productioncompany_fields: {
        updatedby: "",
        owners: ["", ""],
        name: "",
        searchable: "",
        email: "",
        webpage: "",
        haslogo: "",
        phone: {
          countrycode: "+",
          number: "",
        },
        address: {
          street: "",
          street2: "",
          city: "",
          state: "",
          country: "",
        },
        about: "",
        productions: ["", ""],
      },
    });
    //set the Alert to Success and display message
    setStatusBase({
      lvl: "success",
      msg: "Production Company Created",
      key: Math.random(),
    });
    // } catch {
    //   //something went wrong
    //   setStatusBase({
    //     lvl: "error",
    //     msg: "Failed to edit account.",
    //     key: Math.random(),
    //   });
    //   console.log("Failled to edit account");
    // }
  };

  //sets the url image to update Avatar
  const [url, setUrl] = useState("");
  //sets the image for passing to handleUpload
  const handleImage = (e) => {
    if (e.target.files[0].size <= 200000) {
      const storageRef = ref(storage, `/user/avatar/${documentId}`);
      const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => console.log(err),
        () => {
          setStatusBase({
            lvl: "success",
            msg: "Uploaded file",
            key: Math.random(),
          });
          updateDoc(doc(db, "user", currentUser.uid), {
            "user_fields.hasavatar": true,
          });
          getDownloadURL(uploadTask.snapshot.ref).then((url) => setUrl(url));
        }
      );
    } else {
      setStatusBase({
        lvl: "error",
        msg: "File must be less than 200kb",
        key: Math.random(),
      });
    }
  };
  const [hasAvatar, setHasAvatar] = useState(false);
  //sets the image on load when user have a image
  useEffect(() => {
    if (hasAvatar === true) {
      const getImage = async () => {
        const imageRef = ref(storage, `user/avatar/${documentId}`);
        setUrl(await getDownloadURL(imageRef));
      };
      getImage();
    }
  });

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
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
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
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <TextField
                label="Web Page"
                id="outlined-required"
                type="E-Mail"
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
                sx={{ width: 1 }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={4} textAlign="center">
              <TextField
                label="Phone number"
                type="tel"
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
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <TextField
                label="State"
                type="text"
                variant="outlined"
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
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <TextField
                label="Street2"
                type="text"
                variant="outlined"
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
