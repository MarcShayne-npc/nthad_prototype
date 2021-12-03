import React from "react";
import Header from "../Tools&Hooks/Header";
import { useState, useEffect } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";

const data2 = {
  id: "root",
  name: "Productions",
  children: [
    {
      id: "1",
      name: "Produtions Name",
    },
    {
      id: "2",
      name: "ProductionsName 2",
    },
  ],
};

export default function ProductionCompany() {
  //current user that is logged in
  const { currentUser } = useAuth();
  const documentId = currentUser.uid;
  const navigate = useNavigate();
  //Data for production Company
  const [data, setData] = useState({
    id: "root",
    name: "Production Company Owned",
    children: [{ id: "1", name: "Produtions Name" }],
  });
  const [loading, setLoading] = useState(true);

  //When page load setLoading to true
  //Get Production Company owned & production Owned
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      //get Document reference from firebase by using current user uid
      //if the owners field contains user uid
      const q = query(
        collection(db, "productioncompany"),
        where("owners", "array-contains", documentId)
      );
      //Get specified docs
      const querySnapshot = await getDocs(q);
      let arr = [];
      let i = 0;
      //For each company the user owned will add to children property of Data
      //also adds a Id with each children incrementing
      querySnapshot.forEach((doc) => {
        arr.push({
          id: (i + 1).toString(),
          name: doc.data().name,
        });
        i++;
        console.log(doc.id, " => ", doc.data());
      });
      //sets the Data for all the array elements in arry
      setData({
        id: "root",
        name: "Production Company Owned",
        children: arr,
      });
      //When all is done set loading to false
      setLoading(false);
    };

    getUsers();
  }, [documentId]);

  //Mui dynamic rending for Treeitems Read more on https://mui.com/components/tree-view/#main-content
  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );
  //When the Production Company tree item is selected
  //Get's the Node name and set's to global variabl to be used later
  function action(event, nodeId) {
    console.log("nodeId: ", nodeId);
    if (nodeId !== "root") {
      const x = JSON.parse(nodeId) - 1;
      console.log(data.children[x].name);
    }
  }
  function action2(event, nodeId) {
    console.log("nodeId: ", nodeId);
    if (nodeId !== "root") {
      const x = JSON.parse(nodeId) - 1;
      console.log(data2.children[x].name);
    }
  }
  const handleProductionCompanyProfileEdit = () => {
    navigate("/production-company-profile-edit");
  };
  return (
    <div>
      <Header />

      {!loading ? (
        <>
          <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={["root"]}
            defaultExpandIcon={<ChevronRightIcon />}
            multiSelect={false}
            sx={{ height: 200, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
            onNodeSelect={action}
          >
            {renderTree(data)}
            <Button onClick={handleProductionCompanyProfileEdit}>
              Create New Company
            </Button>
          </TreeView>
          <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={["root"]}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
            onNodeSelect={action2}
          >
            {renderTree(data2)}
            <Button>Create New Production</Button>
          </TreeView>
        </>
      ) : (
        "loading..."
      )}
    </div>
  );
}
