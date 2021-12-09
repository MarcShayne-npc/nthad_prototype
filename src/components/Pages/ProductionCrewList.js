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

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      style={
        nodes.id.includes("Parent")
          ? { backgroundColor: "#5040a0", color: "white" }
          : { backgroundColor: "white", color: "black" }
      }
    >
      {Array.isArray(nodes.children) ? (
        <>{nodes.children.map((node) => renderTree(node))}</>
      ) : null}
    </TreeItem>
  );

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
            <Button onClick={handleDepartment}>Create Department</Button>
            <TreeView
              aria-label="rich object"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpanded={["root"]}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{
                height: 400,
                flexGrow: 1,
                maxWidth: 400,
                overflowY: "auto",
              }}
              onNodeSelect={action}
            >
              {renderTree(data)}
            </TreeView>
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
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
