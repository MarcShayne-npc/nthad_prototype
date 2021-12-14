import React from "react";
import { useState, useEffect, useRef } from "react";
import { Grid, TextField, Avatar, Typography } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import Button from "@mui/material/Button";
import { db, storage } from "../../firebase";
import { getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { Mail } from "@mui/icons-material";
import AlertMessage from "../Tools&Hooks/AlertMessage";
import { styled } from "@mui/material/styles";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";

//style for upload button from Mui
const Input = styled("input")({
  display: "none",
});

export default function EditUser() {
  //Set AlertMessage Status and passes to Alertmessage hook
  const [status, setStatusBase] = useState("");
  //Do Api Call first and get promises doc from firestore
  //Then load page
  const [loading, setLoading] = useState(true);

  //current user that is logged in
  const { currentUser, userUpdateEmail } = useAuth();
  const documentId = currentUser.uid;
  const navigate = useNavigate();
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
    countrycode: "+1",
    number: "",
  });

  const displayRef = useRef("");
  const stageRef = useRef("");
  const firstRef = useRef("");
  const lastRef = useRef("");
  const birthdayRef = useRef(new Date());
  const cityRef = useRef("");
  const countryRef = useRef("");
  const postalRef = useRef("");
  const stateRef = useRef("");
  const streetRef = useRef("");
  const unitRef = useRef("");
  const codeRef = useRef("");
  const numberRef = useRef("");

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
            displayname: res.data().displayname,
            stagename: res.data().stagename,
            firstname: res.data().legalfirstname,
            lastname: res.data().legallastname,
            birthday: res.data().birthday,
            city: res.data().city,
            country: res.data().country,
            postalcode: res.data().postalcode,
            state: res.data().state,
            street: res.data().street,
            unit: res.data().unit,
            countrycode: res.data().countrycode,
            number: res.data().number,
          });
          setHasAvatar(res.data().hasavatar);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    getUsers();
    return setUserData({});
  }, [documentId]);

  const [error, setError] = useState({
    fields: false,
    name: false,
  });
  //When user press submit button
  const handleEditUser = async () => {
    //regex this is used later to detech letter or space only
    const re = /^[a-zA-Z\s]*$/;
    //this is to check if the document exist in the firestore
    const usersRef = doc(db, "user", currentUser.uid);
    const docSnap = await getDoc(usersRef);
    //if it exists already make update
    if (docSnap.exists()) {
      try {
        setError({ fields: false, name: false });
        //Checks if userData.firstname & .lastname is letters and space only
        if (
          re.test(firstRef.current.value) &&
          re.test(lastRef.current.value) &&
          firstRef.current.value.trim() !== "" &&
          lastRef.current.value.trim() !== "" &&
          displayRef.current.value.trim() !== "" &&
          stageRef.current.value.trim() !== "" &&
          birthdayRef.current.value !== ""
        ) {
          //Then Add or update document in firestore
          //Only required fields are needed if empty on non-required field
          //will leave blank value
          await updateDoc(doc(db, "user", currentUser.uid), {
            displayname: displayRef.current.value,
            legalfirstname: firstRef.current.value,
            legallastname: lastRef.current.value,
            stagename: stageRef.current.value,
            email: currentUser.email,
            hasavatar: hasAvatar,
            birthday: birthdayRef.current.value,

            street: streetRef.current.value,
            unit: unitRef.current.value,
            city: cityRef.current.value,
            state: stateRef.current.value,
            country: countryRef.current.value,
            postalcode: postalRef.current.value,

            countrycode: codeRef.current.value,
            number: numberRef.current.value,
          });
          //set the Alert to Success and display message
          setStatusBase({
            lvl: "success",
            msg: "Account Edited/Updated",
            key: Math.random(),
          });

          window.location.reload(true);
        } else if (
          firstRef.current.value === "" ||
          lastRef.current.value === "" ||
          displayRef.current.value === "" ||
          stageRef.current.value === "" ||
          birthdayRef.current.value === ""
        ) {
          setError({ fields: true });
          //when user required field is empty
          setStatusBase({
            lvl: "error",
            msg: "Required fields are empty",
            key: Math.random(),
          });
        } else {
          setError({ name: true });
          //set the Alert to error and display message
          setStatusBase({
            lvl: "error",
            msg: "Only letters allowed in First Name & Last Name",
            key: Math.random(),
          });
        }
      } catch (err) {
        console.log(err);
        setStatusBase({
          lvl: "error",
          msg: "Failed to edit account.",
          key: Math.random(),
        });
        console.log("Failled to edit account");
      }

      //if document dosen't exist addDoc
      //below is the same code as above but instead of updateDoc its setDoc
      //since user dosen't exist in the database yet
    } else {
      try {
        setError({ fields: false, name: false });
        //Checks if userData.firstname & .lastname is letters and space only
        if (
          re.test(firstRef.current.value) &&
          re.test(lastRef.current.value) &&
          firstRef.current.value.trim() !== "" &&
          lastRef.current.value.trim() !== "" &&
          displayRef.current.value.trim() !== "" &&
          stageRef.current.value.trim() !== "" &&
          birthdayRef.current.value !== ""
        ) {
          //Then Add or update document in firestore
          //Only required fields are needed if empty on non-required field
          //will leave blank value
          await setDoc(
            doc(db, "user", currentUser.uid),
            {
              displayname: displayRef.current.value,
              legalfirstname: firstRef.current.value,
              legallastname: lastRef.current.value,
              stagename: stageRef.current.value,
              email: currentUser.email,
              hasavatar: hasAvatar,
              birthday: birthdayRef.current.value,

              street: streetRef.current.value,
              unit: unitRef.current.value,
              city: cityRef.current.value,
              state: stateRef.current.value,
              country: countryRef.current.value,
              postalcode: postalRef.current.value,

              countrycode: codeRef.current.value,
              number: numberRef.current.value,

              productioncompaniesowned: [],
              productionsowned: [],
            },
            { merge: true }
          );
          //set the Alert to Success and display message
          setStatusBase({
            lvl: "success",
            msg: "Account Edited/Updated",
            key: Math.random(),
          });

          window.location.reload(true);
        } else if (
          firstRef.current.value === "" ||
          lastRef.current.value === "" ||
          displayRef.current.value === "" ||
          stageRef.current.value === "" ||
          birthdayRef.current.value === ""
        ) {
          setError({ fields: true });
          //when user required field is empty
          setStatusBase({
            lvl: "error",
            msg: "Required fields are empty",
            key: Math.random(),
          });
        } else {
          setError({ name: true });
          //set the Alert to error and display message
          setStatusBase({
            lvl: "error",
            msg: "Only letters allowed in First Name & Last Name",
            key: Math.random(),
          });
        }
      } catch (err) {
        console.log(err);
        setStatusBase({
          lvl: "error",
          msg: "Failed to edit account.",
          key: Math.random(),
        });
        console.log("Failled to edit account");
      }
    }
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
            hasavatar: true,
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

  const emailRef = useRef();

  function handleUpdateEmail(e) {
    e.preventDefault();
    const promises = [];
    setLoading(true);
    if (emailRef.current.value !== currentUser.email) {
      promises.push(userUpdateEmail(emailRef.current.value));
    }
    Promise.all(promises)
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        setStatusBase({
          lvl: "error",
          msg: "User needs to be login recently to change Email",
          key: Math.random(),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <form>
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
                src={url}
                alt="ProfilePic"
              />
            </Grid>
            <Grid item xs={4}>
              <label htmlFor="contained-button-file">
                <Input
                  accept="image/png, image/jpeg"
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={handleImage}
                />
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </label>
              <Typography variant="subtitle1">
                Image format must be JPG,GIF or PNG only
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
                error={error.fields}
                defaultValue={userData.displayname}
                inputRef={displayRef}
                label="User Display Name*"
                id="outlined-required"
                type="text"
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <TextField
                label="Stage Name*"
                defaultValue={userData.stagename}
                error={error.fields}
                inputRef={stageRef}
                id="outlined-required"
                type="text"
                variant="outlined"
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
                defaultValue={userData.firstname}
                error={error.name || error.fields}
                type="text"
                variant="outlined"
                inputRef={firstRef}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <TextField
                label="Last Name*"
                defaultValue={userData.lastname}
                error={error.name || error.fields}
                type="text"
                variant="outlined"
                inputRef={lastRef}
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
                inputRef={emailRef}
                defaultValue={currentUser.email}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item md={1}>
              <Button
                variant="outlined"
                style={{ height: "54px" }}
                onClick={handleUpdateEmail}
              >
                <Mail />
              </Button>
            </Grid>
            <Grid item xs={11} sm={8} md={2}>
              <TextField
                error={error.fields}
                label="Birthday*"
                name="birthday"
                InputLabelProps={{ shrink: true }}
                defaultValue={userData.birthday}
                type="date"
                variant="outlined"
                inputRef={birthdayRef}
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
                defaultValue={userData.countrycode}
                inputRef={codeRef}
                type="text"
                variant="outlined"
                sx={{ width: 1 }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={4} textAlign="center">
              <TextField
                label="Phone number"
                defaultValue={userData.number}
                inputRef={numberRef}
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
                defaultValue={userData.country}
                inputRef={countryRef}
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
                defaultValue={userData.city}
                inputRef={cityRef}
                type="text"
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              <TextField
                label="State"
                defaultValue={userData.state}
                inputRef={stateRef}
                type="text"
                variant="outlined"
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
                defaultValue={userData.postalcode}
                inputRef={postalRef}
                type="text"
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={2}>
              <TextField
                label="Street"
                defaultValue={userData.street}
                inputRef={streetRef}
                type="text"
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={2}>
              <TextField
                label="Unit"
                defaultValue={userData.unit}
                inputRef={unitRef}
                type="text"
                variant="outlined"
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
