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

export default function PositionOffer({
  setProductionId,
  setProductionCompany,
  setDepartmentId,
  setPositionId,
}) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [offerList, setOfferList] = useState([]);
  const [offer, setOffer] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getProductionCompany = async () => {
      setLoading(true);
      const q = query(
        collection(db, "user", currentUser.uid, "userposition"),
        where("status", "==", "offered")
      );
      let arr = [];
      let arr2 = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        arr.push({
          id: doc.id,
          name: `${doc.data().productionname} || ${
            doc.data().departmentname
          } : ${doc.data().positionname}`,
        });
        arr2.push({
          id: doc.id,
          productionId: doc.data().productionid,
          companyId: doc.data().productioncompanyid,
          departmentid: doc.data().departmentid,
          positionid: doc.data().positionid,
        });
      });
      setOffer(arr2);
      setOfferList(arr);
      setLoading(false);
    };

    getProductionCompany();
  }, [currentUser.uid]);

  const action = (e) => {
    const found = offer.find(({ id }) => id === e.target.id);

    setPositionId(found.positionid);
    setDepartmentId(found.departmentid);
    setProductionCompany(found.companyId);
    setProductionId(found.productionId);
    navigate("/offer-information");
  };

  const renderList = offerList.map((items) => (
    <ListItem key={items.id} disablePadding>
      <ListItemButton id={items.id} onClick={action} sx={{ border: 1 }}>
        {items.name}
      </ListItemButton>
    </ListItem>
  ));

  const handlePosHistory = () => {
    navigate("/user-position-history");
  };
  return (
    <div>
      {!loading ? (
        <Grid>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={4} sm={4} md={4}>
              <Button
                variant="outlined"
                onClick={handlePosHistory}
                sx={{ mb: 1 }}
              >
                Position History
              </Button>
              <Card align="center" variant="outlined" style={{ padding: 20 }}>
                <Typography variant="h5">Position Offers:</Typography>

                <List>{renderList}</List>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        "loading..."
      )}
    </div>
  );
}
