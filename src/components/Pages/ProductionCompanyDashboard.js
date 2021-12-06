import React from "react";
import { useEffect, useState } from "react";
import { Button, Grid, Card } from "@mui/material";
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
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";

export default function ProductionCompanyDashboard({
  companyId,
  setProductionId,
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
    children: [{ id: "1", name: "Produtions Name" }],
  });
  const [productionOwned, setproductionOwned] = useState([]);

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
        name: "Production Owned",
        children: arr2,
      });
      //When all is done set loading to false
      setLoading(false);
    };

    getProductionCompany();
  }, [companyId, userUid]);

  //Mui dynamic rending for Treeitems Read more on https://mui.com/components/tree-view/#main-content
  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  useEffect(() => {
    const getUsers = async () => {
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
    getUsers();
  }, [companyId, navigate]);

  const handleEditProfile = () => {
    navigate("/production-company-profile-edit");
  };

  const handleCreateProduction = () => {
    navigate("/production-profile-create");
  };

  const handleProfileView = () => {
    navigate("/production-company-profile");
  };

  function action(event, nodeId) {
    if (productionOwned.includes(data.children[nodeId - 1].docId)) {
      setProductionId(data.children[nodeId - 1].docId);
      navigate("/production-dashboard");
    }
  }

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
              <h2>{companyData.name}</h2>
            </Grid>
          </Grid>
          <Grid container direction="row" marginBottom={1}>
            <Grid item xs={12} textAlign="center">
              <Button variant="outlined" onClick={handleProfileView}>
                View Profile
              </Button>

              <Button variant="outlined" onClick={handleEditProfile}>
                Edit Profile
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
                <TreeView
                  aria-label="rich object"
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpanded={["root"]}
                  defaultExpandIcon={<ChevronRightIcon />}
                  sx={{
                    height: 200,
                    flexGrow: 1,
                    maxWidth: 400,
                    overflowY: "auto",
                  }}
                  onNodeSelect={action}
                >
                  {renderTree(data)}
                </TreeView>
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