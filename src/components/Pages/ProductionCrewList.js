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
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";

export default function ProductionCrewList({
  productionId,
  companyId,
  setProductionId,
}) {
  //Mui dynamic rending for Treeitems Read more on https://mui.com/components/tree-view/#main-content
  const navigate = useNavigate();
  productionId = "PeuccV3GykrGe1gSaFUb"; //temp
  const [loading, setLoading] = useState(false);
  const [data1, setData] = useState([]);
  const [expName, setExpName] = useState([]);

  useEffect(() => {
    const getDepartment = async () => {
      setLoading(true);
      try {
        //Department referece from firestore
        const departmentRef = collection(
          db,
          "production",
          productionId,
          "department"
        );
        const positionRef = collection(
          db,
          "production",
          productionId,
          "position"
        );
        //gets all firestore documens in deparments
        const querySnapshot = await getDocs(departmentRef);
        const querySnapshot2 = await getDocs(positionRef);
        //just some temp variables
        //department parent object
        let arr = [];
        //department child object
        let arr2 = [];
        //incrementation for department parent
        let i = 1;
        //increamentation for department child
        let n = 1;
        //name of all the ids in both child and parent used to defualtexpand Treeview
        let expandedData = [];

        querySnapshot.forEach((doc) => {
          //Seperate parent a child departments
          if (doc.data().parentid === "") {
            arr.push({
              name: doc.data().name,
              id: "root " + i,
              docId: doc.id,
              children: "",
            });
            expandedData.push("root " + i);
            i++;
          } else {
            arr2.push({
              name: doc.data().name,
              id: "Parent " + n,
              docId: doc.id,
              parentid: doc.data().parentid,
              children: "",
            });
            expandedData.push("Parent " + n);
            n++;
          }
        });
        //sets the exanded to be used later at TreeView
        setExpName(expandedData);

        let arr3 = [];
        let u = 1;
        querySnapshot2.forEach((doc) => {
          arr3.push({
            name: doc.data().name + ` (${doc.data().status})`,
            id: u.toString(),
            docId: doc.id,
            departmentid: doc.data().departmentid,
          });
          u++;
        });

        //adds all the position to the coresspoding Departments
        arr3.forEach((child) => {
          const obj1 = arr.findIndex((el) => el.docId === child.departmentid);
          if (obj1 !== -1) {
            arr[obj1].children = [...arr[obj1].children, child];
          } else {
            const obj1 = arr2.findIndex(
              (el) => el.docId === child.departmentid
            );
            arr2[obj1].children = [...arr2[obj1].children, child];
          }
        });

        //then add a children property of arr2
        arr2.forEach((child) => {
          //find the index when arr.id is the same as arr2.parentid
          const obj1 = arr.findIndex((el) => el.docId === child.parentid);
          arr[obj1].children = [...arr[obj1].children, child];
        });
        setData(arr);
      } catch (err) {
        console.log(err);
        console.log("something went wrong reloading...");
      }
      setLoading(false);
    };
    getDepartment();
  }, [productionId]);

  const getTreeItemsFromData = (treeItems) => {
    return treeItems.map((treeItemData) => {
      let children = undefined;
      if (treeItemData.children && treeItemData.children.length > 0) {
        children = getTreeItemsFromData(treeItemData.children);
      }
      return (
        <TreeItem
          key={treeItemData.id}
          nodeId={treeItemData.id}
          label={treeItemData.name}
          children={children}
          style={
            treeItemData.id.includes("root")
              ? { backgroundColor: "#673ab7", color: "white" }
              : treeItemData.id.includes("Parent")
              ? { backgroundColor: "#3f51b5", color: "white" }
              : { backgroundColor: "#2196f3", color: "white" }
          }
        />
      );
    });
  };

  const DataTreeView = ({ treeItems }) => {
    return (
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultExpanded={expName}
        //onNodeSelect={action}
      >
        {getTreeItemsFromData(treeItems)}
        {addPosition ? <Button>Add Position</Button> : ""}
        {manage ? <Button>Manage</Button> : ""}
      </TreeView>
    );
  };
  const [nameButton, setNameButton] = useState("");
  const [addPosition, setAddPosition] = useState(false);
  const [manage, setManage] = useState(false);
  function action(event, nodeId) {
    console.log(nodeId);
    //I made the node Id from root/parent/number#
    //this is so that I could render the Addposition button or the Manage a postion button
    if (nodeId.includes("Parent")) {
      setAddPosition(true);
      setManage(false);
    } else if (parseFloat(nodeId) && isFinite(nodeId)) {
      setAddPosition(false);
      setManage(true);
    }
  }

  const handleDepartment = () => {
    setProductionId(productionId); //temp
    navigate("/department-create");
  };
  return (
    <div>
      <Grid container justifyContent="center" direction="row" marginBottom={1}>
        <Grid item xs={12} md={4}>
          {productionId}
          <Button onClick={handleDepartment}>Create Department</Button>
          <Card
            elevation={0}
            align="center"
            variant="outlined"
            style={{ padding: 20 }}
          >
            <DataTreeView onClick={action} treeItems={data1} />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
