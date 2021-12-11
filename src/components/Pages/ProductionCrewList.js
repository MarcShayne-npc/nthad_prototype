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

const data = {
  id: "root",
  name: "Camera and Eletric",
  children: [
    {
      id: "Parent 1",
      name: "Camera",
      children: [
        {
          id: "1",
          name: "Camera Operator",
        },
      ],
    },
    {
      id: "Parent 2",
      name: "Electric",
      children: [
        {
          id: "2",
          name: "Gaffer",
        },
      ],
    },
  ],
};

export default function ProductionCrewList({
  productionId,
  companyId,
  setProductionId,
}) {
  //Mui dynamic rending for Treeitems Read more on https://mui.com/components/tree-view/#main-content
  const navigate = useNavigate();
  const production = productionId;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDepartment = async () => {
      setLoading(true);
      try {
        const docRef = query(
          collection(db, "production", productionId, "department"),
          where("department_fields.parentid", "==", "")
        );
        const querySnapshot = await getDocs(docRef);
        let arr2 = [];

        querySnapshot.forEach((doc) => {
          arr2.push({ name: doc.data().department_fields.name, id: doc.id });
        });
      } catch (err) {
        console.log("something went wrong reloading...");
      }
      setLoading(false);
    };
    getDepartment();
  }, [productionId]);

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      style={
        nodes.id.includes("Parent")
          ? { backgroundColor: "#2196f3", color: "white" }
          : nodes.id.includes("root")
          ? { backgroundColor: "#3f51b5", color: "white" }
          : { backgroundColor: "white", color: "black" }
      }
    >
      {Array.isArray(nodes.children) ? (
        <>{nodes.children.map((node) => renderTree(node))}</>
      ) : null}
    </TreeItem>
  );

  const DataTreeView = ({ treeItems }) => {
    return (
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultExpanded={["root", "Parent 1", "Parent 2"]}
      >
        {renderTree(treeItems)}
      </TreeView>
    );
  };

  const [addProduction, setAddProduction] = useState(false);
  const [manage, setManage] = useState(false);
  function action(event, nodeId) {
    if (nodeId.includes("Parent")) {
      setAddProduction(true);
      setManage(false);
    } else if (parseFloat(nodeId) && isFinite(nodeId)) {
      setAddProduction(false);
      setManage(true);
    }
  }

  const handleDepartment = () => {
    setProductionId(production);
    navigate("/department-create");
  };
  return (
    <div>
      <Grid container justifyContent="center" direction="row" marginBottom={1}>
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            align="center"
            variant="outlined"
            style={{ padding: 20 }}
          >
            {productionId}
            <Button onClick={handleDepartment}>Create Department</Button>
            {addProduction ? (
              <>
                <Button>Add Positon</Button>
              </>
            ) : (
              <></>
            )}
            {manage ? (
              <>
                <Button>Manage</Button>
              </>
            ) : (
              <></>
            )}
            <DataTreeView onClick={action} treeItems={data} />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
