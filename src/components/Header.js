import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ListAlt, PermMedia, Settings, Logout, MenuBook, Login } from '@mui/icons-material';
import { useState } from 'react';
import { Avatar } from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom"
import { Alert } from '@mui/material';
import { onAuthStateChanged } from "firebase/auth"
import { auth } from '../firebase';
import firebase from '@firebase/app-compat';
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth";


const drawerWidth = 280;


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));





export default function Header() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [error , setError ] = useState();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSetting = () =>{
    navigate("/edit-profile")
  }

  async function hanedleLogout(){
    setError('')

    try{
        await logout()
        navigate("/login")
    }catch{
      setError('Failed to log out')
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Avatar alt="default" src="https://cvhrma.org/wp-content/uploads/2015/07/default-profile-photo.jpg"  style={{ height: '100px', width: '100px', alignSelf: 'center' }}/>
        <strong>EMAIL: </strong> {currentUser.email}
        <strong>UID: </strong> {currentUser.uid}
        {error && <Alert severity="error">{error}</Alert>}
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary={"Product List"} />
          </ListItem>
          <Divider/>

          <ListItem button>
            <ListItemIcon>
              <PermMedia />
            </ListItemIcon>
            <ListItemText primary={"Gallery"} />
          </ListItem>
          <Divider/>
          
          <ListItem button>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={"Setting"} onClick={handleSetting} />
          </ListItem>
          <Divider/>

          <ListItem button>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary={"Logout"} onClick={hanedleLogout}/>
          </ListItem>
          <Divider/>

          <ListItem button>
            <ListItemIcon>
              <MenuBook />
            </ListItemIcon>
            <ListItemText primary={"Producer Pages"} />
          </ListItem>
          <Divider/>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}