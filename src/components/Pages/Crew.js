import React from "react";
import { useEffect, useState } from "react";
import { Button, Grid, Card, Typography, Avatar } from "@mui/material";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { getDownloadURL, ref } from "firebase/storage";

export default function Crew({ productionId, setUserId }) {
  //Mui dynamic rending for Treeitems Read more on https://mui.com/components/tree-view/#main-content
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //Data for treeview
  const [data, setData] = useState([]);
  //sub department
  const [sub, setSub] = useState([]);
  //position
  const [pos, setPos] = useState([]);
  //expansion for treeview
  const [expName, setExpName] = useState([]);

  const [profile, setProfile] = useState(false);
  const [productionData, setProductionData] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "",
    hasavatar: "",
    id: "",
  });
  const [url, setUrl] = useState("");
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

        //arr position
        let arr3 = [];
        let u = 1;
        //adds all the position to the arr position
        querySnapshot2.forEach((doc) => {
          arr3.push({
            name: doc.data().name,
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

        const docRef = doc(db, "production", productionId);
        //production data
        await getDoc(docRef).then((res) => {
          setProductionData(res.data().shortname);
        });
        setPos(arr3);
        setSub(arr2);
        setData(arr);
      } catch (err) {
        navigate("/producer-page");
      }
      setLoading(false);
    };
    getDepartment();
  }, [navigate, productionId]);

  //render TreeItems
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
  //Render Tree view
  const DataTreeView = ({ treeItems }) => {
    return (
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultExpanded={expName}
        onNodeSelect={action}
      >
        {profile ? (
          <>
            <Card
              variant="outlined"
              onClick={handleUser}
              style={{ cursor: "pointer", marginBottom: 5 }}
            >
              <Grid container direction="row" alignItems="center">
                <Grid item xs={4}>
                  <Avatar src={url} alt="ProfilePic" />
                </Grid>
                <Grid item xs={5}>
                  {userProfile.name}
                </Grid>
              </Grid>
            </Card>
          </>
        ) : (
          <Card variant="outlined" style={{ marginBottom: 5 }}>
            Unfilled
          </Card>
        )}
        {getTreeItemsFromData(treeItems)}
      </TreeView>
    );
  };
  const handleUser = () => {
    setUserId(userProfile.id);
    navigate("/user-profile");
  };
  function action(event, nodeId) {
    //I made the node Id from root/parent/number#
    //this is so that I could render the Addposition button or the Manage a postion button
    if (nodeId.includes("Parent") || nodeId.includes("root")) {
      //if its a Department
      if (data.find((el) => el.id === nodeId)) {
        navigate("/department-page");
      }
      //if its a Sub department
      if (sub.find((dat) => dat.id === nodeId)) {
        navigate("/department-page");
      }
    } else if (parseFloat(nodeId) && isFinite(nodeId)) {
      //if its a position
      const x = pos.findIndex((el) => el.id === nodeId);
      getProfile(pos[x].docId);
    }
  }

  const getProfile = async (Id) => {
    const docRef = doc(db, "production", productionId, "position", Id);
    let userId = "";
    await getDoc(docRef).then((doc) => {
      userId = doc.data().userid;
    });
    if (userId !== "") {
      const userRef = doc(db, "user", userId);
      await getDoc(userRef).then((doc) => {
        setUserProfile({
          name: doc.data().displayname,
          hasavatar: doc.data().hasavatar,
          id: userId,
        });
        if (doc.data().hasavatar) {
          const getImage = async () => {
            const imageRef = ref(storage, `user/avatar/${userId}`);
            setUrl(await getDownloadURL(imageRef));
          };
          getImage();
        }
      });
      setProfile(true);
    } else {
      setProfile(false);
    }
  };
  return (
    <div>
      {!loading ? (
        <Grid
          container
          justifyContent="center"
          direction="row"
          marginBottom={1}
        >
          <Grid item textAlign={"center"} xs={12}>
            <Typography variant="h4">{productionData}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              align="center"
              variant="outlined"
              style={{ padding: 20 }}
            >
              <DataTreeView onClick={action} treeItems={data} />
            </Card>
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </div>
  );
}
