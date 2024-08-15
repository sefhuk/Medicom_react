import React, { useState } from 'react';
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../utils/atom';
import { deleteCookie } from '../utils/cookies';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HttpsIcon from '@mui/icons-material/Https';
import { axiosInstance } from '../utils/axios';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Menu from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

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
    setAuthState({ isLoggedIn: false });
    setChatRoomState({ rooms: [], selectedIndex: 0 });
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    await axiosInstance.post('/user-logout');
    deleteCookie('refreshToken');
    navigate('/');
  };

  const OnClickMyPage = () => {
    navigate('/my-page');
  };

  const OnClickAdminPage = () => {
    navigate('/admin-page');
  };

  const isHomePage = location.pathname === '/';

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'white',
        textAlign: 'center',
        boxShadow: 'none',
        borderBottom: '1px solid #e9e9e9',
        height: '60px',
      }}
    >
      <Toolbar
        sx={{
          minHeight: '60px',
          padding: '0 10px',
        }}
      >
        <IconButton
          size="small"
          edge="start"
          color="black"
          onClick={isHomePage ? 'none' : handlePreviousPage}
          sx={{ mr: 1 }}
        >
          {isHomePage ? <Menu sx = {{ height:'20px', width:'20px' }}/> : <ArrowBack sx = {{ height:'20px', width:'20px' }}/>}
        </IconButton>

        <Box sx={{ my: 1, cursor: 'pointer' }} onClick={handleHomePage}>
          <img src='/images/Group_Logo.svg' alt="Logo" style={{ height: '40px' }} />
        </Box>

        <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          {auth.isLoggedIn ? (
            <IconButton color="black" size="small" onClick={handleLogoutClick} sx={{ bgcolor: 'var(--paper-soft)', height:'30px', width:'30px' }}>
              <LogoutIcon sx = {{ height:'20px', width:'20px' }} />
            </IconButton>
          ) : (
            <IconButton color="black" size="small" onClick={handleLoginClick} sx={{ bgcolor: 'var(--paper-soft)', height:'30px', width:'30px' }}>
              <LoginIcon sx = {{ height:'20px', width:'20px' }}/>
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
