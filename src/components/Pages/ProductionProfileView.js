import React from "react";
import { useState, useEffect } from "react";
import { Grid, Typography, Divider, Card, Avatar } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { db, storage } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getDownloadURL, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  typography: {
    fontSize: 18,
  },
});

const cardStyle2 = {
  padding: 20,
  height: "90%",
  width: "99%",
  margin: "20px auto",
};

export default function ProductionProfileView({
  companyId,
  productionId,
  setUserId,
  setProductionCompany,
}) {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const documentId = currentUser.uid;
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({
    name: "",
    coId: "",
  });
  const [productionData, setProductionData] = useState({
    name: "",

    shortName: "",
    about: "",
  });
  //sets the url image to update Avatar
  const [url, setUrl] = useState("");
  const [user, setUser] = useState({ id: "", name: "" });
  useEffect(() => {
    //gets the company info
    const getProductionCompany = async () => {
      setLoading(true);

      //asynchronous get date from firebase then set's their data in a useState
      try {
        const docRef = doc(db, "productioncompany", companyId);
        await getDoc(docRef)
          .then((res) => {
            setCompanyData({
              name: res.data().name,
              coId: companyId,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } catch {
        navigate("/producer-page");
      }
    };

    //get the production info
    const getProduction = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "production", productionId);
        //production data
        await getDoc(docRef)
          .then((res) => {
            setProductionData({
              name: res.data().name,
              shortName: res.data().shortname,
              about: res.data().description,
            });
            const userRef = doc(db, "user", res.data().owners[0]);
            //then get user data by using the production data of owner
            getDoc(userRef).then((r) => {
              setUser({
                id: res.data().owners[0],
                name: r.data().displayname,
              });
              if (r.data().hasavatar) {
                const getImage = async () => {
                  const imageRef = ref(
                    storage,
                    `user/avatar/${res.data().owners[0]}`
                  );
                  setUrl(await getDownloadURL(imageRef));
                };
                getImage();
              }
            });
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      } catch {
        navigate("/producer-page");
      }
    };

    getProduction();
    getProductionCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, documentId, productionId]);

  const handleUser = () => {
    setUserId(user.id);
    navigate("/user-profile");
  };

  const handleCompanyView = () => {
    setProductionCompany(companyData.coId);
    navigate("/production-company-profile");
  };
  return (
    <div>
      {!loading ? (
        <Card align="center" variant="outlined" style={cardStyle2}>
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
                  <Typography variant="h5">{productionData.name}</Typography>
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
                  <Typography
                    onClick={handleCompanyView}
                    style={{ cursor: "pointer" }}
                    variant="h6"
                  >
                    {companyData.name}
                  </Typography>
                </Grid>
              </ThemeProvider>
            </Grid>
            <Divider />
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
                    <b>Short Name: </b>
                    {productionData.shortName}
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography variant="body1">
                    <b>NTH_AD Manager: </b>
                  </Typography>
                  <Grid item md={6} xs={12}>
                    <Card
                      variant="outlined"
                      onClick={handleUser}
                      style={{ cursor: "pointer" }}
                    >
                      <Grid container direction="row" alignItems="center">
                        <Grid item xs={4}>
                          <Avatar src={url} alt="ProfilePic" />
                        </Grid>
                        <Grid item xs={5}>
                          {user.name}
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
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
                    <b>About: </b>
                  </Typography>
                  <Typography variant="body1">
                    {productionData.about}
                  </Typography>
                </Grid>
              </ThemeProvider>
            </Grid>
          </>
        </Card>
      ) : (
        "loading..."
      )}
    </div>
  );
}
