import React from "react";
import Header from "../Tools&Hooks/Header";
import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db, storage } from "../../firebase";
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
  const [userData, setUserData] = useState({
    Productioncompany: [""],
  });
  const [loading, setLoading] = useState(true);
  //Get Doc from firebase and set the value to userData
  //then later used to print the value in the TextFields
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      //get Document reference from firebase by using current user uid
      const docRef = doc(db, "user", documentId);
      //asynchronous get date from firebase then set's their data in a useState
      await getDoc(docRef)
        .then((res) => {
          setUserData({
            Productioncompany: res.data().productioncompaniesowned,
          });
          //add a foreach loop here in the productioncompaniedownder
          //with increment for id and userData.Productioncompany[n]
          setData({
            id: "root",
            name: "Production Company Owned",
            children: [
              {
                id: "1",
                name: userData.Productioncompany[0],
              },
            ],
          });
          setLoading(false);
          console.log(res.data().productioncompaniesowned);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };

    getUsers();
    return setUserData({});
  }, [documentId]);

  const renderTree2 = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const [data, setData] = useState({
    id: "root",
    name: "Production Company Owned",
    children: [
      {
        id: "1",
        name: userData.Productioncompany,
      },
    ],
  });
  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );
  function action(event, nodeId) {
    console.log("nodeId: ", nodeId);
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
            sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
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
            onNodeSelect={action}
          >
            {renderTree2(data2)}
            <Button>Create New Production</Button>
          </TreeView>
        </>
      ) : (
        "loading..."
      )}
    </div>
  );
}
