import React from "react";
import { useEffect, useState } from "react";
import { Button, Grid, Card, Typography } from "@mui/material";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import SvgIcon from "@mui/material/SvgIcon";

const useStyles = makeStyles({
  label: {
    backgroundColor: "#2a3eb1",
    color: "White",
    marginTop: 5,
  },
  group: {
    borderLeft: `1px double`,
  },
  group2: {
    borderLeft: `1px double`,
  },
  label2: {
    backgroundColor: "#3d5afe",
    color: "White",
    marginTop: 5,
  },
  label3: {
    backgroundColor: "#637bfe",
    color: "White",
  },
});

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

export default function ProductionCrewList({
  productionId,
  companyId,
  setProductionId,
  setProductionCompany,
  setDepartmentId,
  setPositionId,
}) {
  //Mui dynamic rending for Treeitems Read more on https://mui.com/components/tree-view/#main-content
  const navigate = useNavigate();
  const classes = useStyles();
  const [productionData, setProductionData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  //Data for treeview
  const [data, setData] = useState([]);
  //sub department
  const [sub, setSub] = useState([]);
  //position
  const [pos, setPos] = useState([]);
  //expansion for treeview
  const [expName, setExpName] = useState([]);
  //current clicked treeview id
  const [clciked, setClicked] = useState("");
  //The current selected name of Treeview
  const [nameButton, setNameButton] = useState("");
  //Button management on selected Item in treeview
  const [addPosition, setAddPosition] = useState(false);
  const [manage, setManage] = useState(false);
  //Anchor for the Filter Button
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  //Array of the filtered Items
  const [filter, setFilter] = useState([]);
  //when Filter is active or not
  const [activeFilter, setActiveFilter] = useState(false);

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
        const docRef = doc(db, "production", productionId);
        //gets the name of production
        await getDoc(docRef).then((res) => {
          setProductionData({
            name: res.data().name,
          });
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
          classes={
            treeItemData.id.includes("root")
              ? { label: classes.label, group: classes.group }
              : treeItemData.id.includes("Parent")
              ? { label: classes.label2, group: classes.group2 }
              : { label: classes.label3 }
          }
        />
      );
    });
  };
  //Render Tree view
  const DataTreeView = ({ treeItems }) => {
    return (
      <TreeView
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultExpanded={expName}
        onNodeSelect={action}
      >
        {addPosition ? (
          <>
            <Typography variant="h5">{nameButton}</Typography>
            <Button onClick={handlePosition} variant="outlined" sx={{ mb: 1 }}>
              Add Position
            </Button>
            <Button onClick={handleEdit} variant="outlined" sx={{ mb: 1 }}>
              Edit
            </Button>
          </>
        ) : (
          ""
        )}
        {manage ? (
          <>
            <Typography variant="h5">{nameButton}</Typography>
            <Button onClick={handleManage} variant="outlined" sx={{ mb: 1 }}>
              Manage
            </Button>
            <Button onClick={handleEditPos} variant="outlined" sx={{ mb: 1 }}>
              Edit
            </Button>
          </>
        ) : (
          ""
        )}
        {getTreeItemsFromData(treeItems)}
      </TreeView>
    );
  };

  const handleEditPos = () => {
    setDepartmentId(clciked);
    setProductionCompany(companyId);
    setProductionId(productionId);
    navigate("/position-edit");
  };

  const handlePosition = () => {
    setDepartmentId(clciked);
    setProductionCompany(companyId);
    setProductionId(productionId);
    navigate("/position-create");
  };
  const handleManage = () => {
    setProductionId(productionId);
    setPositionId(clciked);
    navigate("/production-offer");
  };
  const handleEdit = () => {
    setProductionId(productionId);
    setDepartmentId(clciked);
    navigate("/edit-department");
  };

  function action(event, nodeId) {
    //I made the node Id from root/parent/number#
    //this is so that I could render the Addposition button or the Manage a postion button
    if (nodeId.includes("Parent") || nodeId.includes("root")) {
      //if its a Department
      if (data.find((el) => el.id === nodeId)) {
        const x = data.findIndex((el) => el.id === nodeId);
        setNameButton(data[x].name);
        setClicked(data[x].docId);
      }
      //if its a Sub department
      if (sub.find((dat) => dat.id === nodeId)) {
        const x = sub.findIndex((el) => el.id === nodeId);
        setNameButton(sub[x].name);
        setClicked(sub[x].docId);
      }
      setAddPosition(true);
      setManage(false);
    } else if (parseFloat(nodeId) && isFinite(nodeId)) {
      //if its a position
      const x = pos.findIndex((el) => el.id === nodeId);
      setNameButton(pos[x].name);
      setAddPosition(false);
      setManage(true);
      setClicked(pos[x].docId);
    }
  }

  //Navigates to the Create depeartment page
  const handleDepartment = () => {
    setProductionCompany(companyId);
    setProductionId(productionId);
    navigate("/department-create");
  };

  //When Filter button is pressed
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //closes the Filter DropDown when unfocused or clicked
  const handleClose = () => {
    setAnchorEl(null);
  };
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
            <Typography variant="h3">{productionData.name}</Typography>
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
