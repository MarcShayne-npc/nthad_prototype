import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  ListAlt,
  PermMedia,
  Settings,
  Logout,
  MenuBook,
  Create,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import { MenuItem, Button, Menu } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import { getDoc, doc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import TheatersIcon from "@mui/icons-material/Theaters";
import ArticleIcon from "@mui/icons-material/Article";
import MessageIcon from "@mui/icons-material/Message";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";

const drawerWidth = 280;
//Imported most of this function in https://mui.com/components/drawers/ to find out more
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
//style for the small avatar next to the profile
const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 35,
  height: 35,
  border: `2px solid ${theme.palette.background.paper}`,
  cursor: "pointer",
}));

export default function Header({ productionId }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [productionMenu, setProductionMenu] = useState(false);

  const handleDrawerOpen = () => {
    console.log(productionId);
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
    setOpen(false);
  };
  const handleProductionList = () => {
    navigate("/production-list");
    setOpen(false);
  };
  const handlePositionOffers = () => {
    navigate("/position-offer");
    setOpen(false);
  };
  const handleProducerPage = () => {
    navigate("/producer-page");
    setOpen(false);
  };
  async function hanedleLogout() {
    setError("");

    try {
      await logout();
      navigate("/");
    } catch {
      setError("Failed to log out");
    }
  }
  //current user that is logged in
  const documentId = currentUser.uid;

  //User Data in firestore this is null if the user is new
  //all the data that is being pass through firestore
  //There is no "productioncompaniesowned" and productionsowned defaulted to be an empty array
  const [userData, setUserData] = useState({
    displayname: "",
    hasAvatar: false,
  });

  //Get Doc from firebase and set the value to userData
  //then later used to print the value in the TextFields
  useEffect(() => {
    const getUsers = async () => {
      //get Document reference from firebase by using current user uid
      const docRef = doc(db, "user", documentId);
      //asynchronous get date from firebase then set's their data in a useState
      await getDoc(docRef)
        .then((res) => {
          setUserData({
            displayname: res.data().displayname,
            hasAvatar: res.data().hasavatar,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUsers();
  }, [documentId]);

  const [url, setUrl] = useState();

  useEffect(() => {
    const getImage = async () => {
      const imageRef = ref(storage, `user/avatar/${documentId}`);
      setUrl(await getDownloadURL(imageRef));
    };
    if (userData.hasAvatar === true) {
      getImage();
    } else {
      return;
    }
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDashboard = () => {
    setAnchorEl(null);
  };
  const handleDepartmentPage = () => {
    navigate("/department-page");
    setAnchorEl(null);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          NTH AD
          <div>
            <Button
              variant="outlined"
              id="demo-positioned-button"
              aria-controls="demo-positioned-menu"
              aria-expanded={menuOpen ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
              style={{
                color: "#FFFFFF",
                borderColor: "#FFFFFF",
                marginLeft: "20px",
              }}
            >
              Select Production
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleDashboard}>
                <DashboardIcon />
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleDepartmentPage}>
                <CorporateFareIcon /> Department Page
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <TheatersIcon />
                Scenes
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ArticleIcon /> Script
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <MessageIcon />
                Messages
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <CalendarTodayIcon />
                Calendar
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <PeopleAltIcon /> Crew
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <DeveloperBoardIcon />
                Storyboards
              </MenuItem>
            </Menu>
          </div>
          <Box display="flex" flexGrow={1} justifyContent="flex-end">
            <Stack spacing={4} direction="row" sx={{ color: "action.active" }}>
              <Badge
                color="secondary"
                badgeContent={0}
                showZero
                style={{ cursor: "pointer" }}
              >
                <MailIcon />
              </Badge>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <SmallAvatar>
                {" "}
                <Create />{" "}
              </SmallAvatar>
            }
          >
            <Avatar
              alt="DefaultPic"
              src={url}
              style={{ height: "100px", width: "100px", cursor: "pointer" }}
              onClick={handleEditProfile}
            />
          </Badge>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center">
          <h2>
            <strong>{userData.displayname}</strong>
          </h2>
        </Stack>
        {error && <Alert severity="error">{error}</Alert>}
        <Divider />
        <List>
          <ListItem button onClick={handleProductionList}>
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary={"Production List"} />
          </ListItem>
          <Divider />

          <ListItem button onClick={handlePositionOffers}>
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary={"Position Offers"} />
          </ListItem>
          <Divider />

          <ListItem button>
            <ListItemIcon>
              <PermMedia />
            </ListItemIcon>
            <ListItemText primary={"Gallery"} />
          </ListItem>
          <Divider />

          <ListItem button>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={"Setting"} />
          </ListItem>
          <Divider />

          <ListItem button onClick={hanedleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItem>
          <Divider />

          <ListItem button onClick={handleProducerPage}>
            <ListItemIcon>
              <MenuBook />
            </ListItemIcon>
            <ListItemText primary={"Producer Pages"} />
          </ListItem>
          <Divider />
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
