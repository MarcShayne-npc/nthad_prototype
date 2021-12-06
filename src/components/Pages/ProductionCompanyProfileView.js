import React from "react";
import { useState, useEffect } from "react";
import { Grid, Typography, Divider, ButtonGroup, Card } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import Button from "@mui/material/Button";
import { db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontSize: 18,
  },
});

const cardStyle2 = {
  padding: 20,
  height: "90%",
  width: "90%",
  margin: "20px auto",
};

export default function ProductionCompanyProfileView({ companyId }) {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const documentId = currentUser.uid;

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
    const getUsers = async () => {
      setLoading(true);
      //get Document reference from firebase by using current user uid
      const docRef = doc(db, "productioncompany", companyId);
      //asynchronous get date from firebase then set's their data in a useState
      await getDoc(docRef)
        .then((res) => {
          setCompanyData({
            name: res.data().name,
            email: res.data().email,
            web: res.data().webpage,
            about: res.data().about,
            code: res.data().phone.countrycode,
            phone: res.data().phone.number,
            country: res.data().address.country,
            city: res.data().address.city,
            state: res.data().address.state,
            street: res.data().address.street,
            street2: res.data().address.street2,
          });
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };
    getUsers();
  }, [companyId, documentId]);

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
      {!loading ? (
        <Card
          elevation={10}
          align="center"
          variant="outlined"
          style={cardStyle2}
        >
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
                    <Typography variant="h6">{companyData.name}</Typography>
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
                  <Grid item md={6}>
                    <Typography variant="body1">
                      <b>E-mail: </b> {companyData.email}
                    </Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Typography variant="body1">
                      <b>webpage: </b> {companyData.web}
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
                      <b>about: </b>
                    </Typography>
                    <Typography variant="body1">{companyData.about}</Typography>
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
                      <b>Country Code: </b> {companyData.code}
                    </Typography>
                  </Grid>
                  <Grid item md={4}>
                    <Typography variant="body1">
                      <b>number: </b> {companyData.phone}
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
                      {`${companyData.country} , ${companyData.state} , ${companyData.city} , ${companyData.street} , ${companyData.street2}`}
                    </Typography>
                  </Grid>
                </ThemeProvider>
              </Grid>
            </>
          )}
        </Card>
      ) : (
        "loading..."
      )}
    </div>
  );
}
