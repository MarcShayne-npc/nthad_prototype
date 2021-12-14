import React from "react";
import { useEffect, useState } from "react";
import { Button, Grid, Card } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";

export default function ProductionCrewList({
  productionId,
  companyId,
  setProductionId,
  setProductionCompany,
}) {
  //Mui dynamic rending for Treeitems Read more on https://mui.com/components/tree-view/#main-content
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sub, setSub] = useState([]);
  const [pos, setPos] = useState([]);
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

        //arr position
        let arr3 = [];
        let u = 1;
        //adds all the position to the arr position
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
        {addPosition ? (
          <>
            <Button onClick={handlePosition} variant="outlined" sx={{ mb: 1 }}>
              Add Position | {nameButton}
            </Button>
            <Button onClick={handleEdit} variant="outlined" sx={{ mb: 1 }}>
              Edit
            </Button>
          </>
        ) : (
          ""
        )}
        {manage ? (
          <Button onClick={handleManage} variant="outlined" sx={{ mb: 1 }}>
            Manage | {nameButton}
          </Button>
        ) : (
          ""
        )}
        {getTreeItemsFromData(treeItems)}
      </TreeView>
    );
  };
  const handlePosition = () => {
    navigate("/position-create");
  };
  const handleManage = () => {
    navigate("/production-offer");
  };
  const handleEdit = () => {
    navigate("/edit-department");
  };
  //The current selected name of Treeview
  const [nameButton, setNameButton] = useState("");
  //Button management on selected Item in treeview
  const [addPosition, setAddPosition] = useState(false);
  const [manage, setManage] = useState(false);
  function action(event, nodeId) {
    //I made the node Id from root/parent/number#
    //this is so that I could render the Addposition button or the Manage a postion button
    if (nodeId.includes("Parent") || nodeId.includes("root")) {
      //if its a Department
      if (data.find((el) => el.id === nodeId)) {
        const x = data.findIndex((el) => el.id === nodeId);
        setNameButton(data[x].name);
      }
      //if its a Sub department
      if (sub.find((dat) => dat.id === nodeId)) {
        const x = sub.findIndex((el) => el.id === nodeId);
        setNameButton(sub[x].name);
      }
      setAddPosition(true);
      setManage(false);
    } else if (parseFloat(nodeId) && isFinite(nodeId)) {
      //if its a position
      const x = pos.findIndex((el) => el.id === nodeId);
      setNameButton(pos[x].name);
      setAddPosition(false);
      setManage(true);
    }
  }
  //Navigates to the Create depeartment page
  const handleDepartment = () => {
    setProductionCompany(companyId);
    setProductionId(productionId);
    navigate("/department-create");
  };
  //Anchor for the Filter Button
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  //When Filter button is pressed
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //closes the Filter DropDown when unfocused or clicked
  const handleClose = () => {
    setAnchorEl(null);
  };
  //Array of the filtered Items
  const [filter, setFilter] = useState([]);
  //when Filter is active or not
  const [activeFilter, setActiveFilter] = useState(false);
  //When filter is not active close Filter Card
  const handleActiveFilter = () => {
    setActiveFilter(false);
    setAnchorEl(null);
  };
  //when Filter is pressed
  const handleFilter = (e) => {
    let arr = [];
    let i = 0;
    //get all specified filter item
    pos.forEach((p) => {
      if (p.name.includes(e.target.id)) {
        arr.push(pos[i]);
      }
      i++;
    });
    setFilter(arr);
    setActiveFilter(true);
    setAnchorEl(null);
  };
  //When Filtered Item list is pressed
  const action2 = (e) => {
    const x = e.target.id - 1;
    setNameButton(pos[x].name);
    navigate("/production-offer");
  };
  //renders the list of filtered Items
  const renderList = filter.map((items) => (
    <ListItem key={items.id} disablePadding>
      <ListItemButton
        id={items.id}
        onClick={action2}
        style={{ backgroundColor: "#2196f3", color: "white" }}
      >
        {items.name}
      </ListItemButton>
    </ListItem>
  ));

  return (
    <div>
      <Grid container justifyContent="center" direction="row" marginBottom={1}>
        {!loading ? (
          <Grid item textAlign={"center"} xs={12}>
            {productionId}
          </Grid>
        ) : (
          ""
        )}
        <Grid item xs={12} md={4}>
          <Grid container justifyContent="center">
            <Grid item xs={6}>
              <Button onClick={handleDepartment}>Create Department</Button>
            </Grid>
            <Grid item xs={3}>
              <div>
                <Button
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variant="outlined"
                  disableElevation
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Filter
                </Button>
                <Menu
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem id="All" onClick={handleActiveFilter} disableRipple>
                    All
                  </MenuItem>
                  <MenuItem id="created" onClick={handleFilter} disableRipple>
                    created
                  </MenuItem>
                  <MenuItem id="offered" onClick={handleFilter} disableRipple>
                    offered
                  </MenuItem>
                  <MenuItem id="active" onClick={handleFilter} disableRipple>
                    active
                  </MenuItem>
                  <MenuItem id="declined" onClick={handleFilter} disableRipple>
                    declined
                  </MenuItem>
                  <MenuItem id="retracted" onClick={handleFilter} disableRipple>
                    retracted
                  </MenuItem>
                  <MenuItem
                    id="terminated"
                    onClick={handleFilter}
                    disableRipple
                  >
                    terminated
                  </MenuItem>
                  <MenuItem id="quit" onClick={handleFilter} disableRipple>
                    quit
                  </MenuItem>
                  <MenuItem id="completed" onClick={handleFilter} disableRipple>
                    completed
                  </MenuItem>
                  <MenuItem id="removed" onClick={handleFilter} disableRipple>
                    removed
                  </MenuItem>
                </Menu>
              </div>
            </Grid>
          </Grid>
          {!loading ? (
            <>
              {activeFilter ? (
                <Card
                  elevation={0}
                  align="center"
                  variant="outlined"
                  style={{ padding: 20 }}
                >
                  <List>{renderList}</List>
                </Card>
              ) : (
                <Card
                  elevation={0}
                  align="center"
                  variant="outlined"
                  style={{ padding: 20 }}
                >
                  <DataTreeView onClick={action} treeItems={data} />
                </Card>
              )}
            </>
          ) : (
            "Loading..."
          )}
        </Grid>
      </Grid>
    </div>
  );
}
