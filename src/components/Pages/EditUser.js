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
  const [newAvatar, setAvatar] = useState(false);

  //Set AlertMessage Status and passes to Alertmessage hook
  const [status, setStatusBase] = useState("");
  //Do Api Call first and get promises doc from firestore
  //Then load page
  const [loading, setLoading] = useState(true);

  //current user that is logged in
  const { currentUser } = useAuth();
  const documentId = currentUser.uid;

  //User Data in firestore this is null if the user is new
  //all the data that is being pass through firestore
  //There is no "productioncompaniesowned" and productionsowned defaulted to be an empty array
  const [userData, setUserData] = useState({
    displayname: "",
    stagename: "",
    firstname: "",
    lastname: "",
    birthday: "2017-05-24",
    city: "",
    country: "",
    postalcode: "",
    state: "",
    street: "",
    unit: "",
    countrycode: "",
    number: "",
  });

  //when User first loads in EditUser
  //Get Doc from firebase and set the value to userData
  //then later used to print the value in the TextFields
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      //get Document reference from firebase by using current user uid
      const docRef = doc(db, "user", documentId);
      //asynchronous get date from firebase then set's their data in a useState
      await getDoc(docRef)
        .then((res) => {
          setUserData({
            displayname: res.data().user_fields.displayname,
            stagename: res.data().user_fields.stagename,
            firstname: res.data().user_fields.legalfirstname,
            lastname: res.data().user_fields.legallastname,
            birthday: res.data().user_fields.birthday,
            city: res.data().address.city,
            country: res.data().address.country,
            postalcode: res.data().address.postalcode,
            state: res.data().address.state,
            street: res.data().address.street,
            unit: res.data().address.unit,
            countrycode: res.data().phone.countrycode,
            number: res.data().phone.number,
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
    //regex this is used later to detech letter or space only
    const re = /^[a-zA-Z\s]*$/;
    try {
      //Checks if userData.firstname & .lastname is letters and space only
      if (
        re.test(userData.firstname) &&
        re.test(userData.lastname) &&
        userData.firstname.trim() !== "" &&
        userData.lastname.trim() !== ""
      ) {
        //Then Add or update document in firestore
        //Only required fields are needed if empty on non-required field
        //will leave blank value
        await setDoc(doc(db, "user", currentUser.uid), {
          user_fields: {
            displayname: userData.displayname,
            legalfirstname: userData.firstname,
            legallastname: userData.lastname,
            stagename: userData.stagename,
            email: currentUser.email,
            hasavatar: newAvatar,
            birthday: userData.birthday,
          },
          address: {
            street: userData.street,
            unit: userData.unit,
            city: userData.city,
            state: userData.state,
            country: userData.country,
            postalcode: userData.postalcode,
          },
          phone: {
            countrycode: userData.countrycode,
            number: userData.number,
          },
          productioncompaniesowned: [""],
          productionsowned: [""],
        });
        //set the Alert to Success and display message
        setStatusBase({
          lvl: "success",
          msg: "Account Edited/Updated",
          key: Math.random(),
        });
        console.log("Edit Profile Submit");
      } else if (
        userData.firstname === "" ||
        userData.lastname === "" ||
        userData.displayname === "" ||
        userData.stagename === ""
      ) {
        //when user required field is empty
        setStatusBase({
          lvl: "error",
          msg: "Required fields are empty",
          key: Math.random(),
        });
      } else {
        //set the Alert to error and display message
        setStatusBase({
          lvl: "error",
          msg: "Only letters allowed in First Name & Last Name",
          key: Math.random(),
        });
      }
    } catch {
      //something went wrong
      setStatusBase({
        lvl: "error",
        msg: "Failed to edit account.",
        key: Math.random(),
      });
      console.log("Failled to edit account");
    }
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
                label="Last Name*"
                name="lastname"
                error={userData.lastname === ""}
                helperText={userData.lastname === "" ? "Required" : " "}
                type="text"
                variant="outlined"
                value={userData.lastname}
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
                name="birthday"
                value={userData.birthday}
                error={userData.birthday === ""}
                helperText={userData.birthday === "" ? "Required" : ""}
                InputLabelProps={{ shrink: true }}
                type="date"
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
                defaultValue="+1"
                name="countrycode"
                value={userData.countrycode}
                type="text"
                variant="outlined"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    [e.target.name]: e.target.value,
                  });
                }}
                sx={{ width: 1 }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={4} textAlign="center">
              <TextField
                label="Phone number"
                name="number"
                value={userData.number}
                type="tel"
                variant="outlined"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    [e.target.name]: e.target.value,
                  });
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
                name="country"
                value={userData.country}
                type="text"
                variant="outlined"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    [e.target.name]: e.target.value,
                  });
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
                name="city"
                value={userData.city}
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
                label="State"
                name="state"
                value={userData.state}
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
                name="postalcode"
                value={userData.postalcode}
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
            <Grid item xs={11} sm={8} md={2}>
              <TextField
                label="Street"
                name="street"
                value={userData.street}
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
            <Grid item xs={11} sm={8} md={2}>
              <TextField
                label="Unit"
                name="unit"
                value={userData.unit}
                type="text"
                variant="outlined"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    [e.target.name]: e.target.value,
                  });
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
