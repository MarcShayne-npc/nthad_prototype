import React from "react";
import { useState, useEffect } from "react";
import {
  Grid,
  Avatar,
  Typography,
  Divider,
  ButtonGroup,
  Card,
} from "@mui/material";
import Header from "../Tools&Hooks/Header";
import { useAuth } from "../../contexts/AuthContext";
import Button from "@mui/material/Button";
import { db, storage } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontSize: 18,
  },
});

const cardStyle = {
  padding: 20,
  height: "20%",
  width: "90%",
  margin: "20px auto",
};
const cardStyle2 = {
  padding: 20,
  height: "300px",
  width: "90%",
  margin: "20px auto",
};

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const documentId = currentUser.uid;

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
          setHasAvatar(res.data().user_fields.hasavatar);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };
    getUsers();

    return setUserData({});
  }, [documentId]);

  //sets the url image to update Avatar
  const [url, setUrl] = useState("");
  //sets the image for passing to handleUpload

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

  //This is so that you can change your profile info when
  //you press the about or details
  const [profile, setProfile] = useState(true);
  const handleProfile = () => {
    if (profile === true) {
      setProfile(false);
    } else {
      setProfile(true);
    }
  };

  return (
    <div>
      <Header />
      <Card elevation={10} align="center" variant="outlined" style={cardStyle}>
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
        </Grid>
        <Grid
          container
          columnSpacing={1}
          rowSpacing={1}
          direction="row"
          justifyContent="center"
          marginBottom={1}
        >
          <Grid item xs={11} sm={8} md={6} textAlign="center">
            <h2>{userData.displayname}</h2>
          </Grid>
        </Grid>
      </Card>
      <Card elevation={10} align="center" variant="outlined" style={cardStyle2}>
        <Grid container direction="row">
          <Grid item xs={3} sm={2} md={0}>
            <ButtonGroup variant="text" aria-label="text button group">
              <Button onClick={handleProfile}>About</Button>
              <Button onClick={handleProfile}>Details</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
        <Divider />
        {profile ? (
          <>
            <Grid
              container
              columnSpacing={12}
              rowSpacing={0}
              direction="row"
              justifyContent="center"
              alignItems="center"
              marginBottom={1}
            >
              <ThemeProvider theme={theme}>
                <Grid item md={12}>
                  <Typography variant="body1">
                    <b>Stage Name: </b> {userData.stagename}
                  </Typography>
                </Grid>
              </ThemeProvider>
            </Grid>
            <Grid
              container
              columnSpacing={12}
              rowSpacing={0}
              direction="row"
              justifyContent="center"
              alignItems="center"
              marginBottom={1}
            >
              <ThemeProvider theme={theme}>
                <Grid item md={4}>
                  <Typography variant="body1">
                    <b>First Name: </b> {userData.firstname}
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1">
                    <b>lastname: </b> {userData.lastname}
                  </Typography>
                </Grid>
              </ThemeProvider>
            </Grid>
          </>
        ) : (
          <>
            <Grid
              container
              columnSpacing={12}
              rowSpacing={0}
              direction="row"
              justifyContent="center"
              alignItems="center"
              marginBottom={1}
            >
              <ThemeProvider theme={theme}>
                <Grid item md={4}>
                  <Typography variant="body1">
                    <b>Email: </b> {currentUser.email}
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1">
                    <b>Birthday: </b> {userData.birthday}
                  </Typography>
                </Grid>
              </ThemeProvider>
            </Grid>
            <Grid
              container
              columnSpacing={12}
              rowSpacing={0}
              direction="row"
              justifyContent="center"
              alignItems="center"
              marginBottom={1}
            >
              <ThemeProvider theme={theme}>
                <Grid item md={4}>
                  <Typography variant="body1">
                    <b>Country Code: </b> {userData.countrycode}
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body1">
                    <b>number: </b> {userData.number}
                  </Typography>
                </Grid>
              </ThemeProvider>
            </Grid>
            <Grid
              container
              columnSpacing={12}
              rowSpacing={0}
              direction="row"
              justifyContent="center"
              alignItems="center"
              marginBottom={1}
            >
              <ThemeProvider theme={theme}>
                <Grid item md={12}>
                  <Typography variant="body1">
                    <b>Address: </b>{" "}
                    {`${userData.country} , ${userData.postalcode} , ${userData.state} , ${userData.city} , ${userData.street} , ${userData.unit}`}
                  </Typography>
                </Grid>
              </ThemeProvider>
            </Grid>
          </>
        )}
      </Card>
    </div>
  );
}
