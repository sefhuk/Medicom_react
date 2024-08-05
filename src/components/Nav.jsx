import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, Box, ListItemText, Divider} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userauthState } from '../utils/atom';
import { deleteCookie } from '../utils/cookies';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
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

  // drawer 열림, 닫힘
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // drawer 목록
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
    return(
      <>
        {auth.role==='ADMIN' ? (
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
    // 아톰에 있는 상태정보 라이브러리 써서 로그인 여부 판단해서 돼있으면 로그아웃, 안돼있으면 로그인 버튼 뜨게 일단 해놨습니다(auth.isLoggedIn ? <- 부분)
    <StyledAppBar position="static">
      <Toolbar>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)} // MenuIcon 클릭 시 Drawer 열림
            sx={{ mr: 2 }}
          >
            <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}> {/* anchor 속성 추가 */}
          {DrawerList}
        </Drawer>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          네비게이션바
        </Typography>
        {auth.isLoggedIn ? (
          <LoginIcon/>
        ) : (
          <Button color="inherit" onClick={handleLoginClick}>Login</Button>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

const StyledAppBar = styled(AppBar)`
  height: 8dvh;
  text-align: center;
  background-color: skyblue;
`;

export default Nav;
