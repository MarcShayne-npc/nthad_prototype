import React from "react";
import { useEffect, useState } from "react";
import { Button, Grid, Card, Link } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Create } from "@mui/icons-material";

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
  useEffect(() => {
    const getPro = async () => {
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
      } catch {
        navigate("/producer-page");
      }
      setLoading(false);
    };
    getPro();
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
              ></Card>
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
