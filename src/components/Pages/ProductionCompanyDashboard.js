import React from "react";
import { useEffect, useState } from "react";
import { Button, Grid, Card, Typography } from "@mui/material";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";

export default function ProductionCompanyDashboard({
  companyId,
  setProductionId,
  setProductionCompany,
}) {
  const { currentUser } = useAuth();
  const userUid = currentUser.uid;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "",
  });
  const [data, setData] = useState({
    id: "root",
    name: "Production Owned",
    docId: "",
    children: [{ id: "1", name: "Produtions Name" }],
  });
  const [productionOwned, setproductionOwned] = useState([]);
  const [proCoId, setProCoId] = useState("");
  const [productionList, setProductionList] = useState([]);

  useEffect(() => {
    const getProductionCompany = async () => {
      setLoading(true);

      //gets all the production owned by the user to use later
      const q = doc(db, "user", userUid);
      await getDoc(q).then((res) => {
        setproductionOwned(res.data().productionsowned);
      });

      //get user data later used to check if user ownes that production
      const q2 = query(
        collection(db, "production"),
        where("productioncompanyid", "==", companyId)
      );
      setProCoId(companyId);
      const querySnapshot2 = await getDocs(q2);
      let arr2 = [];
      let n = 0;
      //For each production the company owns add to children property of Data
      //also adds a Id with each children incrementing
      querySnapshot2.forEach((doc) => {
        arr2.push({
          id: (n + 1).toString(),
          name: doc.data().name,
          docId: doc.id,
        });
        n++;
      });
      setData({
        id: "root",
        name: "Production",
        children: arr2,
      });
      setProductionList(arr2);
      //When all is done set loading to false
      setLoading(false);
    };

    getProductionCompany();
  }, [companyId, userUid]);

  useEffect(() => {
    const getProductionCompany = async () => {
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
    getProductionCompany();
  }, [companyId, navigate]);

  const handleEditProfile = () => {
    navigate("/production-company-profile-edit");
  };

  const handleCreateProduction = () => {
    navigate("/production-profile-create");
  };

  const handleProfileView = () => {
    setProductionCompany(proCoId);
    navigate("/production-company-profile");
  };

  function action(event) {
    const x = event.target.id - 1;
    let y = false;

    //checks if the Production is owned in the array
    y = productionOwned.includes(data.children[x].docId);

    //if owned then redirect to the production-dashboard
    if (y) {
      setProductionId(data.children[x].docId);
      navigate("/production-dashboard");
      //if not the redirect to production profile view
    } else {
      setProductionCompany(proCoId);
      setProductionId(data.children[x].docId);
      navigate("/production-profile-view");
    }
  }

  const renderList2 = productionList.map((items) => (
    <ListItem key={items.id} disablePadding>
      <ListItemButton id={items.id} onClick={action} sx={{ border: 1, mb: 1 }}>
        {items.name}
      </ListItemButton>
    </ListItem>
  ));

  return (
    <div>
      {!loading ? (
        <Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            marginBottom={1}
          >
            <Grid item xs={12} textAlign="center">
              <Typography variant="h3">{companyData.name}</Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" marginBottom={1}>
            <Grid item xs={12} textAlign="center">
              <Button variant="outlined" onClick={handleProfileView}>
                View Company
              </Button>

              <Button variant="outlined" onClick={handleEditProfile}>
                Edit Company
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="center"
            direction="row"
            marginBottom={1}
          >
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                align="center"
                variant="outlined"
                style={{ padding: 20 }}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item>
                    <MovieFilterIcon fontSize="large" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h5">Production:</Typography>
                  </Grid>
                </Grid>

                <List>{renderList2}</List>
              </Card>
            </Grid>
          </Grid>
          <Grid container marginBottom={1}>
            <Grid item xs={12} textAlign="center">
              <Button variant="outlined" onClick={handleCreateProduction}>
                Create Production
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        "loading..."
      )}
    </div>
  );
}
