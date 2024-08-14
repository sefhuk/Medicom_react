import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, Box, ListItemText, Divider, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../utils/atom';
import { deleteCookie } from '../utils/cookies';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HttpsIcon from '@mui/icons-material/Https';
import { axiosInstance } from '../utils/axios';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Menu from '@mui/icons-material/Menu';

const Nav = () => {
  const navigate = useNavigate();
  const auth = useRecoilValue(userauthState);
  const location = useLocation();
  const setAuthState = useSetRecoilState(userauthState);
  const setChatRoomState = useSetRecoilState(chatRoomState);
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };


  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleHomePage = () => {
    navigate('/');
  };

  const handlePreviousPage = () => {
    navigate(-1);
  };

  const handleLogoutClick = async () => {
    const originAlert = window.alert;
    window.alert = () => {}
    setAuthState({ isLoggedIn: false });
    setChatRoomState({ rooms: [], selectedIndex: 0 });
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    await axiosInstance.post('/user-logout');
    deleteCookie('refreshToken');
    window.alert = originAlert;
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

  const isHomePage = location.pathname === '/';

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', textAlign: 'center', boxShadow: 'none' }}>
      <Toolbar>
      <IconButton
          size="large"
          edge="start"
          color="black"
          onClick={isHomePage ? handleHomePage : handlePreviousPage}
          sx={{ mr: 2 }}
        >
          {isHomePage ? <Menu /> : <ArrowBack />}
        </IconButton>

        
        <Box sx = {{my: 2, cursor: 'pointer'}} onClick={handleHomePage}>
          <img src='/images/Group_Logo.svg'/>
        </Box>
  
        {auth.isLoggedIn ? (
          <Button color="inherit" onClick={handleLogoutClick}>Logout</Button>
        ) : (
          <Button color="inherit" onClick={handleLoginClick}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
