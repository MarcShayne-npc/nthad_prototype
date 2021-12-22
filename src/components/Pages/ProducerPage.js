import React from "react";
import { useState, useEffect } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Card, Typography, Grid } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AddIcon from "@mui/icons-material/Add";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";

export default function ProducerPage({
  setProductionCompany,
  setProductionId,
}) {
  //current user that is logged in
  const { currentUser } = useAuth();
  const userUid = currentUser.uid;
  const navigate = useNavigate();
  //Data for production Company
  const [data, setData] = useState({
    id: "root",
    name: "Production Company Owned",
    children: [{ id: "1", name: "Company Name", docId: "" }],
  });

  const [data2, setData2] = useState({
    id: "root",
    name: "Production Company Owned",
    children: [{ id: "1", name: "Company Name", docId: "" }],
  });
  const [loading, setLoading] = useState(true);
  const [companyList, setCompanyList] = useState([]);
  const [productionList, setProductionList] = useState([]);
  //When page load setLoading to true
  //Get Production Company owned & production Owned
  useEffect(() => {
    const getProductionCompany = async () => {
      setLoading(true);
      //get Document reference from firebase by using current user uid
      //if the owners field contains user uid
      const q = query(
        collection(db, "productioncompany"),
        where("owners", "array-contains", userUid)
      );
      //gets document from production
      const q2 = query(
        collection(db, "production"),
        where("owners", "array-contains", userUid)
      );
      //Get company specified docs
      const querySnapshot = await getDocs(q);
      const querySnapshot2 = await getDocs(q2);
      //this variables are for company
      let arr = [];
      let i = 0;
      //this variables are for productions object
      let arr2 = [];
      let n = 0;
      //For each company the user owned will add to children property of Data
      //also adds a Id with each children incrementing
      //gets the production id
      let arr4 = [];
      querySnapshot2.forEach((doc) => {
        arr2.push({
          id: (n + 1).toString(),
          name: doc.data().name,
          proId: doc.id,
        });
        arr4.push(doc.id);
        n++;
      });

      querySnapshot.forEach((doc) => {
        arr.push({
          id: (i + 1).toString(),
          name: doc.data().name,
          docId: doc.id,
        });
        i++;
      });
      setCompanyList(arr);
      setProductionList(arr2);
      //sets the Data for all the array elements in arry
      setData({
        id: "root",
        name: "Production Company Owned",
        children: arr,
      });

      setData2({
        id: "root2",
        name: "Production Owned",
        children: arr2,
      });
      //When all is done set loading to false
      setLoading(false);
    };

    getProductionCompany();
  }, [userUid]);

  //when list is pressed get comapny id of the array
  //then setState of production id
  function action(e) {
    const x = e.target.id - 1;
    setProductionCompany(data.children[x].docId);
    navigate("/production-company-dashboard");
  }

  function action2(e) {
    const x = e.target.id - 1;
    setProductionId(data2.children[x].proId);
    navigate("/production-dashboard");
  }
  const handleProductionCompanyProfileCreate = () => {
    navigate("/production-company-profile-create");
  };

  const renderList = companyList.map((items) => (
    <ListItem key={items.id} disablePadding>
      <ListItemButton id={items.id} onClick={action} sx={{ border: 1 }}>
        {items.name}
      </ListItemButton>
    </ListItem>
  ));

  const renderList2 = productionList.map((items) => (
    <ListItem key={items.id} disablePadding>
      <ListItemButton id={items.id} onClick={action2} sx={{ border: 1, mb: 1 }}>
        {items.name}
      </ListItemButton>
    </ListItem>
  ));

  return (
    <div>
      {!loading ? (
        <>
          <Grid container spacing={2} direction="column" md={4}>
            <Grid item>
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
                    <ApartmentIcon fontSize="large" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h5">
                      Production Company Owned:
                    </Typography>
                  </Grid>
                </Grid>

                <List>{renderList}</List>
                <Button onClick={handleProductionCompanyProfileCreate}>
                  <AddIcon />
                  Create New Company
                </Button>
              </Card>
            </Grid>
            <Grid item>
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
                    <Typography variant="h5">Production Owned:</Typography>
                  </Grid>
                </Grid>

                <List>{renderList2}</List>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        "loading..."
      )}
    </div>
  );
}
