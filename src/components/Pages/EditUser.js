import React from "react";
import { useState, useEffect } from "react";
import { Grid, TextField, Avatar, Typography } from "@mui/material";
import Header from "../Tools&Hooks/Header";
import { useAuth } from "../../contexts/AuthContext";
import Button from "@mui/material/Button";
import { db } from "../../firebase";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { Mail } from "@mui/icons-material";
import AlertMessage from "../Tools&Hooks/AlertMessage";

export default function EditUser() {
  //all the data that is being pass through firestore
  //There is no "productioncompaniesowned" and productionsowned defaulted to be an empty array

  const [newFirstName, setFirstName] = useState("");
  const [newLastName, setLastName] = useState("");
  const [newAvatar, setAvatar] = useState(false);
  const [newBirthday, setBirthday] = useState(new Date(0, 0, 0));
  const [newStreet, setStreet] = useState("");
  const [newUnit, setUnit] = useState("");
  const [newCity, setCity] = useState("");
  const [newState, setState] = useState("");
  const [newCountry, setCountry] = useState("");
  const [newPostalcode, setPostalCode] = useState("");
  const [newCountryCode, setCountryCode] = useState("+1");
  const [newNumber, setNumber] = useState("");

  //Set AlertMessage Status and passes to Alertmessage hook
  const [status, setStatusBase] = useState("");
  //Do Api Call first and get promises doc from firestore
  //Then load page
  const [loading, setLoading] = useState(true);

  //current user that is logged in
  const { currentUser } = useAuth();
  const documentId = currentUser.uid;

  //User Data in firestore this is null if the user is new
  const [userData, setUserData] = useState({
    displayname: null,
    stagename: null,
    firstname: null,
    lastname: null,
  });

  //when User first loads in EditUser
  //Get Doc from firebase and set the value to userData
  //then later used to print the value in the TextFields
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const docRef = doc(db, "user", documentId);
      await getDoc(docRef)
        .then((res) => {
          console.log(res.data().user_fields);
          setUserData({
            displayname: res.data().user_fields.displayname,
            stagename: res.data().user_fields.stagename,
            firstname: res.data().user_fields.legalfirstname,
            lastname: res.data().user_fields.legallastname,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    getUsers();
  }, []);

  //When user press submit button
  const handleEditUser = async () => {
    //Add or update document in firestore
    //Only required fields are needed if emptry on non-required field
    //will leave blank value
    try {
      await setDoc(doc(db, "user", currentUser.uid), {
        user_fields: {
          displayname: userData.displayname,
          legalfirstname: userData.firstname,
          legallastname: userData.lastname,
          stagename: userData.stagename,
          email: currentUser.email,
          hasavatar: newAvatar,
          birthday: newBirthday,
        },
        address: {
          street: newStreet,
          unit: newUnit,
          city: newCity,
          state: newState,
          country: newCountry,
          postalcode: newPostalcode,
        },
        phone: {
          countrycode: newCountryCode,
          number: newNumber,
        },
        productioncompaniesowned: [""],
        productionsowned: [""],
      });
      setStatusBase({
        lvl: "success",
        msg: "Account Edited/Updated",
        key: Math.random(),
      });
      console.log("Edit Profile Submit");
    } catch {
      //when user required field is empty
      setStatusBase({
        lvl: "error",
        msg: "Failed to edit account",
        key: Math.random(),
      });
      console.log("Failled to edit account");
    }
  };

  //removes numbers and symbols from firstname letters only
  const onChangeFirstName = (e) => {
    const re = /^[a-zA-Z\s]*$/;
    if (re.test(e.target.value))
      setUserData({ [e.target.name]: e.target.value });
  };

  //removes numbers and symbols from lastname letters only
  const onChangeLastName = (e) => {
    const re = /^[A-Za-z]+$/;
    if (e.target.value === "" || re.test(e.target.value))
      setLastName(e.target.value);
  };

  return (
    <form>
      <Header />
      {!loading ? (
        <Grid>
          {/*==================Avatar Picture Section==================*/}
          <Grid
            container
            spacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
            marginBottom={2}
          >
            <Grid item>
              <Avatar
                sx={{ width: 150, height: 150 }}
                src=""
                alt="ProfilePic"
              />
            </Grid>
            <Grid item xs={4}>
              <Button variant="outlined">Upload</Button>
              <Typography variant="subtitle1">
                Image format must be JPG only
              </Typography>
              <Typography variant="subtitle1">
                Max file size is 200kb
              </Typography>
            </Grid>
          </Grid>
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
              <h2>Account Information</h2>
            </Grid>
          </Grid>
          {/*==================Display&Stage Name Section==================*/}
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
                error={userData.displayname === ""}
                name="displayname"
                value={userData.displayname}
                helperText={userData.displayname === "" ? "Required" : " "}
                label="User Display Name*"
                id="outlined-required"
                type="text"
                variant="outlined"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    [e.target.name]: e.target.value,
                  });
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <TextField
                label="Stage Name*"
                name="stagename"
                error={userData.stagename === ""}
                value={userData.stagename}
                helperText={userData.stagename === "" ? "Required" : " "}
                id="outlined-required"
                type="text"
                variant="outlined"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    [e.target.name]: e.target.value,
                  });
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
          {/*==================First&Last Name Section==================*/}
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
                label="First Name*"
                name="firstname"
                error={userData.firstname === ""}
                helperText={userData.firstname === "" ? "Required" : " "}
                type="text"
                variant="outlined"
                value={userData.firstname}
                onChange={onChangeFirstName}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <TextField
                label="Last Name*"
                error={newLastName === ""}
                helperText={newLastName === "" ? "Required" : " "}
                type="text"
                variant="outlined"
                value={newLastName}
                onChange={onChangeLastName}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
          {/*==================Birthday&Email Section==================*/}
          <Grid
            container
            columnSpacing={0}
            rowSpacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
            marginBottom={1}
          >
            <Grid item xs={8.5} sm={6.5} md={3}>
              <TextField
                label="E-Mail*"
                id="outlined-required"
                type="email"
                defaultValue={currentUser.email}
                variant="outlined"
                InputProps={{ readOnly: true }}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item md={1}>
              <Button variant="outlined" style={{ height: "54px" }}>
                <Mail />
              </Button>
            </Grid>
            <Grid item xs={11} sm={8} md={2}>
              <TextField
                label="Birthday*"
                defaultValue="2017-05-24"
                error={newBirthday === ""}
                helperText={newBirthday === "" ? "Required" : ""}
                InputLabelProps={{ shrink: true }}
                type="date"
                variant="outlined"
                onChange={(event) => {
                  setBirthday(event.target.value);
                }}
                sx={{ width: "100%" }}
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
                onChange={(event) => {
                  setCountryCode(event.target.value);
                }}
                sx={{ width: 1 }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={4} textAlign="center">
              <TextField
                label="Phone number"
                type="tel"
                variant="outlined"
                onChange={(event) => {
                  setNumber(event.target.value);
                }}
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
                onChange={(event) => {
                  setCountry(event.target.value);
                }}
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
                onChange={(event) => {
                  setCity(event.target.value);
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <TextField
                label="State"
                type="text"
                variant="outlined"
                onChange={(event) => {
                  setState(event.target.value);
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
          {/*==================Postal, Street, and Unit Section==================*/}
          <Grid
            container
            columnSpacing={1}
            rowSpacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
            marginBottom={1}
          >
            <Grid item xs={11} sm={8} md={2}>
              <TextField
                label="Postal Code"
                type="text"
                variant="outlined"
                onChange={(event) => {
                  setPostalCode(event.target.value);
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={2}>
              <TextField
                label="Street"
                type="text"
                variant="outlined"
                onChange={(event) => {
                  setStreet(event.target.value);
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={2}>
              <TextField
                label="Unit"
                type="text"
                variant="outlined"
                onChange={(event) => {
                  setUnit(event.target.value);
                }}
                sx={{ width: 1 }}
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
