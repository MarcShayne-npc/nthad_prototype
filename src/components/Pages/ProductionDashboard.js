import React from "react";
import { useEffect, useState } from "react";
import { Button, Grid, Card, Link } from "@mui/material";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Create } from "@mui/icons-material";
import Typography from "@mui/material/Typography";

export default function ProductionDashboard({
  productionId,
  setProductionCompany,
  setProductionId,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productionData, setProductionData] = useState({
    name: "",
  });
  const [company, setCompany] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [crew, setCrewCount] = useState({
    Position: 0,
    Filled: 0,
    Unfilled: 0,
    Offers: 0,
    WithoutOffers: 0,
    Quit: 0,
    Declined: 0,
  });
  useEffect(() => {
    const getProduction = async () => {
      setLoading(true);

      try {
        const docRef = doc(db, "production", productionId);
        await getDoc(docRef).then((res) => {
          setProductionData({
            name: res.data().name,
          });
          setCompanyId(res.data().productioncompanyid);
          const coRef = doc(
            db,
            "productioncompany",
            res.data().productioncompanyid
          );
          getDoc(coRef).then((r) => {
            setCompany(r.data().name);
          });
        });

        const positionRef = collection(
          db,
          "production",
          productionId,
          "position"
        );
        const querySnapshot2 = await getDocs(positionRef);

        let position = 0;
        let active = 0;
        let created = 0;
        let offered = 0;
        let declined = 0;
        let retracted = 0;
        let terminated = 0;
        let quit = 0;
        let completed = 0;
        let removed = 0;

        //adds all the position to the arr position
        querySnapshot2.forEach((doc) => {
          position++;
          if (doc.data().status.includes("active")) {
            active++;
          }
          if (doc.data().status.includes("created")) {
            created++;
          }
          if (doc.data().status.includes("offered")) {
            offered++;
          }
          if (doc.data().status.includes("declined")) {
            declined++;
          }
          if (doc.data().status.includes("retracted")) {
            retracted++;
          }
          if (doc.data().status.includes("terminated")) {
            terminated++;
          }
          if (doc.data().status.includes("quit")) {
            quit++;
          }
          if (doc.data().status.includes("completed")) {
            completed++;
          }
          if (doc.data().status.includes("removed")) {
            removed++;
          }
        });
        console.log(active);
        setCrewCount({
          Position: position - removed,
          Filled: active + completed,
          Unfilled: position - active - removed - completed,
          Offers: offered,
          WithoutOffers: created + declined + retracted + terminated + quit,
          Quit: quit,
          Declined: declined,
        });
      } catch {
        navigate("/producer-page");
      }
      setLoading(false);
    };
    getProduction();
  }, [navigate, productionId]);

  const handleProductionEdit = () => {
    setProductionCompany(companyId);
    navigate("/production-profile-edit");
  };

  const handleCrew = () => {
    setProductionCompany(companyId);
    setProductionId(productionId);
    navigate("/production-crew-list");
  };
  const handleCompanyLink = () => {
    setProductionCompany(companyId);
    navigate("/production-company-profile");
  };
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
              <h1 onClick={handleProductionEdit} style={{ cursor: "pointer" }}>
                {productionData.name}
                <Create />
              </h1>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            marginBottom={1}
          >
            <Grid item xs={12} textAlign="center">
              <Link onClick={handleCompanyLink} style={{ cursor: "pointer" }}>
                <h3>{company}</h3>
              </Link>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            marginBottom={1}
            justifyContent="center"
          >
            <Grid item xs={5} md={2} textAlign="center">
              <Button variant="outlined">Documents</Button>
            </Grid>
            <Grid item xs={5} md={2} textAlign="center" marginBottom={1}>
              <Button variant="outlined">Calendar</Button>
            </Grid>
            <Grid item xs={5} md={2} textAlign="center">
              <Button variant="outlined">Credits Manager</Button>
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
                <Typography>Positions: {crew.Position}</Typography>
                <Typography>Filled: {crew.Filled}</Typography>
                <Typography>Unfilled: {crew.Unfilled}</Typography>
                <Typography>Without Offers: {crew.WithoutOffers}</Typography>
                <Typography>Quit: {crew.Quit}</Typography>
                <Typography>Declined: {crew.Declined}</Typography>
              </Card>
            </Grid>
          </Grid>
          <Grid container marginBottom={1}>
            <Grid item xs={12} textAlign="center">
              <Button variant="outlined" onClick={handleCrew}>
                Manage Crew
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
