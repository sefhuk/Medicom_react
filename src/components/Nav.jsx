import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, Box, ListItemText, Divider, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userauthState } from '../utils/atom';
import { deleteCookie } from '../utils/cookies';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HttpsIcon from '@mui/icons-material/Https';
import { axiosInstance } from '../utils/axios';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';

const Nav = () => {
  const navigate = useNavigate();
  const auth = useRecoilValue(userauthState);
  const setAuthState = useSetRecoilState(userauthState);
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = async () => {
    setAuthState({ isLoggedIn: false });
    localStorage.removeItem('token');
    await axiosInstance.post('/user-logout');
    deleteCookie('refreshToken');
    navigate('/');
  };

  const LoginIcon = () => {
    return (
      <>
        {auth.role === 'ADMIN' ? (
          <IconButton>
            <HttpsIcon fontSize='large' onClick={OnClickAdminPage}></HttpsIcon>
          </IconButton>
        ) : (<></>)}
        <IconButton onClick={OnClickMyPage}>
          <AccountCircleIcon fontSize='large'/>
        </IconButton>
        <Button color="inherit" onClick={handleLogoutClick}>Logout</Button>
      </>
    );
  }

  const OnClickMyPage = () => {
    navigate('/my-page');
  }

  const OnClickAdminPage = () => {
    navigate('/admin-page');
  }

  return (
    <AppBar position="static" sx={{ bgcolor: 'black', textAlign: 'center' }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left"
          open={open} onClose={toggleDrawer(false)}
          sx={{
            maxWidth: '60dvh',
            overflow: 'hidden',
            margin: 'auto',
            '& .MuiBackdrop-root': {
              margin: 'auto',
            },
            '& .MuiPaper-root': {
              position: 'absolute'
            }
          }}
        >
          {DrawerList}
        </Drawer>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          네비게이션바
        </Typography>
        {auth.isLoggedIn ? (
          <LoginIcon />
        ) : (
          <Button color="inherit" onClick={handleLoginClick}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
